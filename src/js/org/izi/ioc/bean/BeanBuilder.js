/**
 * @ignore
 * @requires ../../utils/forEach.js
 * @requires ../../utils/some.js
 * @requires ../../utils/getClassByName.js
 */
!function (module) {

    function matchesById(selfId, otherId) {
        return selfId === otherId;
    }

    function matchesByType(factory, type) {
        return factory.matchesByType(type);
    }

    function injectDependenciesOnProperties(context, bean) {
        var prop;
        bean.iziInjectingInProgress = true;
        for (prop in bean) {
            var injection = bean[prop];
            if (injection && injection.isIziInjection) {
                injection.injector(bean, prop, injection.resolveBean(context));
            }
        }
        delete bean.iziInjectingInProgress;
    }

    /**
     * Bean instance builder based on given strategy.
     * @class Izi.ioc.bean.BeanBuilder
     * @private
     * @constructor
     * @param {String} id
     * @param {Object} strategy
     * @param {Function} strategy.init
     * @param {Function} strategy.create
     * @param {Function} strategy.matchesByType
     * @param {Function} strategy.getArguments
     * @param {Object} globals
     */
    var BeanBuilder = function Izi_ioc_bean_BeanBuilder(id, strategy, globals) {
        this.id = id;
        this.strategy = strategy;
        this.globals = globals;
        this.createdBeans = [];
        if (!globals) {
            throw new Error("`globals` not defined");
        }
    };

    /**
     * Delegates init on strategy
     * @member Izi.ioc.bean.BeanBuilder
     * @private
     * @param beansContext
     * @return {*}
     */
    BeanBuilder.prototype.init = function (beansContext) {
        return this.strategy.init(beansContext);
    };

    /**
     * Delegates create on strategy
     * @member Izi.ioc.bean.BeanBuilder
     * @private
     * @param context
     * @return {*}
     */
    BeanBuilder.prototype.create = function (context) {
        var bean = this.strategy.create(context);

        if (bean.iziInjectingInProgress) {
            return bean;
        }

        injectDependenciesOnProperties(context, bean);

        if (bean.iziContext && !bean.iziContextCalled) {
            bean.iziContextCalled = true;
            bean.iziContext(context);
        }
        if (bean.iziInit && !bean.iziInitCalled) {
            bean.iziInitCalled = true;
            bean.iziInit();
        }

        this.createdBeans.push(bean);

        return bean;
    };

    BeanBuilder.prototype.destroyCreatedBeans = function () {
        module.utils.forEach(this.createdBeans, function (createdBean) {
            if (createdBean.iziDestroy) {
                try {
                    createdBean.iziDestroy();
                } catch (e) {
                }
            }
        });

        this.id = undefined;
        this.strategy = undefined;
        this.createdBeans = undefined;
    };

    BeanBuilder.prototype.preDestroyCreatedBeans = function () {
        module.utils.forEach(this.createdBeans, function (createdBean) {
            if (createdBean.iziPreDestroy) {
                createdBean.iziPreDestroy();
            }
        });
    };

    /**
     * Matches factory by id or class type
     * @member Izi.ioc.bean.BeanBuilder
     * @private
     * @param {String|Function} idOrType
     * @return {Boolean}
     */
    BeanBuilder.prototype.matches = function (idOrType) {
        if ((typeof idOrType) === "string") {
            return idOrType.indexOf(".") !== -1
                ? matchesByType(this.strategy, module.utils.getClassByName(idOrType, this.globals))
                : matchesById(this.id, idOrType);
        } else {
            return matchesByType(this.strategy, idOrType);
        }
    };

    /**
     * Matches whether bean has been created by this bean builder
     * @member Izi.ioc.bean.BeanBuilder
     * @private
     * @param {Object} bean
     * @return {Boolean}
     */
    BeanBuilder.prototype.matchesBeanInstance = function (bean) {
        return module.utils.some(this.createdBeans || [], function (createdBean) {
            return createdBean === bean;
        });
    };

    /**
     * Get bean factories that are set as argument dependencies
     * @member Izi.ioc.bean.BeanBuilder
     * @private
     * @param context
     * @return {*}
     */
    BeanBuilder.prototype.getArgumentsDependencies = function (context) {

        function findArgumentsDependencies(args) {
            var results = [];
            module.utils.forEach(args, function (arg) {
                if (arg && arg.isIziInjection) {
                    results.push(arg.findBeanBuilder(context));
                }
            });
            return results;
        }

        return findArgumentsDependencies(this.strategy.getArguments());
    };

    module.ioc.bean.BeanBuilder = BeanBuilder;
}(Izi);
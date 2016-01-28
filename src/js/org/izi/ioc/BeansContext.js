/**
 * @ignore
 * @requires ../utils/typeOf.js
 * @requires ../utils/forEach.js
 * @requires ../utils/hasOwnProperty.js
 * @requires ../utils/every.js
 * @requires ../model/Observable.js
 * @requires Config.js
 * @requires bean/BeanBuilder.js
 * @requires bean/InstanceStrategy.js
 * @requires bean/NoBeanMatched.js
 */
!function (module) {

    function normalizeBeans(beans) {
        if (module.utils.typeOf(beans) === 'Array') {
            return mergeBeans(beans);
        } else {
            return beans;
        }
    }

    function mergeBeans(beansCollection) {
        var result = {};
        module.utils.forEach(beansCollection, function (beans) {
            iterateOwnProperties(beans, function (key, value) {
                if (result[key] === undefined) {
                    result[key] = value;
                } else {
                    throw new Error('Found duplicated bean ID: "' + key + '" in multiple configurations');
                }
            });
        });
        return result;
    }

    function iterateOwnProperties(object, callback) {
        for (var key in object) {
            if (module.utils.hasOwnProperty(object, key)) {
                callback(key, object[key]);
            }
        }
    }

    function createBeansBuilders(beans, beansBuilders, globals) {
        var beanId, beanConfig, beanBuilder;

        for (beanId in beans) {
            if (module.utils.hasOwnProperty(beans, beanId)) {
                beanConfig = beans[beanId];

                if (beanConfig instanceof module.ioc.Config) {
                    beanBuilder = new module.ioc.bean.BeanBuilder(beanId, beanConfig.createStrategy(), globals);
                } else if (module.utils.typeOf(beanConfig) === "Function") {
                    var config = new module.ioc.Config(beanConfig, module.ioc.bean.SingletonStrategy, globals);
                    beanBuilder = new module.ioc.bean.BeanBuilder(beanId, config.createStrategy(), globals);
                } else {
                    beanBuilder = new module.ioc.bean.BeanBuilder(beanId, new module.ioc.bean.InstanceStrategy(beanConfig), globals);
                }

                beansBuilders.push(beanBuilder);
            }
        }
    }

    function findCircularDependencies(beansContext, beanBuilder) {

        function visitDependencies(visitedBuilder) {
            var dependencies = visitedBuilder.getArgumentsDependencies(beansContext);

            module.utils.forEach(dependencies, function (dependency) {
                if (dependency === beanBuilder) {
                    throw new Error("Circular dependencies found. If it is possible try inject those dependencies by properties instead by arguments.");
                }
                visitDependencies(dependency);
            });
        }

        visitDependencies(beanBuilder);
    }

    function initBean(beansContext, beanBuilder) {
        findCircularDependencies(beansContext, beanBuilder);
        return beanBuilder.init(beansContext);
    }

    function initAllBeans(beansContext, beansBuilders) {
        var bean, beansToCreate = [];

        module.utils.forEach(beansBuilders, function (beanBuilder) {
            bean = initBean(beansContext, beanBuilder);
            if (bean) {
                beansToCreate.push(beanBuilder);
            }
        });

        module.utils.forEach(beansToCreate, function (beanToCreate) {
            beanToCreate.create(beansContext);
        });
    }

    function createPreDestroyEvent() {
        return {

            isPrevented: false,

            isDestroyPrevented: function () {
                return this.isPrevented;
            },

            preventDestroy: function () {
                this.isPrevented = true;
            }
        }
    }

    /**
     * @ignore
     * @param {Izi.ioc.BeansContext} beansContext
     */
    function handleDestroyFromParentContext(beansContext) {
        var parentContext = beansContext.parentContext,
            childrenDispatcher = beansContext.destroyDispatcher,
            parentDispatcher = parentContext && parentContext.destroyDispatcher;

        if (!parentDispatcher) {
            return;
        }

        function handlePreDestroy(event) {
            childrenDispatcher.dispatchEvent("preDestroy", arguments);
            if (event.isDestroyPrevented()) {
                return;
            }

            var shouldDestroy = beansContext.doPreDestroy();
            if (!shouldDestroy) {
                event.preventDestroy();
            }
        }

        function handleDestroy(event) {
            parentDispatcher.removeListener("destroy", handleDestroy);
            parentDispatcher.removeListener("preDestroy", handlePreDestroy);

            childrenDispatcher.dispatchEvent("destroy", arguments);
            beansContext.doDestroy();
        }

        parentDispatcher.addListener("preDestroy", handlePreDestroy);
        parentDispatcher.addListener("destroy", handleDestroy);
    }

    /**
     * BeansContext instance is returned by {@link izi#bakeBeans izi.bakeBeans()} function. It is also available
     * in <code>.iziContext(context)</code> function implemented on any bean, ie:
     *
     *     izi.bakeBeans({
     *
     *         bean: izi.instantiate(SomeDependency),
     *
     *         myBean: {
     *
     *             dependency: izi.inject(SomeDependency),
     *
     *             iziContext: function (context) {
     *                 // iziContext function is called when all dependencies are provided and ready to use
     *             }
     *
     *             iziInit: function () {
     *                 // iziInit() is called after iziContext()
     *             }
     *         }
     *     });
     *
     *  When you have BeansContext reference, you can:
     *
     *   * wire dependencies to object created outside the context: <code>context.wire(objectContainingIziInjects)</code>
     *   * create descendant context: <code>izi.bakeBeans({...}, parentContext);</code>
     *   * destroy context: <code>context.destroy()</code>
     *
     * @class Izi.ioc.BeansContext
     * @constructor
     * @private
     * @param {Object} globals
     * @param {Object|Object[]} beans Beans configuration as a map of beanId:bean or array of maps.
     * @param {Izi.ioc.BeansContext} [parentContext]
     */
    var BeansContext = function Izi_ioc_BeansContext(globals, beans, parentContext) {
        this.globals = globals;
        this.beans = normalizeBeans(beans);
        this.destroyDispatcher = new module.model.Observable();
        this.parentContext = parentContext;
        this.beansBuilders = [];

        handleDestroyFromParentContext(this);
    };

    /**
     * Init context
     * @member Izi.ioc.BeansContext
     * @private
     * @return {Izi.ioc.BeansContext}
     */
    BeansContext.prototype.initContext = function () {

        createBeansBuilders(this.beans, this.beansBuilders, this.globals);
        initAllBeans(this, this.beansBuilders);

        return this;
    };

    /**
     * Find bean by its id or class name
     * @member Izi.ioc.BeansContext
     * @param {String|Function} beanIdOrType
     * @return {*}
     */
    BeansContext.prototype.getBean = function (beanIdOrType) {

        var beanBuilder = this.findBeanBuilder(beanIdOrType);

        if (!beanBuilder) {
            throw new module.ioc.bean.NoBeanMatched(beanIdOrType);
        }

        return beanBuilder.create(this);
    };

    /**
     * Injects needed dependencies from this context into passed object.
     * @member Izi.ioc.BeansContext
     * @since 1.3.0
     * @param {Object} objectContainingIziInjects
     * @return {Object}
     */
    BeansContext.prototype.wire = function (objectContainingIziInjects) {
        var strategy = new module.ioc.bean.InstanceStrategy(objectContainingIziInjects),
            beanBuilder = new module.ioc.bean.BeanBuilder("", strategy, this.globals);
        this.beansBuilders.push(beanBuilder);
        return beanBuilder.create(this);
    };

    /**
     * Destroys beans context and all descendant contexts. First it calls <code>.iziPreDestroy()</code> method on every
     * created bean if implemented. Throwing an error inside <code>.iziPreDestroy()</code> stops destroying the context.
     * After calling <code>.iziPreDestroy()</code> izi calls <code>.iziDestroy()</code> methods on every created bean
     * if implemented. All thrown errors inside <code>.iziDestroy()</code> are caught and ignored.
     *
     * <code>.iziDestroy()</code> is a place where you should unregister all event listeners added within its class.
     *
     *     var context = izi.bakeBeans({
     *
     *         someBean: {
     *
     *             iziInit: function () {
     *                 var bind = this.bind = izi.bind();
     *
     *                 bind.valueOf(loginInput).to(model, "login");
     *                 bind.valueOf(passwordInput).to(model, "password");
     *
     *                 this.login = izi.perform(doLogin).when("click").on(loginButton);
     *             },
     *
     *             iziPreDestroy: function () {
     *                 // you can throw new Error() here if you don't want to destroy context for any reason
     *             }
     *
     *             iziDestroy: function () {
     *                 this.bind.unbindAll();
     *                 this.login.stopObserving();
     *             }
     *         }
     *     });
     *
     *     context.destroy();
     *
     * @member Izi.ioc.BeansContext
     * @return {boolean} true when destroying was successful, false when any of beans thrown an exception in iziPreDestroy() method
     * @since 1.4.0
     */
    BeansContext.prototype.destroy = function () {
        var destroyDispatcher = this.destroyDispatcher,
            preDestroyEvent = createPreDestroyEvent();

        destroyDispatcher.dispatchEvent("preDestroy", [preDestroyEvent]);

        if (preDestroyEvent.isDestroyPrevented()) {
            return false;
        }

        var shouldDestroy = this.doPreDestroy();

        if (!shouldDestroy) {
            return false;
        }

        destroyDispatcher.dispatchEvent("destroy");
        this.doDestroy();

        return true;
    };

    BeansContext.prototype.doPreDestroy = function () {
        return module.utils.every(this.beansBuilders, function (beanBuilder) {
            try {
                beanBuilder.preDestroyCreatedBeans();
                return true;
            } catch (e) {
                return false;
            }
        });
    };

    BeansContext.prototype.doDestroy = function () {
        module.utils.forEach(this.beansBuilders, function (beanBuilder) {
            beanBuilder.destroyCreatedBeans();
        });
        this.beansBuilders = [];
        this.beans = undefined;
        this.parentContext = undefined;
        this.destroyDispatcher = undefined;

        return true;
    };

    /**
     * Find bean builder by its id or type
     * @member Izi.ioc.BeansContext
     * @private
     * @param {String/Function} beanIdOrType
     * @return {Izi.ioc.bean.BeanBuilder}
     */
    BeansContext.prototype.findBeanBuilder = function (beanIdOrType) {
        var foundBuilder = null;

        module.utils.forEach(this.beansBuilders, function (factory) {
            if (factory.matches(beanIdOrType)) {
                if (foundBuilder) {
                    throw new Error("Ambiguous reference to bean by type. Please refer by id.");
                }
                foundBuilder = factory;
            }
        });

        if (!foundBuilder && this.parentContext !== undefined) {
            foundBuilder = this.parentContext.findBeanBuilder(beanIdOrType);
        }

        return foundBuilder;
    };

    module.ioc.BeansContext = BeansContext;
}(Izi);
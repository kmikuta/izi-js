/**
 * @ignore
 * @requires ../utils/getCallerLineProvider.js
 * @requires ../utils/typeOf.js
 * @requires ../utils/ClassNotFound.js
 * @requires ../utils/typeOf.js
 * @requires bean/NoBeanMatched.js
 */
!function (module) {

    function defaultInjector(target, prop, dependency) {
        target[prop] = dependency;
    }

    function defaultDependencyConverter(dependency) {
        return dependency;
    }

    /**
     * Injection marker for beans arguments and properties.
     * @class Izi.ioc.Injection
     * @constructor
     * @private
     * @param {String|Function} beanIdOrType Bean id or constructor function or dotted string class definition
     */
    var Injection = function Izi_ioc_Injection(beanIdOrType) {
        this.beanIdOrType = beanIdOrType;
        this.getCallerLine = module.utils.getCallerLineProvider(2);
        this.injector = defaultInjector;
        this.dependencyConverter = defaultDependencyConverter;
    };

    /**
     * @member Izi.ioc.Injection
     * @private
     * @return {String}
     */
    Injection.prototype.getBeanNotFoundMessage = function() {
        var beanName;
        if (module.utils.typeOf(this.beanIdOrType) === "Function") {
            beanName = this.beanIdOrType.name || this.beanIdOrType;
        } else {
            beanName = this.beanIdOrType;
        }
        return "Bean: `" + beanName + "` couldn't be found from injection at line:\n" + this.getCallerLine();
    };

    /**
     * Delegates get bean
     * @member Izi.ioc.Injection
     * @private
     * @param {Izi.ioc.BeansContext} beansContext
     * @return {*}
     */
    Injection.prototype.resolveBean = function (beansContext) {
        var bean;
        try {
            bean = beansContext.getBean(this.beanIdOrType);
        } catch (e) {
            if (e instanceof module.utils.ClassNotFound || e instanceof module.ioc.bean.NoBeanMatched) {
                throw new Error(this.getBeanNotFoundMessage());
            }
            else {
                throw e;
            }
        }
        return this.dependencyConverter(bean);
    };

    /**
     * Warning: use only for property injection! It doesn't work for constructor argument injection.
     *
     * The default property injection just set dependency as property in following code:
     *
     *     function defaultInjector(target, prop, dependency) {
     *         target[prop] = dependency;
     *     }
     *
     * If you want to inject dependency in different way you may use custom injector function:
     *
     *     userModel: izi.inject("userModel").by(function (target, prop, dependency) {
     *         target.setUserModel(dependency);
     *     });
     *
     * Notice: `dependency` argument is processed by dependency converter set by `.through()` or set by `.property()`
     *
     * @member Izi.ioc.Injection
     * @param {function(target, prop, dependency)} injector function which will be used to inject dependency as property.
     * @return {Izi.ioc.Injection}
     * @since 1.7.0
     */
    Injection.prototype.by = function (injector) {
        if (module.utils.typeOf(injector) !== "Function") {
            throw new Error("Injector should be a function with target, prop, dependency arguments");
        }
        this.injector = injector;
        return this;
    };

    /**
     * The default dependency converter returns just the dependency as in following code:
     *
     *     function defaultDependencyConverter(dependency) {
     *         return dependency;
     *     }
     *
     * If you want to inject transformed dependency, you may use custom dependency converter:
     *
     *     userModel: izi.inject("userModel").trough(function (dependency) {
     *         return dependency.toJSON();
     *     });
     *
     * @member Izi.ioc.Injection
     * @param {function(dependency):*} dependencyConverter function which will be used to inject dependency as property.
     * @return {Izi.ioc.Injection}
     * @since 1.7.0
     */
    Injection.prototype.through = function (dependencyConverter) {
        if (module.utils.typeOf(dependencyConverter) !== "Function") {
            throw new Error("Dependency converter should be a function with dependency argument");
        }
        this.dependencyConverter = dependencyConverter;
        return this;
    };

    /**
     * Inject value of `dependency[property]` instead of `dependency`
     *
     *     firstName: izi.inject("userModel").property("firstName", "John")
     *
     * @param {String} property
     * @param {Object} [defaultValue] injected when property value is `undefined`
     * @return {Izi.ioc.Injection}
     * @since 1.7.0
     * @chainable
     */
    Injection.prototype.property = function (property, defaultValue) {
        return this.through(function (dependency) {
            return dependency[property] === undefined ? defaultValue : dependency[property];
        });
    };

    /**
     * Delegates find bean builder
     * @member Izi.ioc.Injection
     * @private
     * @param {Izi.ioc.BeansContext} beansContext
     * @return {Izi.ioc.bean.BeanBuilder}
     */
    Injection.prototype.findBeanBuilder = function (beansContext) {
        var beanBuilder = beansContext.findBeanBuilder(this.beanIdOrType);
        if (beanBuilder === null) {
            throw new Error(this.getBeanNotFoundMessage());
        }
        return beanBuilder;
    };

    /**
     * Marker field to use instead of: ... instanceof Izi.ioc.Injection
     * @member Izi.ioc.Injection
     * @private
     * @type {Boolean}
     */
    Injection.prototype.isIziInjection = true;

    module.ioc.Injection = Injection;
}(Izi);
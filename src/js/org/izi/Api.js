/**
 * @requires debug.js
 * @requires behavior/register.js
 * @requires binding/register.js
 * @requires queue/register.js
 * @requires utils/typeOf.js
 * @requires utils/forEach.js
 * @requires ioc/BeansContext.js
 * @requires ioc/Config.js
 * @requires ioc/Injection.js
 * @requires ioc/bean/SingletonStrategy.js
 * @requires ioc/bean/LazySingletonStrategy.js
 * @requires ioc/bean/PrototypeStrategy.js
 * @requires model/Model.js
 * @requires events/Events.js
 */
!function (module, global) {

    var frameworks = {},
        sanityCheckMethods = ["arg", "sanityInjectTo", "sanityOf", "varargOf"];

    function initFramework(izi, framework) {
        if (framework.behavior) {
            izi.registerBehaviorImpl(framework.behavior);
        }
        if (framework.binding) {
            izi.registerBindingImpl(framework.binding);
        }
        if (framework.queue) {
            izi.registerQueueImpl(framework.queue);
        }
    }

    function enableCompatibility(izi) {
        if (global.izi) {
            module.utils.forEach(sanityCheckMethods, function (method) {
                if (global.izi[method]) {
                    izi[method] = global.izi[method];
                }
            });
        }
    }

    /**
     * @class izi
     * @constructor
     * @param {String|Object} [framework]
     * @param {Object} [globals]
     *
     * All <strong>izi</strong> fluent API entry points.
     */
    var Api = function Izi_Api(framework, globals) {
        this.globals = globals || global;

        enableCompatibility(this);

        if (module.utils.typeOf(framework) === "String") {
            framework = frameworks[framework];
        }

        if (framework) {
            this._framework = framework;
            initFramework(this, framework);
        }
    };

    /**
     * Creates beans context using passed config. It can be one configuration, like:
     *
     *     izi.bakeBeans({beanId: 'value'});
     *
     * Or multiple configurations as an array:
     *
     *     var config1 = {
     *         bean1: 'value 1'
     *     };
     *     var config2 = {
     *         bean2: 'value 2'
     *     };
     *
     *     izi.bakeBeans([config1, config2]);
     *
     * @param {Object|Object[]} config One or multiple configurations
     * @param {Izi.ioc.BeansContext} [parentContext]
     * @return {Izi.ioc.BeansContext}
     */
    Api.prototype.bakeBeans = function (config, parentContext) {
        return new module.ioc.BeansContext(this.globals, config, parentContext).initContext();
    };

    /**
     * Creates singleton bean definition using passed class type
     *
     * @param {Function|String} clazz constructor function or dotted string class definition
     * @return {Izi.ioc.Config}
     */
    Api.prototype.instantiate = function (clazz) {
        return new module.ioc.Config(clazz, module.ioc.bean.SingletonStrategy, this.globals);
    };

    /**
     * Creates lazy singleton bean definition using passed class type
     *
     * @param {Function|String} clazz constructor function or dotted string class definition
     * @return {Izi.ioc.Config}
     */
    Api.prototype.lazy = function (clazz) {
        return new module.ioc.Config(clazz, module.ioc.bean.LazySingletonStrategy, this.globals);
    };

    /**
     * Creates prototype bean definition using passed class type
     * @param {Function|String} clazz constructor function or dotted string class definition
     * @return {Izi.ioc.Config}
     */
    Api.prototype.protoOf = function (clazz) {
        return new module.ioc.Config(clazz, module.ioc.bean.PrototypeStrategy, this.globals);
    };

    /**
     * Injects dependency by its beanId or class type. It can be used as constructor dependency injection or by
     * property dependency injection.
     *
     * @param {String|Function} beanIdOrType Bean id or constructor function or dotted string class definition
     * @return {Izi.ioc.Injection}
     */
    Api.prototype.inject = function (beanIdOrType) {
        return new module.ioc.Injection(beanIdOrType);
    };

    /**
     * Init behavior API. You can specify function and scope:
     *
     *     izi.perform(behavior.perform, behavior).when('click').on(button)
     *
     * ... or only behavior ('perform' function will be called by default):
     *
     *     izi.perform(behavior).when('click').on(button)
     *
     * ... or custom event registrar ('register' and 'unregister' functions are required):
     *
     *     var registrar = {
     *
     *         register: function (target) {
     *             target.addEventListener(...);
     *             target.addEventListener(...);
     *             target.addEventListener(...);
     *         },
     *
     *         unregister: function (target) {
     *             target.removeEventListener(...);
     *             target.removeEventListener(...);
     *             target.removeEventListener(...);
     *         }
     *     };
     *
     *     izi.perform(registrar).on(target);
     *
     * ... or nothing to get grouping method:
     *
     *     var perform = izi.perform();
     *
     *     perform(behavior1).when("click").on(button1);
     *     perform(behavior2).when("click").on(button2);
     *
     *     perform.stopObserving(); // will stop observing them all
     *
     * @noSanity
     * @param {Function|Object} functionOrBehaviorOrRegistrar
     * @param {Object} [scope]
     * @return {Izi.behavior.Perform}
     */
    Api.prototype.perform = function (functionOrBehaviorOrRegistrar, scope) {
        throw new Error("Register your behavior implementation first: izi.registerBehaviorImpl(Izi.behavior.impl.SomeImpl)");
    };

    /**
     * Registers behavior implementation
     *
     * @sanity izi.sanityOf("registerBehaviorImpl()").args(izi.arg("impl").ofObject().havingFunctions("observeWidget", "observeKeyStroke").havingProperty("defaultPerformFunction")).check(arguments);
     * @param {Object} impl Behavior implementation config
     * @param {String} impl.defaultPerformFunction Name of default perform function called on behavior
     * @param {Function} impl.observeWidget Function that starts observing widget and returns function that stops observing. This function gets following arguments: <code>widget, eventConfig, action, scope, options</code>
     * @param {Function} impl.observeKeyStroke Function that starts observing keyboard and returns function that stops observing. This function gets following arguments: <code>widget, keyboardConfig, action, scope, options</code>
     */
    Api.prototype.registerBehaviorImpl = function (impl) {
        this.perform = module.behavior.register(impl, this);
    };

    /**
     * Init binding API
     * @sanity izi.sanityOf("bind()").args().args(izi.arg("options").ofObject()).check(arguments);
     * @param {Object} [options] Advanced options
     * @param {Boolean} [options.auto=true] Start listen for changes automatically.
     * @param {Boolean} [options.executeAtStartup=true] Execute binding immediately after creation. It works only when <code>auto=true</code>.
     * @param {Boolean} [options.debug=false] Log every binding execution on browser's console.
     * @return {Izi.binding.Bind}
     */
    Api.prototype.bind = function (options) {
        throw new Error("Register your binding implementation first: izi.registerBindingImpl(Izi.binding.impl.SomeImpl)");
    };

    /**
     * Registers binding implementation
     * @sanity izi.sanityOf("registerBindingImpl()").args(izi.arg("impl").ofObject().havingProperties("changeObservers", "valueReaders", "valueWriters")).check(arguments);izi.sanityOf("impl.changeObservers").args(izi.varargOf(izi.arg().ofFunction())).check(impl.changeObservers);izi.sanityOf("impl.valueReaders").args(izi.varargOf(izi.arg().ofFunction())).check(impl.valueReaders);izi.sanityOf("impl.valueWriters").args(izi.varargOf(izi.arg().ofFunction())).check(impl.valueWriters);
     * @param impl Binding implementation config
     * @param {Function[]} impl.changeObservers Array of change observers functions. These functions get following parameters: <code>source, sourceProperty, target, targetProperty, transferValueFn</code>
     * @param {Function[]} impl.valueReaders Array of functions that can read value from given object and property. These functions get following arguments: <code>object, property</code>
     * @param {Function[]} impl.valueWriters Array of functions that can write value on given object and property. These functions get following arguments: <code>object, property, value</code>
     */
    Api.prototype.registerBindingImpl = function (impl) {
        this.bind = module.binding.register(impl);
    };

    /**
     * Creates class of izi model. Use this model in your project for data binding only when your framework
     * doesn't provide 'observable' model.
     *
     * @sanity izi.sanityOf("izi.modelOf()").args(izi.arg("config").ofObject().havingProperty("fields")).check(arguments);izi.sanityOf("config.fields").args(izi.varargOf(izi.arg("field").ofObject().havingProperty("name"), izi.arg("fieldName").ofString())).check(config.fields);
     * @param {Object} config Model fields configuration. It must contain <strong>fields</strong> array of fields objects.
     * @param {Array} config.fields Configuration of model fields
     * @return {Function}
     */
    Api.prototype.modelOf = function (config) {
        return module.model.Model.define(config);
    };

    /**
     *
     * @type {Izi.events.Events}
     */
    Api.prototype.events = new module.events.Events();

    /**
     * Init synchronized queue API
     * @nosanity
     * @param {Object} [config] Queue configuration
     * @param {Object} [config.scope] default scope for all functions executions
     * @param {Number} [config.timeout="0"] default timeout for synchronized tasks - 0 is a default which means no timeout
     * @param {String} [config.debug] use any String as an identifier of the queue that will be logged in browser console
     * @return {Izi.queue.Queue}
     */
    Api.prototype.queue = function (config) {
        throw new Error("Register your queue implementation first: izi.registerQueueImpl(Izi.queue.impl.SomeImpl)");
    };

    /**
     * Registers queue implementation
     * @sanity izi.sanityOf("registerQueueImpl()").args(izi.arg("impl").ofObject().havingFunctions("dispatchEvent", "createEventDispatcher")).check(arguments);
     * @param {Object} impl
     * @param {Function} impl.dispatchEvent
     * @param {Function} impl.createEventDispatcher
     */
    Api.prototype.registerQueueImpl = function (impl) {
        this.queue = module.queue.register(impl, this);
    };

    /**
     *
     * @param {String|Object|null} [framework]
     * @param {Object} [globals]
     * @returns {izi}
     */
    Api.prototype.newInstance = function (framework, globals) {
        return new Api(framework || this._framework, globals);
    };

    /**
     *
     * @param {Object} globals
     * @returns {izi}
     */
    Api.prototype.sandboxed = function (globals) {
        return this.newInstance(null, globals);
    };

    /**
     *
     * @param {String} name
     * @param {Object} impl
     * @param {Object} impl.behavior
     * @param {Object} impl.binding
     * @param {Object} impl.queue
     */
    module.registerFramework = function (name, impl) {
        frameworks[name] = impl;
    };

    Api.prototype.module = module;
    module.Api = Api;

    izi = new Api();

}(Izi, this);
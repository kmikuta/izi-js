/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 izi-js contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
(function (global) {
    function amdFactory() {

var izi,
    Izi = {
        ioc: {
            bean: {}
        },
        utils: {},
        model: {},
        behavior: {
            impl: {}
        },
        binding: {
            impl: {
                nested: {}
            }
        },
        events: {
        },
        queue: {
            impl: {}
        }
    };
// #ifdef DEBUG
Izi.isDebug = true;
// #endif
!function (module) {
    /**
     * @member Izi.utils
     * @method
     * @private
     * @param {Array} array
     * @param {Function} item
     * @param {Object} scope
     */
    module.utils.forEach = (function () {

        function byForEach(array, fn, scope) {
            Array.prototype.forEach.call(array, fn, scope);
        }

        function byLoop(array, fn, scope) {
            var i,
                ln = array.length;

            for (i = 0; i < ln; i = i + 1) {
                fn.call(scope, array[i], i, array);
            }
        }

        function hasForEach() {
            return (typeof Array.prototype.forEach) === 'function';
        }

        return hasForEach() ? byForEach : byLoop;
    }());
}(Izi);
!function (module) {
    /**
     * @member Izi.utils
     * @private
     * @param value
     * @return {String}
     */
    module.utils.typeOf = function (value) {
        if (value === undefined) {
            return 'undefined';
        } else if (value === null) {
            return 'null';
        }

        switch (typeof value)  {
            case 'string':
                return 'String';
            case 'number':
                return 'Number';
            case 'boolean':
                return 'Boolean';
            case 'function':
                return 'Function';
        }

        switch (Object.prototype.toString.call(value)) {
            case '[object Array]':
                return 'Array';
            case '[object Date]':
                return 'Date';
            case '[object RegExp]':
                return 'RegExp';
            case '[object Boolean]':
                return 'Boolean';
            case '[object Number]':
                return 'Number';
        }

        if (typeof value === 'object') {
            return 'Object';
        } else {
            throw new Error("Couldn't find type of given value");
        }
    };
}(Izi);
/**
 * @requires ../utils/forEach.js
 * @requires ../utils/typeOf.js
 */
!function (module) {

    /**
     * After <code>izi.perform(behavior).when('click').on(widget)...</code> behavior API
     * @class Izi.behavior.OnWidget
     * @constructor
     * @private
     * @param {Izi.behavior.Config} config
     */
    var OnWidget = function Izi_behavior_OnWidget(config) {
        var action = config.getAction(),
            scope = config.getScope(),
            events = config.getEvents(),
            eventOptions = config.getEventOptions(),
            widget = config.getDispatcher(),
            impl = config.getImpl(),
            me = this;


        function startObserving() {
            me.observers = [];

            module.utils.forEach(events, function (eventConfig) {

                if (eventConfig.isKeyboardEventConfig) {
                    if (widget.iziObserveKeyStroke) {
                        me.observers.push(widget.iziObserveKeyStroke(eventConfig, action, scope, eventOptions));
                    } else {
                        me.observers.push(impl.observeKeyStroke(widget, eventConfig, action, scope, eventOptions));
                    }

                } else if (eventConfig.isEventConfig) {
                    if (widget.iziObserveWidget) {
                        me.observers.push(widget.iziObserveWidget(eventConfig, action, scope, eventOptions));
                    } else {
                        me.observers.push(impl.observeWidget(widget, eventConfig, action, scope, eventOptions));
                    }

                } else if (module.utils.typeOf(eventConfig) === "Function") {
                    me.observers.push(eventConfig(widget, action, scope, eventOptions));

                } else {
                    throw new Error("Incorrect event type. Expecting izi.event.* or 'eventType' or function(target, action, scope, eventOptions)");
                }
            });
        }

        startObserving();
        config.behavior = this;
    };

    /**
     * Stops observing the widget
     * @member Izi.behavior.OnWidget
     */
    OnWidget.prototype.stopObserving = function () {
        module.utils.forEach(this.observers, function (observer) {
            observer();
        });
    };

    module.behavior.OnWidget = OnWidget;
}(Izi);
/**
 * @requires OnWidget.js
 */
!function (module) {

    /**
     * After `izi.perform(behavior).when('click')...` behavior API
     * @class Izi.behavior.WhenWidget
     * @constructor
     * @private
     * @param {Izi.behavior.Config} config
     */
    var WhenWidget = function Izi_behavior_WhenWidget(config) {
        this.config = config;
    };

    /**
     * Widget declaration. You can pass directly widget instance or object containing widget on **delegatedIn** property.
     *
     *     var showMessage = new ShowMessage();
     *     var button = new Button();
     *     var wrapper = {
     *         delegatedIn: button
     *     };
     *
     *     izi.perform(showMessage).when('click').on(button);
     *
     *     // will work also for:
     *     izi.perform(showMessage).when('click').on(wrapper);
     *
     *
     * @member Izi.behavior.WhenWidget
     * @param {*} widget Widget that should be observed.
     * @return {Izi.behavior.OnWidget}
     */
    WhenWidget.prototype.on = function (widget) {
        return new module.behavior.OnWidget(this.config.withDispatcher(widget));
    };

    module.behavior.WhenWidget = WhenWidget;

}(Izi);
/**
 * @requires ../utils/forEach.js
 */
!function (module) {

    /**
     * After <code>izi.perform(behavior).whenChangeOf('property1', 'property2').on(model)...</code> behavior API
     * @class Izi.behavior.OnModel
     * @constructor
     * @private
     * @param {Izi.behavior.Config} config
     */
    module.behavior.OnModel = function Izi_behavior_OnModel(config) {
        var action = config.getAction(),
            scope = config.getScope(),
            model = config.getDispatcher(),
            modelProperties = config.getModelProperties(),
            bindings = [];

        config.behavior = this;

        function triggerAction() {
            action.apply(scope, arguments);
        }

        module.utils.forEach(modelProperties, function (property) {
            bindings.push(config.iziApi.bind({executeAtStartup: false}).valueOf(model, property).to(triggerAction));
        });

        /**
         * Stops observing the model
         */
        this.stopObserving = function () {
            module.utils.forEach(bindings, function (binding) {
                binding.unbind();
            });
        };
    };

}(Izi);
/**
 * @requires OnModel.js
 */
!function (module) {

    /**
     * After `izi.perform(behavior).whenChangeOf('firstName')...` behavior API
     * @class Izi.behavior.WhenModel
     * @constructor
     * @private
     * @param {Izi.behavior.Config} config
     */
    var WhenModel = function Izi_behavior_WhenModel(config) {
        this.config = config;
    };

    /**
     * Model declaration. You can pass directly model instance or object containing model on <strong>delegatedIn</strong> property.
     *
     *     var showFullName = new ShowFullName();
     *     var model = new UserModel();
     *     var wrapper = {
     *         delegatedIn: model
     *     };
     *
     *     izi.perform(showFullName).whenChangeOf('firstName', 'lastName').on(model);
     *
     *     // will work also for:
     *     izi.perform(showFullName).whenChangeOf('firstName', 'lastName').on(wrapper);
     *
     * @member Izi.behavior.WhenModel
     * @param {Object} model Model that should be observed for properties changes.
     * @return {Izi.behavior.OnModel}
     */
    WhenModel.prototype.on = function (model) {
        return new module.behavior.OnModel(this.config.withDispatcher(model));
    };

    module.behavior.WhenModel = WhenModel;

}(Izi);
!function (module) {

    var PREVENT_DEFAULT = 'preventDefault',
        STOP_PROPAGATION = 'stopPropagation',
        BOTH = 'both';


    /**
     * @class Izi.events.EventConfig
     * @constructor
     * @private
     * @param {String} [eventType]
     */
    var EventConfig = function Izi_events_EventConfig(eventType) {

        /**
         * @private
         * @member Izi.events.EventConfig
         * @type {String}
         */
        this.eventType = eventType;

        /**
         * @private
         * @member Izi.events.EventConfig
         * @type {Object}
         */
        this.modifiers = {
            shift: false,
            ctrl: false,
            alt: false
        };

        /**
         * @private
         * @member Izi.events.EventConfig
         * @type {String}
         */
        this.stopEventType = undefined;
    };

    /**
     * @member Izi.events.EventConfig
     * @private
     * @type {Boolean}
     */
    EventConfig.prototype.isEventConfig = true;

    /**
     * Setup if SHIFT key is expected to be pressed during user interaction
     * @member Izi.events.EventConfig
     * @return {Izi.events.EventConfig}
     */
    EventConfig.prototype.shift = function () {
        this.modifiers.shift = true;
        return this;
    };

    /**
     * Setup if CTRL key is expected to be pressed during user interaction
     * @member Izi.events.EventConfig
     * @return {Izi.events.EventConfig}
     */
    EventConfig.prototype.ctrl = function () {
        this.modifiers.ctrl = true;
        return this;
    };

    /**
     * Setup if ALT key is expected to be pressed during user interaction
     * @member Izi.events.EventConfig
     * @return {Izi.events.EventConfig}
     */
    EventConfig.prototype.alt = function () {
        this.modifiers.alt = true;
        return this;
    };

    /**
     * Setup if stopPropagation() and preventDefaults() should be called on triggered event
     * @member Izi.events.EventConfig
     * @return {Izi.events.EventConfig}
     */
    EventConfig.prototype.stopEvent = function () {
        this.stopEventType = BOTH;
        return this;
    };

    /**
     * Setup if stopPropagation() should be called on triggered event
     * @member Izi.events.EventConfig
     * @return {Izi.events.EventConfig}
     */
    EventConfig.prototype.stopPropagation = function () {
        this.stopEventType = STOP_PROPAGATION;
        return this;
    };

    /**
     * Setup if preventDefaults() should be called on triggered event
     * @member Izi.events.EventConfig
     * @return {Izi.events.EventConfig}
     */
    EventConfig.prototype.preventDefault = function () {
        this.stopEventType = PREVENT_DEFAULT;
        return this;
    };

    /**
     * Returns flag for SHIFT key modifier
     * @private
     * @member Izi.events.EventConfig
     * @return {Boolean}
     */
    EventConfig.prototype.isExpectedShiftKey = function () {
        return this.modifiers.shift;
    };

    /**
     * Returns flag for CTRL key modifier
     * @private
     * @member Izi.events.EventConfig
     * @return {Boolean}
     */
    EventConfig.prototype.isExpectedCtrlKey = function () {
        return this.modifiers.ctrl;
    };

    /**
     * Returns flag for ALT key modifier
     * @private
     * @member Izi.events.EventConfig
     * @return {Boolean}
     */
    EventConfig.prototype.isExpectedAltKey = function () {
        return this.modifiers.alt;
    };

    /**
     * Returns event type
     * @private
     * @member Izi.events.EventConfig
     * @return {String}
     */
    EventConfig.prototype.getEventType = function () {
        return this.eventType;
    };

    /**
     * Returns if event should be stopped for further propagation
     * @private
     * @member Izi.events.EventConfig
     * @return {Boolean}
     */
    EventConfig.prototype.shouldStopPropagation = function () {
        return this.stopEventType === STOP_PROPAGATION || this.stopEventType === BOTH;
    };

    /**
     * Returns if event should prevent default behavior
     * @private
     * @member Izi.events.EventConfig
     * @return {Boolean}
     */
    EventConfig.prototype.shouldPreventDefault = function () {
        return this.stopEventType === PREVENT_DEFAULT || this.stopEventType === BOTH;
    };

    /**
     * Returns true if all given modifiers matches configured modifiers.
     * @member Izi.events.EventConfig
     * @private
     * @param {Boolean} shiftKey
     * @param {Boolean} ctrlKey
     * @param {Boolean} altKey
     * @return {Boolean}
     */
    EventConfig.prototype.matchesModifiers = function (shiftKey, ctrlKey, altKey) {
        return this.isExpectedShiftKey() === shiftKey &&
               this.isExpectedCtrlKey() === ctrlKey &&
               this.isExpectedAltKey() === altKey;
    };

    module.events.EventConfig = EventConfig;
}(Izi);
/**
 * @requires WhenWidget.js
 * @requires WhenModel.js
 * @requires ../utils/typeOf.js
 * @requires ../events/EventConfig.js
 */
!function (module) {
    /**
     * After <code>izi.perform(behavior)...</code> behavior API
     * @class Izi.behavior.Perform
     * @constructor
     * @private
     * @param {Izi.behavior.Config} config
     */
    var Perform = function Izi_behavior_Perform(config) {
        this.config = config;
    };

    /**
     * Specifies when your behavior should be executed. This method accept multiple inputs:
     *
     * String:
     *
     *     izi.perform(behavior).when('click').on(button);
     *
     * EventConfig:
     *
     *     izi.perform(behavior).when(izi.events.click().shift()).on(button);
     *     izi.perform(behavior).when(izi.events.keyDown().F4().shift().stopEvent()).on(document);
     *
     * Multiple events:
     *
     *     izi.perform(behavior).when('mouseup', 'mousedown').on(button);
     *     izi.perform(behavior).when(izi.events.click(), izi.events.keyDown().ENTER()).on(button);
     *
     * Event registration function: (since 1.5.0)
     *
     *     // target - is a button in this example
     *     // action - is a reference to `behavior.perform` function
     *     // scope - is a reference to `behavior`
     *     function click(target, action, scope, eventOptions) {
     *
     *         // You may use any custom registration here
     *         target.addListener("click", action, scope);
     *
     *         return function stopObserving() {
     *
     *             // You must return function that will unregister listener
     *             target.removeListener("click", action, scope);
     *         }
     *     }
     *     izi.perform(behavior).when(click).on(button);
     *
     * @member Izi.behavior.Perform
     * @param {String.../Izi.events.EventConfig.../Function...|Object...} events Event type which should be observed for triggering behavior
     * or event config created by izi.events.click() etc...
     * @param {Object} [eventOptions] Optionally you can pass also event options if your framework implementation supports it.
     * @return {Izi.behavior.WhenWidget}
     */
    Perform.prototype.when = function () {
        var events = [],
            eventOptions,
            arg, argType;

        for (var i = arguments.length - 1; i >= 0; i--) {
            arg = arguments[i];
            argType = module.utils.typeOf(arg);

            if (argType === 'String') {
                events.push(new module.events.EventConfig(arg));
            } else if (arg.isEventConfig || argType === 'Function') {
                events.push(arg);
            } else if (argType === 'Object') {
                eventOptions = arg;
            } else {
                throw new Error("Incorrect event types/options arguments");
            }
        }

        return new module.behavior.WhenWidget(this.config.withEvents(events).withEventOptions(eventOptions));
    };

    /**
     * Model properties names which should be observed for changes
     * @member Izi.behavior.Perform
     * @param {String...} properties
     * @return {Izi.behavior.WhenModel}
     */
    Perform.prototype.whenChangeOf = function (properties) {

        return new module.behavior.WhenModel(this.config.withModelProperties(Array.prototype.slice.call(arguments)));
    };


    /**
     * Target object for custom registrar
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
     * @param {*} target
     */
    Perform.prototype.on = function (target) {
        var registrar = this.config.action;

        if (module.utils.typeOf(registrar.register) === 'Function') {

            registrar.register(target);

            return {
                stopObserving: function () {
                    registrar.unregister(target);
                }
            }
        } else {
            throw new Error("Use on(target) method only for custom registrars: izi.perform({register: function (target){...}).on(target)");
        }
    };

    module.behavior.Perform = Perform;

}(Izi);
!function (module) {
    /**
     * Internal configuration used in behavior fluent API
     * @class Izi.behavior.Config
     * @constructor
     * @private
     * @param {Object} impl izi behavior implementation
     * @param {izi} iziApi izi behavior implementation
     */
    var Config = function Izi_behavior_Config(impl, iziApi) {
        this.impl = impl;
        this.iziApi = iziApi;
    };

    /**
     * Set dispatcher
     * @member Izi.behavior.Config
     * @private
     * @param dispatcher
     * @return {Izi.behavior.Config}
     */
    Config.prototype.withDispatcher = function (dispatcher) {
        this.dispatcher = dispatcher;
        return this;
    };

    /**
     * Set event type
     * @member Izi.behavior.Config
     * @private
     * @param {Izi.events.EventConfig[]} events
     * @return {Izi.behavior.Config}
     */
    Config.prototype.withEvents = function (events) {
        this.events = events;
        return this;
    };

    /**
     * Set event options
     * @member Izi.behavior.Config
     * @private
     * @param eventOptions
     * @return {Izi.behavior.Config}
     */
    Config.prototype.withEventOptions = function (eventOptions) {
        this.eventOptions = eventOptions;
        return this;
    };

    /**
     * Set action
     * @member Izi.behavior.Config
     * @private
     * @param action
     * @return {Izi.behavior.Config}
     */
    Config.prototype.withAction = function (action) {
        this.action = action;
        return this;
    };

    /**
     * Set scope
     * @member Izi.behavior.Config
     * @private
     * @param scope
     * @return {Izi.behavior.Config}
     */
    Config.prototype.withScope = function (scope) {
        this.scope = scope;
        return this;
    };

    /**
     * Set model properties
     * @member Izi.behavior.Config
     * @private
     * @param modelProperties
     * @return {Izi.behavior.Config}
     */
    Config.prototype.withModelProperties = function (modelProperties) {
        this.modelProperties = modelProperties;
        return this;
    };

    /**
     * In case of usage: <code>izi.perform(behavior)</code> - it will return <code>behavior.perform</code> function
     * In case of usage: <code>izi.perform(scope.function)</code> - it will return <code>scope.function</code>
     * @member Izi.behavior.Config
     * @return {Function}
     */
    Config.prototype.getAction = function () {
        if ((typeof this.action) !== "function" && (!this.scope)) {
            return this.getScope()[this.getImpl().defaultPerformFunction];
        }

        return this.action;
    };

    /**
     * In case of usage: <code>izi.perform(behavior)</code> - it will return <code>behavior</code>
     * In case of usage: <code>izi.perform(scope.function, scope)</code> - it will return <code>scope</code>
     * @member Izi.behavior.Config
     * @return {Object}
     */
    Config.prototype.getScope = function () {
        if ((typeof this.action) !== "function" && (!this.scope)) {
            return this.action;
        }

        return this.scope;
    };

    /**
     * Get event type
     * @member Izi.behavior.Config
     * @return {Izi.events.EventConfig[]}
     */
    Config.prototype.getEvents = function () {
        return this.events;
    };

    /**
     * Get event options
     * @member Izi.behavior.Config
     * @return {Object}
     */
    Config.prototype.getEventOptions = function () {
        return this.eventOptions;
    };

    /**
     * Get event dispatcher
     * @member Izi.behavior.Config
     * @return {*}
     */
    Config.prototype.getDispatcher = function () {
        return this.dispatcher.delegatedIn || this.dispatcher;
    };

    /**
     * Get behavior implementation
     * @member Izi.behavior.Config
     * @return {*}
     */
    Config.prototype.getImpl = function () {
        return this.impl;
    };

    /**
     * Get model properties
     * @member Izi.behavior.Config
     * @return {String[]}
     */
    Config.prototype.getModelProperties = function () {
        return this.modelProperties;
    };

    module.behavior.Config = Config;
}(Izi);
/**
 * @requires Perform.js
 * @requires Config.js
 * @requires ../utils/forEach.js
 */
!function(module) {

    /**
     * @member Izi.behavior
     * @method
     * @private
     * @param {Object} impl
     * @param {izi} iziApi
     */
    module.behavior.register = function (impl, iziApi) {

        if (!impl.defaultPerformFunction) {
            throw new Error("Behavior implementation must have defined property: defaultPerformFunction: 'someFunctionName'");
        }
        if (!impl.observeWidget) {
            throw new Error("Behavior implementation must have defined function observeWidget (widget, eventConfig, action, scope, options)");
        }
        if (!impl.observeKeyStroke) {
            throw new Error("Behavior implementation must have defined function observeKeyStroke (widget, keyboardConfig, action, scope, options)");
        }

        /**
         * @ignore
         * @sanity izi.sanityOf("izi.perform()").args().args(izi.arg("behavior").ofObject().havingFunction(impl.defaultPerformFunction)).args(izi.arg("behaviorWrapper").ofObject().havingProperty("delegatedIn")).args(izi.arg("callback").ofFunction()).args(izi.arg("callback").ofFunction(), izi.arg("scope").ofObject()).args(izi.arg("registrar").ofObject().havingFunctions("register", "unregister")).check(arguments);
         */
        return function (action, scope) {

            if (arguments.length === 0) {
                var configs = [];

                var registerBehaviors = function (action, scope) {
                    var config = new module.behavior.Config(impl, iziApi).withAction(action).withScope(scope);
                    configs.push(config);
                    return new module.behavior.Perform(config);
                };

                registerBehaviors.stopObserving = function () {
                    module.utils.forEach(configs, function (config) {
                        config.behavior.stopObserving();
                    });
                };

                return registerBehaviors;
            }

            return new module.behavior.Perform(new module.behavior.Config(impl, iziApi).withAction(action).withScope(scope));
        };
    };
}(Izi);
!function (module) {
    /**
     * @member Izi.utils
     * @method
     * @private
     * @param {Object} object host object
     * @param {String} property to be examined to
     */
    module.utils.hasOwnProperty = function (object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    };
}(Izi);
/**
 * @requires hasOwnProperty.js
 */
!function (module) {
    /**
     * @member Izi.utils
     * @method
     * @private
     * @param {Object...} vararg of any Objects
     */
    module.utils.mergeObjects = function () {

        function copyProperties(source, target) {
            for (var key in source) {
                if (module.utils.hasOwnProperty(source, key)) {
                    target[key] = source[key];
                }
            }
        }

        return function () {
            var result = {};
            for (var i = 0; i < arguments.length; i++) {
                copyProperties(arguments[i], result);
            }
            return result;
        }
    }();
}(Izi);
!function (module) {
    /**
     * @member Izi.utils
     * @method
     * @private
     * @param {Array} array
     * @param {*} item
     * @return {Number}
     */
    module.utils.indexOf = (function () {

        function byIndexOf(array, item) {
            return Array.prototype.indexOf.call(array, item);
        }

        function byLoop(array, item) {
            var i, ln = array.length;

            for (i = 0; i < ln; i = i + 1) {
                if (array[i] === item) {
                    return i;
                }
            }

            return -1;
        }

        function hasIndexOf() {
            return (typeof Array.prototype.indexOf) === 'function';
        }

        return hasIndexOf() ? byIndexOf : byLoop;
    }());

}(Izi);
/**
 * @requires indexOf.js
 */
!function (module) {
    /**
     * @member Izi.utils
     * @method
     * @private
     * @param {Array} array
     * @param {*} item
     */
    module.utils.removeItem = function (array, item) {
        var start = module.utils.indexOf(array, item);
        if (start !== -1) {
            array.splice(start, 1);
        }
    };
}(Izi);
/**
 * @requires ../utils/mergeObjects.js
 * @requires ../utils/removeItem.js
 */
!function (module) {

    /**
     * Internal configuration used in binding fluent API
     * @private
     * @class Izi.binding.Config
     * @constructor
     * @param {Object} impl izi binding implementation
     */
    var Config = function Izi_binding_Config(impl) {
        this.options = {
            auto: true,
            executeAtStartup: true,
            debug: false
        };
        this.impl = impl;
        this.triggerProperties = [];
        this.bindings = [];
    };

    /**
     * @member Izi.binding.Config
     * @private
     * @param {Object} options
     * @return {Izi.binding.Config}
     * @since 1.1.0
     */
    Config.prototype.withOptions = function (options) {
        this.options = module.utils.mergeObjects(this.options, options);
        return this;
    };

    /**
     * @member Izi.binding.Config
     * @private
     * @param {Izi.binding.Binding[]} bindings
     * @return {Izi.binding.Config}
     * @since 1.1.0
     */
    Config.prototype.withBindings = function (bindings) {
        this.bindings = bindings;
        return this;
    };

    /**
     * @member Izi.binding.Config
     * @private
     * @param {Function} callerLineProvider
     * @return {Izi.binding.Config}
     * @since 1.1.0
     */
    Config.prototype.withCallerLineProvider = function (callerLineProvider) {
        this.callerLineProvider = callerLineProvider;
        return this;
    };

    /**
     * @member Izi.binding.Config
     * @private
     * @param source
     * @return {Izi.binding.Config}
     */
    Config.prototype.withSource = function (source) {
        this.source = source;
        return this;
    };

    /**
     * @member Izi.binding.Config
     * @private
     * @param sourceProperties
     * @return {Izi.binding.Config}
     */
    Config.prototype.withSourceProperties = function (sourceProperties) {
        this.sourceProperties = sourceProperties.constructor === Array ? sourceProperties : [sourceProperties];
        return this;
    };

    /**
     * @member Izi.binding.Config
     * @private
     * @param target
     * @return {Izi.binding.Config}
     */
    Config.prototype.withTarget = function (target) {
        this.target = target;
        return this;
    };

    /**
     * @member Izi.binding.Config
     * @private
     * @param value
     * @return {Izi.binding.Config}
     */
    Config.prototype.withTargetProperty = function (value) {
        this.targetProperty = value;
        return this;
    };

    /**
     * @member Izi.binding.Config
     * @private
     * @param formatter
     * @return {Izi.binding.Config}
     */
    Config.prototype.withFormatter = function (formatter) {
        this.formatter = formatter;
        return this;
    };

    /**
     * @member Izi.binding.Config
     * @private
     * @param property
     */
    Config.prototype.addTriggerProperty = function (property) {
        this.triggerProperties.push(property);
    };

    /**
     * @member Izi.binding.Config
     * @private
     * @param {Izi.binding.Binding} binding
     */
    Config.prototype.addBinding = function (binding) {
        this.bindings.push(binding);
    };

    /**
     * @member Izi.binding.Config
     * @private
     * @param {Izi.binding.Binding} binding
     */
    Config.prototype.removeBinding = function (binding) {
        module.utils.removeItem(this.bindings, binding);
    };

    module.binding.Config = Config;
}(Izi);
!function (module) {
    /**
     * @member Izi.utils
     * @method
     * @since 1.1.0
     * @private
     * @param {Function} fn
     * @param {Object} scope
     * @return {Function}
     */
    module.utils.curry = function (fn, scope) {
        return function () {
            fn.apply(scope, arguments);
        }
    };
}(Izi);
!function (module) {
    /**
     * @member Izi.utils
     * @method
     * @private
     * @param {Array} factories
     * @param {Array} args
     * @param {Object} scope
     */
    module.utils.findClosure = function Izi_utils_findClosure(factories, args, scope) {
        var i, factory, closure;
        for (i = 0; i < factories.length; i = i + 1) {
            factory = factories[i];
            closure = factory.apply(scope, args);
            if (closure) {
                return closure;
            }
        }

        throw new Error("Closure not found");
    };
}(Izi);
!function (module) {
    /**
     * @member Izi.utils
     * @method
     * @since 1.1.0
     * @private
     * @param {String} text
     * @return {String}
     */
    module.utils.trim = function (text) {
        return text.replace(/^\W+/, '').replace(/\W+$/, '');
    };
}(Izi);
!function (module, global) {
    /**
     * @member Izi.utils
     * @method
     * @since 1.2.0
     * @private
     */
    var logImpl;
    if ("console" in global) {
        logImpl = function () {
            if (global.console.log.apply) {
                global.console.log.apply(global.console, arguments);
            } else {
                // IE :)
                global.console.log(Array.prototype.slice.call(arguments));
            }

        }
    } else {
        logImpl = function () {
            // no loggers other than window.console
        }
    }

    module.utils.log = function () {
        logImpl.apply(global, arguments);
    }

}(Izi, this);
/**
 * @requires Config.js
 * @requires ../utils/typeOf.js
 * @requires ../utils/forEach.js
 * @requires ../utils/curry.js
 * @requires ../utils/findClosure.js
 * @requires ../utils/trim.js
 * @requires ../utils/log.js
 */
!function (module) {
    var forEach = module.utils.forEach,
        curry = module.utils.curry,
        findClosure = module.utils.findClosure,
        trim = module.utils.trim,
        log = module.utils.log,
        INVALID_VALUE = {};

    function onlyOnceError() {
        throw new Error("twoWay() method may be used only once");
    }

    /**
     * Binding initializer - the last part of
     * <code>izi.bind().valueOf(source, 'sourceProperty').to(target, 'targetProperty')</code> fluent API
     * @class Izi.binding.Binding
     * @constructor
     * @private
     * @param {Izi.binding.Config} config
     */
    var Binding = function Izi_binding_Binding(config) {

        this.impl = config.impl;
        this.source = config.source.delegatedIn || config.source;
        this.sourceProperties = config.sourceProperties;
        this.triggerProperties = config.triggerProperties;
        this.target = config.target.delegatedIn || config.target;
        this.targetProperty = config.targetProperty;
        this.formatter = config.formatter;
        this.sourceReaders = {};
        this.targetReader = undefined;
        this.targetWriter = undefined;
        this.observers = [];
        this.options = config.options;
        this.getCallerLine = config.callerLineProvider;

        this.registerReadersAndWriters();

        if (this.options.auto) {
            if (this.options.executeAtStartup) {
                this.transferValue();
            }
            this.bind();
        }

        config.addBinding(this);
    };

    /**
     * @member Izi.binding.Binding
     * @private
     * @param object
     * @param properties
     * @return {*}
     */
    Binding.prototype.getFormattedValues = function (object, properties) {
        var values = [],
            sourceReader,
            sourceReaders = this.sourceReaders,
            formatter = this.formatter;


        forEach(properties, function (property) {
            sourceReader = sourceReaders[property];
            values.push(sourceReader(object, property));
        });

        if (formatter && (typeof formatter === "function")) {
            return formatter.apply(null, values);
        } else if (values.length === 1) {
            return values[0];
        } else {
            throw new Error("You must use formatter if you want to bind more properties than one. Ex: izi.bind().valueOf(model, 'firstName', 'lastName').through(concatFormatter)...");
        }
    };

    /**
     * @private
     * @param sourceValue
     */
    Binding.prototype.debugBinding = function (sourceValue) {
        var callerLine;

        if (this.options.debug) {
            callerLine = trim(this.getCallerLine());
            log('[BINDING] ' + callerLine, {
                source: this.source,
                sourceProperties: this.sourceProperties,
                target: this.target,
                targetProperty: this.targetProperty,
                triggerProperties: this.triggerProperties,
                value: sourceValue
            });
        }
    };

    /**
     * @member Izi.binding.Binding
     * @private
     */
    Binding.prototype.transferValue = function () {
        var source = this.source,
            sourceProperties = this.sourceProperties,
            sourceValue = this.getFormattedValues(source, sourceProperties),
            targetReader = this.targetReader,
            targetWriter = this.targetWriter,
            target = this.target,
            targetProperty = this.targetProperty,
            targetValue;

        try {
            targetValue = targetReader(target, targetProperty);
        } catch (error) {
            targetValue = INVALID_VALUE;
        }

        if (sourceValue !== targetValue) {
            this.debugBinding(sourceValue);
            targetWriter(target, targetProperty, sourceValue);
        }
    };

    /**
     * @member Izi.binding.Binding
     * @private
     * @param source
     * @param sourceProperty
     * @param target
     * @param targetProperty
     * @param transferValueFn
     * @return {*}
     */
    Binding.prototype.getChangeObserver = function (source, sourceProperty, target, targetProperty, transferValueFn) {
        var impl = this.impl;

        try {
            return findClosure(impl.changeObservers, [source, sourceProperty, target, targetProperty, transferValueFn], this);
        } catch (error) {
            if (!this.options.allowNotWatchable) {
                throw new Error("Could not find change observer for: " + source + " and property: " + sourceProperty);
            }

            if (module.isDebug) {
                log("[BINDING] Could not find change observer for:", source, "and property:", sourceProperty);
            }

            return function notWatchableObserver() {
                return function doNothing() {
                }
            }
        }
    };

    /**
     * @member Izi.binding.Binding
     * @private
     */
    Binding.prototype.registerReadersAndWriters = function () {
        var source = this.source,
            target = this.target,
            targetProperty = this.targetProperty,
            sourceProperties = this.sourceProperties,
            sourceReaders = this.sourceReaders,
            valueReaders = this.impl.valueReaders,
            valueWriters = this.impl.valueWriters,
            me = this;

        forEach(sourceProperties, function (sourceProperty) {
            try {
                sourceReaders[sourceProperty] = findClosure(valueReaders, [source, sourceProperty, "sourceReader"], this);
            } catch (e) {
                throw new Error("Could not find reader function for: " + source + " using property: " + sourceProperty);
            }
        });

        try {
            this.targetReader = findClosure(valueReaders, [target, targetProperty, "targetReader"], this);
        } catch (e) {
            this.targetReader = function () {
                return INVALID_VALUE;
            }
        }

        try {
            this.targetWriter = findClosure(valueWriters, [target, targetProperty], this);
        } catch (e) {
            throw new Error("Could not find writer function for: " + target + " using property: " + targetProperty);
        }
    };

    /**
     * Bind target to source (start listening for source changes). When you use <code>izi.bind()</code> this is called
     * automatically. You should call it only when you use <code>izi.bind({auto:false})</code> option.
     * This method doesn't transfer value from source to target - {@link Izi.binding.Binding#execute} does it.
     * @member Izi.binding.Binding
     * @since 1.1.0
     */
    Binding.prototype.bind = function () {
        var sourceProperties = this.sourceProperties,
            triggerProperties = this.triggerProperties,
            source = this.source,
            target = this.target,
            targetProperty = this.targetProperty,
            allTriggerProperties = triggerProperties.concat(sourceProperties),
            observers = this.observers,
            transferValueFn = curry(this.transferValue, this),
            me = this;

        forEach(allTriggerProperties, function (sourceProperty) {
            var changeObserver = me.getChangeObserver(source, sourceProperty, target, targetProperty, transferValueFn);
            observers.push(changeObserver(source, sourceProperty, target, targetProperty, transferValueFn));
        });

        this.reverseBinding && this.reverseBinding.bind();
    };

    /**
     * @member Izi.binding.Binding
     * @deprecated 1.1.0 Use {@link Izi.binding.Binding#unbind} instead.
     * @return {void}
     */
    Binding.prototype.stopObserving = function () {
        this.unbind();
    };

    /**
     * Unbind target from source (stop listening for source changes).
     * @member Izi.binding.Binding
     * @since 1.1.0
     */
    Binding.prototype.unbind = function () {
        forEach(this.observers, function (observer) {
            observer();
        });

        this.reverseBinding && this.reverseBinding.unbind()
    };

    /**
     * Creates two way binding between source and target. There are following limitations for using this feature:
     *
     *  * source property must be only one
     *  * `through()` function can't be defined
     *  * target can't be a function
     *
     * @member Izi.binding.Binding
     * @since 1.5.0
     * @returns {*}
     */
    Binding.prototype.twoWay = function () {
        if (this.formatter) {
            throw new Error("Two way binding doesn't allow to use .through(fn) function");
        }

        if (module.utils.typeOf(this.target) === "Function") {
            throw new Error("Two way binding doesn't allow to use function as a target");
        }

        var reverseConfig = new module.binding.Config(this.impl)
            .withOptions(this.options)
            .withSource(this.target)
            .withSourceProperties(this.targetProperty)
            .withTarget(this.source)
            .withTargetProperty(this.sourceProperties[0])
            .withCallerLineProvider(this.getCallerLine);

        this.reverseBinding = new module.binding.Binding(reverseConfig);
        this.twoWay = onlyOnceError;
        return this;
    };

    /**
     * Execute binding (transfer value from source to target). In case of two way binding it will be triggered
     * just binging from source to target.
     * @member Izi.binding.Binding
     * @since 1.1.0
     */
    Binding.prototype.execute = function () {
        this.transferValue();
    };

    module.binding.Binding = Binding;
}(Izi);
/**
 * @requires Binding.js
 */
!function (module) {

    /**
     * After `izi.bind().valueOf(widget)...` fluent API
     * @class Izi.binding.ValueOf
     * @constructor
     * @private
     * @param {Izi.binding.Config} config
     */
    var ValueOf = function Izi_binding_ValueOf(config) {
        this.config = config;
    };

    /**
     * Binding target setup.
     * You can pass directly target instance or object containing target on <strong>delegatedIn</strong> property.
     * 
     *     var label = new Label();
     *     var wrapper = {
     *         delegatedIn: label
     *     }
     *     izi.bind().valueOf(model).to(label, "text");
     *
     *     //will work also for:
     *     izi.bind().valueOf(model).to(wrapper, "text");
     * 
     * You can skip both parameters in order to more elegant notation:
     * 
     *     izi.bind().valueOf(model).to().textOf(label);
     * 
     *
     * As a target you can also use a function with given scope:
     *
     *     var scope = {
     *         firstName: null,
     *
     *         firstNameChangeHandler: function (value) {
     *             this.firstName = value;
     *         }
     *     }
     *
     *     izi.bind().valueOf(model, "firstName").to(scope.firstNameChangeHandler, scope);
     *     model.firstName("John");
     *
     * You can also skip the scope:
     *
     *     function firstNameChangeHandler(value) {
     *         console.log(value); // "John"
     *     }
     *
     *     izi.bind().valueOf(model, "firstName").to(firstNameChangeHandler);
     *     model.firstName("John");
     *
     * @member Izi.binding.ValueOf
     * @sanity izi.sanityOf("to()").args().args(izi.arg("targetFunction").ofFunction()).args(izi.arg("targetFunction").ofFunction(), izi.arg("scope").ofObject()).args(izi.arg("target").ofObject(), izi.arg("targetProperty").ofString()).args(izi.arg("target").ofObject().havingProperty("delegatedIn"), izi.arg("targetProperty").ofString()).check(arguments);
     * @param {Object/Function} [target] Model or widget or Function
     * @param {String/Object} [targetProperty] Target property name or Function scope
     * @return {Izi.binding.Binding|Izi.binding.ValueOf} `.to()` returns Izi.binding.ValueOf, `.to(target, "property")` returns Izi.binding.Binding
     */
    ValueOf.prototype.to = function (target, targetProperty) {
        if (arguments.length === 0) {
            return this;
        } else {
            return new module.binding.Binding(this.config.withTarget(target).withTargetProperty(targetProperty));
        }
    };

    /**
     * Binding target setup for 'value' property.
     *
     * @member Izi.binding.ValueOf
     * @sanity izi.sanityOf("valueOf()").args(izi.arg("target").ofObject()).args(izi.arg("target").ofObject().havingProperty("delegatedIn")).check(arguments);
     * @param {Object} target
     * @return {Izi.binding.Binding}
     */
    ValueOf.prototype.valueOf = function (target) {
        return this.to(target, "value");
    };

    /**
     * Binding target setup for 'text' property.
     *
     * @member Izi.binding.ValueOf
     * @sanity izi.sanityOf("textOf()").args(izi.arg("target").ofObject()).args(izi.arg("target").ofObject().havingProperty("delegatedIn")).check(arguments);
     * @param {Object} target
     * @return {Izi.binding.Binding}
     */
    ValueOf.prototype.textOf = function (target) {
        return this.to(target, "text");
    };

    /**
     * Binding target setup for 'selectedItems' property.
     *
     * @member Izi.binding.ValueOf
     * @sanity izi.sanityOf("selectedItemsOf()").args(izi.arg("target").ofObject()).args(izi.arg("target").ofObject().havingProperty("delegatedIn")).check(arguments);
     * @param {Object} target
     * @return {Izi.binding.Binding}
     */
    ValueOf.prototype.selectedItemsOf = function (target) {
        return this.to(target, "selectedItems");
    };

    /**
     * Formatter function which is used before set value on target.
     * If you specified more than one source properties - you must also specify formatter function.
     * 
     *     var fullNameFormatter = function (firstName, lastName) {
     *         return firstName + ' ' + lastName;
     *     }
     *     izi.bind().valueOf(model, 'firstName', 'lastName').through(fullNameFormatter)
     * 
     *
     * @member Izi.binding.ValueOf
     * @param {Function} formatter Function that combines all source values to one value
     * @return {Izi.binding.ValueOf}
     */
    ValueOf.prototype.through = function (formatter) {
        this.config.withFormatter(formatter);
        return this;
    };

    /**
     * Additional source property which change will trigger binding execution.
     * 
     *     var label = new Label();
     *     var model = new User();
     *     model.getFullName = function () {
     *       return this.get("firstName") + ' ' + this.get("lastName");
     *     }
     *
     *     izi.bind().valueOf(model, "fullName")
     *               .onChangeOf("firstName")
     *               .onChangeOf("lastName")
     *               .to().textOf(label);
     * 
     *
     * @member Izi.binding.ValueOf
     * @param {String} property Model property that triggers binding execution
     * @return {Izi.binding.ValueOf}
     */
    ValueOf.prototype.onChangeOf = function (property) {
        this.config.addTriggerProperty(property);
        return this;
    };

    module.binding.ValueOf = ValueOf;

}(Izi);
!function (module) {
    /**
     * @member Izi.utils
     * @method
     * @private
     * @param {Number} stackOffset
     * @return {Function}
     */
    module.utils.getCallerLineProvider = function (stackOffset) {
        if (!module.isDebug) {
            return function () {
                return "Line numbers are available only in debug version of izi-js";
            }
        }
        var error = Error();

        return function getCallerLine() {
            if (error.stack) {
                // WebKit / FireFox / Opera
                var callStack = error.stack.split("\n");
                var index = navigator.userAgent.indexOf("WebKit") > -1
                    ? 3 + stackOffset // Chrome
                    : 1 + stackOffset; // Firefox and Opera
                return callStack[index];
            } else {
                // IE
                return " [IE doesn't provide line number in call stack]";
            }
        }
    }
}(Izi);
/**
 * @requires ValueOf.js
 * @requires Config.js
 * @requires ../utils/getCallerLineProvider.js
 * @requires ../utils/forEach.js
 */
!function (module) {

    /**
     * After `izi.bind()...` fluent API
     * @class Izi.binding.Bind
     * @constructor
     * @private
     * @param {Izi.binding.Config} config
     */
    var Bind = function Izi_binding_Bind(config) {
        this.config = config;
    };

    /**
     * @param source
     * @param sourceProperty
     * @return {Izi.binding.ValueOf}
     * @private
     */
    Bind.prototype._valueOf = function (source, sourceProperty) {

        if (arguments.length > 2) {
            sourceProperty = Array.prototype.slice.call(arguments, 1);
        }
        var config = this.cloneConfig()
            .withSource(source)
            .withSourceProperties(sourceProperty || "value")
            .withCallerLineProvider(module.utils.getCallerLineProvider(2));

        return new module.binding.ValueOf(config);
    };

    /**
     * Binding source setup.
     *
     * You can pass directly source instance or object containing source on <strong>delegatedIn</strong> property.
     *
     *     var model = new User();
     *     var wrapper = {
     *         delegatedIn: model
     *     }
     *     izi.bind().valueOf(model, 'firstName');
     *
     *     // will work also for:
     *     izi.bind().valueOf(wrapper, 'firstName');
     *
     * You can also specify more than one property:
     *
     *     izi.bind().valueOf(model, 'firstName', 'lastName', 'title');
     *
     *
     * @sanity izi.sanityOf("valueOf()").args(izi.arg("source").ofObject()).args(izi.arg("source").ofObject().havingProperty("delegatedIn")).args(izi.arg("source").ofObject(), izi.varargOf(izi.arg("sourceProperty").ofString())).args(izi.arg("source").ofObject().havingProperty("delegatedIn"), izi.varargOf(izi.arg("sourceProperty").ofString())).check(arguments);
     * @member Izi.binding.Bind
     * @param {*} source Model or widget
     * @param {String...} [sourceProperty="value"] Property name or properties names
     * @return {Izi.binding.ValueOf}
     */
    Bind.prototype.valueOf = function (source, sourceProperty) {
        return this._valueOf.apply(this, arguments);
    };

    /**
     * Binding source setup for selected items of lists, grids, etc.
     * This is an alias to `this.valueOf(source, "selectedItems")`
     * You can pass directly model instance or object containing model on <strong>delegatedIn</strong> property.
     *
     *     var dataGrid = new DataGrid();
     *     var wrapper = {
     *         delegatedIn: dataGrid
     *     }
     *     izi.bind().selectedItemsOf(dataGrid);
     *
     *     // will work also for:
     *     izi.bind().selectedItemsOf(wrapper);
     *
     * @member Izi.binding.Bind
     * @sanity izi.sanityOf("selectedItemsOf()").args(izi.arg("source").ofObject()).args(izi.arg("source").ofObject().havingProperty("delegatedIn")).check(arguments);
     * @param {*} source Grid, list or any other 'selectedItems' holder
     * @return {Izi.binding.ValueOf}
     */
    Bind.prototype.selectedItemsOf = function (source) {
        return this._valueOf(source, "selectedItems");
    };

    /**
     * @member Izi.binding.Bind
     * @private
     * @return {Izi.binding.Config}
     */
    Bind.prototype.cloneConfig = function () {
        return new module.binding.Config(this.config.impl)
            .withBindings(this.config.bindings)
            .withOptions(this.config.options);
    };

    /**
     * Unbind all registered bindings created by one `izi.bind()` instance.
     *
     *     var model = new User();
     *     var firstNameEditor, lastNameEditor;
     *
     *     var bind = izi.bind();
     *
     *     bind.valueOf(model, "firstName").to().valueOf(firstNameEditor);
     *     bind.valueOf(model, "lastName").to().valueOf(lastNameEditor);
     *
     *     bind.unbindAll(); // will stop listening for changes of both properties (firstName and lastName)
     *
     * @since 1.1.0
     * @member Izi.binding.Bind
     */
    Bind.prototype.unbindAll = function () {
        module.utils.forEach(this.config.bindings, function (binding) {
            binding.unbind();
        })
    };

    /**
     * Execute manually all registered bindings created by one `izi.bind({auto: false})` instance.
     *
     *     var model = new User();
     *     var firstNameEditor, lastNameEditor;
     *
     *     var bind = izi.bind();
     *
     *     bind.valueOf(model, "firstName").to().valueOf(firstNameEditor);
     *     bind.valueOf(model, "lastName").to().valueOf(lastNameEditor);
     *
     *     bind.executeAll(); // will execute bindings for both properties (firstName and lastName)
     *
     * @since 1.1.0
     * @member Izi.binding.Bind
     */
    Bind.prototype.executeAll = function () {
        module.utils.forEach(this.config.bindings, function (binding) {
            binding.execute();
        })
    };

    module.binding.Bind = Bind;

}(Izi);
!function (module) {
    module.binding.impl.createObserver = function (matcher, observer) {
        return function () {
            return matcher.apply(this, arguments) ? observer : null;
        }
    };
}(Izi);

/**
 * @requires createObserver.js
 */
!function(module) {

    function matcher(source, sourceProperty, target, targetProperty, transferValueFn) {
        return source.iziObserveProperty;
    }

    function observer(source, sourceProperty, target, targetProperty, transferValueFn) {
        return source.iziObserveProperty(sourceProperty, transferValueFn);
    }

    module.binding.impl.customPropertyObserver = module.binding.impl.createObserver(matcher, observer);
}(Izi);
!function (module) {
    module.binding.impl.createReader = function (matcher, reader) {
        return function () {
            return matcher.apply(this, arguments) ? reader : null;
        }
    };
}(Izi);
!function (module) {
    /**
     * @member Izi.utils
     * @method
     * @private
     * @param {String} text
     * @return {String}
     */
    module.utils.capitalize = function (text) {
        return text.charAt(0).toUpperCase() + text.substr(1);
    };
}(Izi);
/**
 * @requires capitalize.js
 */
!function (module) {
    /**
     * @member Izi.utils
     * @method
     * @since 1.5.0
     * @private
     * @param {String} name
     * @return {String}
     */
    module.utils.getterOf = function (name) {
        return "get" + module.utils.capitalize(name);
    };
}(Izi);
/**
 * @requires createReader.js
 * @requires ../../utils/getterOf.js
 * @requires ../../utils/typeOf.js
 * @requires ../../utils/hasOwnProperty.js
 */
!function (module) {

    module.binding.impl.readByGet = function () {

        function matcher(object, property) {
            return (typeof object.get) === "function";
        }

        function reader(object, property) {
            return object.get(property);
        }

        return module.binding.impl.createReader(matcher, reader);
    }();

    module.binding.impl.readByCapitalizedGetter = function () {

        function reader(object, property) {
            return object[module.utils.getterOf(property)]();
        }

        function matcher(object, property) {
            return module.utils.typeOf(property) === "String" &&  (typeof object[module.utils.getterOf(property)]) === "function";
        }

        return module.binding.impl.createReader(matcher, reader);
    }();

    module.binding.impl.readByFunction = function () {

        function reader(object, property) {
            return object[property]();
        }

        function matcher(object, property) {
            return (typeof object[property] === 'function');
        }

        return module.binding.impl.createReader(matcher, reader);
    }();

    module.binding.impl.readFromProperty = function () {

        function reader(object, property) {
            return object[property];
        }

        function matcher(object, property) {
            return true;
        }

        return module.binding.impl.createReader(matcher, reader);
    }();

    module.binding.impl.readFromOwnedProperty = function () {

        function reader(object, property) {
            return object[property];
        }

        function matcher(object, property) {
            return module.utils.hasOwnProperty(object, property);
        }

        return module.binding.impl.createReader(matcher, reader);
    }();
    
}(Izi);
!function(module) {
    module.binding.impl.createWriter = function (matcher, writer) {
        return function () {
            return matcher.apply(this, arguments) ? writer : null;
        }
    };
}(Izi);

/**
 * @requires createWriter.js
 * @requires ../../utils/capitalize.js
 * @requires ../../utils/typeOf.js
 * @requires ../../utils/hasOwnProperty.js
 */
!function(module){

    module.binding.impl.writeBySet = function () {

        function matcher(object, property) {
            return (typeof object.set) === "function";
        }

        function writer(object, property, value) {
            object.set(property, value);
        }

        return module.binding.impl.createWriter(matcher, writer);
    }();

    module.binding.impl.writeByCapitalizedSetter = function () {

        var capitalize = module.utils.capitalize;

        function matcher(object, property) {
            return module.utils.typeOf(property) === "String" &&  (typeof object["set" + capitalize(property)]) === "function";
        }

        function writer(object, property, value) {
            object["set" + capitalize(property)](value);
        }

        return module.binding.impl.createWriter(matcher, writer);
    }();

    module.binding.impl.writeToProperty = function () {

        function matcher(object, property) {
            return true;
        }

        function writer(object, property, value) {
            object[property] = value;
        }

        return module.binding.impl.createWriter(matcher, writer);
    }();

    module.binding.impl.writeToOwnedProperty = function () {

        function matcher(object, property) {
            return module.utils.hasOwnProperty(object, property);
        }

        function writer(object, property, value) {
            object[property] = value;
        }

        return module.binding.impl.createWriter(matcher, writer);
    }();

    module.binding.impl.writeByFunction = function () {

        function matcher(object, property) {
            return module.utils.typeOf(object) === 'Function';
        }

        function writer(fn, scope, value) {
            try {
                fn.call(scope, value);
            } catch (e) {
            }
        }

        return module.binding.impl.createWriter(matcher, writer);
    }();

    module.binding.impl.writeToFunction = function () {

        function matcher(object, property) {
            return module.utils.typeOf(object[property]) === 'Function';
        }

        function writer(object, property, value) {
            object[property](value);
        }

        return module.binding.impl.createWriter(matcher, writer);
    }();

}(Izi);
/**
 * @requires ../../../utils/typeOf.js
 */
!function (module) {

    module.binding.impl.nested.isNestedProperty = function Izi_binding_impl_nested_isNestedProperty(property) {
        return module.utils.typeOf(property) === "String" && property.indexOf(".") > -1
    }
}(Izi);

/**
 * @requires isNestedProperty.js
 * @requires ../createObserver.js
 * @requires ../../../utils/curry.js
 */
!function (module) {

    function matcher(source, sourceProperty, target, targetProperty, transferValueFn) {
        return module.binding.impl.nested.isNestedProperty(sourceProperty);
    }

    function observer(source, sourceProperty, target, targetProperty, transferValueFn) {

        var nestedWatcher = source.iziNestedWatchers[sourceProperty];
        nestedWatcher.onValueChanged(transferValueFn);

        return module.utils.curry(nestedWatcher.stopObserving, nestedWatcher);
    }

    module.binding.impl.nested.nestedObserver = module.binding.impl.createObserver(matcher, observer);

}(Izi);
/**
 * @requires ../../../utils/findClosure.js
 */
!function (module) {

    var TargetFinder = function Izi_binding_impl_nested_TargetFinder(path, readers) {
        this.path = path.split(".");
        this.path.pop();
        this.readers = readers;
    };

    TargetFinder.prototype.findFor = function (object) {
        var currentObject = object;
        for (var i = 0; i < this.path.length; i++) {
            var property = this.path[i];

            try {
                var reader = module.utils.findClosure(this.readers, [currentObject, property, "targetReader"]);
                currentObject = reader(currentObject, property);
                if (!currentObject) {
                    break;
                }
            } catch (e) {
                break;
            }
        }

        if (i === this.path.length) {
            return currentObject;
        } else {
            return undefined;
        }
    };

    module.binding.impl.nested.TargetFinder = TargetFinder;
}(Izi);
/**
 * @requires ../../../utils/findClosure
 */
!function (module){

    var TargetWriter = function Izi_binding_impl_nested_TargetWriter(path, writers) {
        this.property = path.split(".").pop();
        this.writers = writers;
    };

    TargetWriter.prototype.writeValue = function (object, value) {
        try {
            var writer = module.utils.findClosure(this.writers, [object, this.property, value]);
            writer(object, this.property, value);
        } catch (e) {
        }
    };

    module.binding.impl.nested.TargetWriter = TargetWriter;
}(Izi);
/**
 * @requires isNestedProperty.js
 * @requires TargetFinder.js
 * @requires TargetWriter.js
 * @requires ../../../utils/log.js
 */
!function (module) {

    module.binding.impl.nested.nestedWriter = function () {
        var impl = this.impl, targetFinder, targetWriter;

        function matcher(object, property) {
            var result = module.binding.impl.nested.isNestedProperty(property);
            if (result) {
                targetFinder = new module.binding.impl.nested.TargetFinder(property, impl.valueReaders);
                targetWriter = new module.binding.impl.nested.TargetWriter(property, impl.valueWriters);

                if (module.isDebug && property.split(".").length > 3) {
                    module.utils.log("[BINDING]" + this.getCallerLine() + " Binding target path \"" + property +"\" has more than 3 parts. Consider using .to(function(value) { target.x.y.x = value; }) instead.");
                }
            }
            return result;
        }

        function writer(object, property, value) {
            var target = targetFinder.findFor(object);

            if (target) {
                targetWriter.writeValue(target, value);
            }
        }

        return matcher.apply(this, arguments) ? writer : null;
    }

}(Izi);
!function (module) {
    module.utils.inherit = function (Child, Parent) {
        var Proxy = function () {
        };
        Proxy.prototype = Parent.prototype;
        Child.prototype = new Proxy();
        Child.upper = Parent.prototype;
        Child.prototype.constructor = Child;
    };
}(Izi);
!function (module) {
    /**
     * @member Izi.utils
     * @method
     * @private
     * @param {Array} array
     * @param {Function} item
     * @param {Object} scope
     */
    module.utils.every = (function () {

        function byEvery(array, fn, scope) {
            return Array.prototype.every.call(array, fn, scope);
        }

        function byLoop(array, fn, scope) {

            var len = array.length >>> 0;

            for (var i = 0; i < len; i++) {
                if (i in array && !fn.call(scope, array[i], i, array))
                    return false;
            }

            return true;
        }

        function hasEvery() {
            return (typeof Array.prototype.every) === 'function';
        }

        return hasEvery() ? byEvery : byLoop;
    }());
}(Izi);
/**
 * @requires ../utils/forEach.js
 * @requires ../utils/every.js
 * @requires ../utils/removeItem.js
 */
!function (module) {

    var forEach = module.utils.forEach,
        every = module.utils.every;

    var Observable = function Izi_model_Observable() {
        this.listeners = {};
    };

    Observable.prototype = {

        constructor: Observable,

        /**
         * @member Izi.model.Observable
         * @noSanity
         * @param {String} type
         * @return {Object[]} array of objects containing fields: 'fn' and 'scope'
         */
        findListeners: function (type) {

            if (this.listeners[type] === undefined) {
                this.listeners[type] = [];
            }

            return this.listeners[type];
        },

        /**
         * @member Izi.model.Observable
         * @noSanity
         * @param {String} type
         * @param {Array|Arguments} [args]
         */
        dispatchEvent: function (type, args) {
            var me = this;
            forEach(this.findListeners(type), function (listener) {
                listener.fn.apply(listener.scope || me, args || []);
            })
        },

        /**
         * @member Izi.model.Observable
         * @noSanity
         * @param {String} type
         * @param {Function} fn
         * @param {Object} [scope]
         */
        addListener: function (type, fn, scope) {
            this.findListeners(type).push({fn: fn, scope: scope});
        },

        /**
         * @member Izi.model.Observable
         * @noSanity
         * @param {String} type
         * @param {Function} fn
         */
        removeListener: function (type, fn) {
            var listeners = this.findListeners(type),
                listenerToRemove;


            every(listeners, function (listener) {
                if (listener.fn === fn) {
                    listenerToRemove = listener;
                    return false;
                }
                return true;
            });

            if (listenerToRemove) {
                module.utils.removeItem(listeners, listenerToRemove);
            }
        }
    };

    module.model.Observable = Observable;
}(Izi);
/**
 * @requires ../../Binding.js
 * @requires ../../Config.js
 * @requires ../../../utils/inherit.js
 * @requires ../../../model/Observable.js
 */
!function (module) {

    function extractFirstField(field) {
        if (field.indexOf(".") === -1) {
            return field;
        }
        return field.substr(0, field.indexOf("."));
    }

    function extractNextFields(field) {
        if (field.indexOf(".") === -1) {
            return undefined;
        }

        return field.substr(field.indexOf(".") + 1);
    }

    var NestedWatcher = function Izi_binding_impl_NestedWatcher(path, bindingImpl) {
        this.path = path;
        this.bindingImpl = bindingImpl;
        this.sourceProperty = extractFirstField(path);

        var nextFields = extractNextFields(path);
        if (nextFields) {
            this.child = new NestedWatcher(nextFields, this.bindingImpl);
            this.child.onValueChanged(this.fireChange, this);
        }

        NestedWatcher.upper.constructor.apply(this);
    };

    module.utils.inherit(NestedWatcher, module.model.Observable);


    NestedWatcher.prototype.setSource = function (source) {
        this.stopObserving();
        this.source = source;
        this.startObserving();
    };

    NestedWatcher.prototype.onValueChanged = function (callback, scope) {
        this.addListener("valueChanged", callback, scope);
    };

    NestedWatcher.prototype.stopObserving = function () {
        if (this.handler) {
            this.handler.unbind();
        }

        if (this.child) {
            this.child.stopObserving();
        }
    };

    NestedWatcher.prototype.startObserving = function () {
        if (this.source) {
            var config = new module.binding.Config(this.bindingImpl)
                .withOptions({allowNotWatchable: true})
                .withSource(this.source)
                .withSourceProperties(this.sourceProperty)
                .withTarget(this.valueChanged)
                .withTargetProperty(this);
            this.handler = new module.binding.Binding(config);
        } else {
            this.fireChange(undefined);
        }
    };

    NestedWatcher.prototype.valueChanged = function (value) {
        if (this.child) {
            this.child.setSource(value);
        } else {
            this.fireChange(value);
        }
    };

    NestedWatcher.prototype.fireChange = function (value) {
        this.dispatchEvent("valueChanged", [value]);
    };

    module.binding.impl.nested.NestedWatcher = NestedWatcher;

}(Izi);
/**
 * @requires NestedWatcher.js
 * @requires isNestedProperty.js
 * @requires ../createReader.js
 */
!function (module) {

    function watchForCurrentValue(object, property, bindingImpl) {
        var nestedWatcher;

        if (!object.iziNestedWatchers) {
            object.iziNestedWatchers = {};
        }

        if (!object.iziNestedWatchers[property]) {
            nestedWatcher = new module.binding.impl.nested.NestedWatcher(property, bindingImpl);
            nestedWatcher.onValueChanged(function (value) {
                this.currentValue = value;
            }, nestedWatcher);
            nestedWatcher.setSource(object);
            object.iziNestedWatchers[property] = nestedWatcher;
        }
    }

    function matcher(bindingImpl) {

        return function (object, property, type) {
            var isWatchableNestedProperty = type === "sourceReader" && module.binding.impl.nested.isNestedProperty(property);

            if (isWatchableNestedProperty) {
                watchForCurrentValue(object, property, bindingImpl);
            }

            return isWatchableNestedProperty;
        }
    }

    function reader(object, property) {
        return object.iziNestedWatchers[property].currentValue;
    }

    module.binding.impl.nested.nestedReader = function (bindingImpl) {
        return module.binding.impl.createReader(matcher(bindingImpl), reader);
    };

}(Izi);
/**
 * @requires Bind.js
 * @requires Config.js
 *
 * @requires impl/customPropertyObserver.js
 * @requires impl/genericValueReaders.js
 * @requires impl/genericValueWriters.js
 *
 * @requires impl/nested/nestedObserver.js
 * @requires impl/nested/nestedWriter.js
 * @requires impl/nested/nestedReader.js
 */
!function (module) {
    /**
     * @member Izi.binding
     * @method
     * @private
     * @param {Object} impl
     */
    module.binding.register = function (impl) {
        var nestedImpl = {};
        nestedImpl.changeObservers = [module.binding.impl.nested.nestedObserver,
                                      module.binding.impl.customPropertyObserver].concat(impl.changeObservers);
        nestedImpl.valueWriters = [module.binding.impl.nested.nestedWriter].concat(impl.valueWriters);
        nestedImpl.valueReaders = [module.binding.impl.nested.nestedReader(nestedImpl)].concat(impl.valueReaders);

        return function (options) {
            return new module.binding.Bind(new module.binding.Config(nestedImpl).withOptions(options || {}));
        };
    };
}(Izi);
/**
 * @requires ../utils/curry.js
 */
!function (module) {
    var curry = module.utils.curry;

    /**
     * @class Izi.queue.TimeoutGuard
     * @private
     * @constructor
     * @param {Izi.queue.Queue} queue
     */
    var TimeoutGuard = function Izi_queue_TimeoutGuard(queue) {
        this.queue = queue;
        queue.onTaskStarted(this.startCountDown, this);
        queue.onTaskFinished(this.stopCountDown, this);
    };

    /**
     * @member Izi.queue.TimeoutGuard
     * @private
     * @param event
     */
    TimeoutGuard.prototype.startCountDown = function (event) {
        var timeout = this.queue.timeoutForTask(event.task);
        if (timeout > 0) {
            this.timeoutId = setTimeout(curry(this.timeoutTask, this), timeout);
        }
    };

    /**
     * @member Izi.queue.TimeoutGuard
     * @private
     */
    TimeoutGuard.prototype.timeoutTask = function () {
        this.queue.currentTaskTimeouted();
    };

    /**
     * @member Izi.queue.TimeoutGuard
     * @private
     */
    TimeoutGuard.prototype.stopCountDown = function () {
        clearTimeout(this.timeoutId);
    };

    module.queue.TimeoutGuard = TimeoutGuard;
}(Izi);
!function (module) {
    /**
     * @member Izi.utils
     * @method
     * @private
     * @param {Array} array
     * @param {Function} item
     * @param {Object} scope
     */
    module.utils.some = (function () {

        function bySome(array, fn, scope) {
            return Array.prototype.some.call(array, fn, scope);
        }

        function byLoop(array, fn, scope) {

            var len = array.length >>> 0;
            if (typeof fn != "function")
                throw new TypeError();

            for (var i = 0; i < len; i++) {
                if (i in array && fn.call(scope, array[i], i, array))
                    return true;
            }

            return false;
        }

        function hasSome() {
            return (typeof Array.prototype.some) === 'function';
        }

        return hasSome() ? bySome : byLoop;
    }());
}(Izi);
/**
 * @requires forEach.js
 * @requires some.js
 * @requires removeItem.js
 */
!function (module) {

    var Map = function org_izi_utils_Map() {
        this.items = [];
    };

    Map.prototype.set = function (key, value) {
        this.getItemOrCreate(key).value = value;
    };

    Map.prototype.get = function (key) {
        var item = this.getItem(key);
        return item ? item.value : undefined;
    };

    Map.prototype.remove = function (key) {
        var item = this.getItem(key);
        if (item) {
            module.utils.removeItem(this.items, item);
        }
    };

    Map.prototype.getKeys = function () {
        var keys = [];
        module.utils.forEach(this.items, function (item) {
            keys.push(item.key);
        });
        return keys;
    };

    Map.prototype.getKeysOf = function (value) {
        var keys = [];
        module.utils.forEach(this.items, function (item) {
            if (item.value === value) {
                keys.push(value);
            }
        });
        return keys;
    };

    Map.prototype.getValues = function () {
        var values = [];
        module.utils.forEach(this.items, function (item) {
            values.push(item.value);
        });
        return values;
    };

    Map.prototype.count = function () {
        return this.items.length;
    };

    Map.prototype.countValues = function (value) {
        var count = 0;
        module.utils.forEach(this.items, function (item) {
            if (item.value === value) {
                count++;
            }
        });
        return count;
    };

    Map.prototype.getItemOrCreate = function (key) {
        return this.getItem(key) || this.createItem(key);
    };

    Map.prototype.createItem = function (key) {
        var item = {
            key: key
        };
        this.items.push(item);
        return item;
    };

    Map.prototype.getItem = function (key) {
        var foundItem = undefined;
        module.utils.some(this.items, function (item) {
            if (item.key === key) {
                foundItem = item;
                return true;
            }
            return false;
        });
        return foundItem;
    };

    module.utils.Map = Map;

}(Izi);
/**
 * @requires ../model/Observable.js
 * @requires ../utils/inherit.js
 */
!function (module) {

    /**
     * @class Izi.queue.SynchronizedFunction
     * @private
     * @param originalFunction
     * @param scope
     */
    var SynchronizedFunction = function Izi_queue_SynchronizedFunction(originalFunction, scope) {
        SynchronizedFunction.upper.constructor.apply(this);
        this.originalFunction = originalFunction;
        this.scope = scope;
        this.logLabel = "synchronize.onCallback()";
    };
    module.utils.inherit(SynchronizedFunction, module.model.Observable);

    /**
     * @member Izi.queue.SynchronizedFunction
     * @private
     * @return {Function}
     */
    SynchronizedFunction.prototype.synchronizedFunction = function () {
        try
        {
            if (this.originalFunction)
                return this.originalFunction.apply(this.scope, arguments);
        }
        finally
        {
            this.dispatchEvent("synchronized", [this]);
        }
    };

    module.queue.SynchronizedFunction = SynchronizedFunction;
}(Izi);
/**
 * @requires ../model/Observable.js
 * @requires ../utils/inherit.js
 */
!function (module) {

    /**
     * @class Izi.queue.SynchronizedOnEvent
     * @private
     * @constructor
     * @param {izi} iziApi
     * @param {Object} dispatcher
     * @param {Array|Arguments} events
     */
    var SynchronizedOnEvent = function Izi_queue_SynchronizedOnEvent(iziApi, dispatcher, events) {
        SynchronizedOnEvent.upper.constructor.apply(this);
        var perform = iziApi.perform(this.doSynchronized, this);
        this.handler = perform.when.apply(perform, events).on(dispatcher);
        this.logLabel = "synchronize.onEvent()";
    };
    module.utils.inherit(SynchronizedOnEvent, module.model.Observable);

    /**
     * @member Izi.queue.SynchronizedOnEvent
     * @private
     */
    SynchronizedOnEvent.prototype.doSynchronized = function () {
        this.handler.stopObserving();
        this.dispatchEvent("synchronized", [this]);
    };

    module.queue.SynchronizedOnEvent = SynchronizedOnEvent;
}(Izi);
/**
 * @requires ../model/Observable.js
 * @requires ../utils/inherit.js
 */
!function (module) {

    /**
     * @class Izi.queue.SynchronizedResponder
     * @private
     * @constructor
     * @param {Object} responder
     * @param {String} [resultFunctionName="result"]
     * @param {String} [errorFunctionName="error"]
     */
    var SynchronizedResponder = function Izi_queue_SynchronizedResponder(responder, resultFunctionName, errorFunctionName) {
        SynchronizedResponder.upper.constructor.apply(this);

        var me = this;
        resultFunctionName = resultFunctionName || "result";
        errorFunctionName = errorFunctionName || "error";

        this.synchronizedResponder = {};
        this.synchronizedResponder[resultFunctionName] = function () {
            try {
                responder[resultFunctionName].apply(responder, arguments);
            } finally {
                me.dispatchEvent("synchronized", [me]);
            }
        };
        this.synchronizedResponder[errorFunctionName] = function () {
            try {
                responder[errorFunctionName].apply(responder, arguments);
            } finally {
                me.dispatchEvent("synchronized", [me]);
            }
        };
        this.logLabel = "synchronize.responder()";
    };

    module.utils.inherit(SynchronizedResponder, module.model.Observable);

    module.queue.SynchronizedResponder = SynchronizedResponder;
}(Izi);
/**
 * @requires ../utils/Map.js
 * @requires ../utils/curry.js
 * @requires ../utils/forEach.js
 * @requires SynchronizedFunction.js
 * @requires SynchronizedOnEvent.js
 * @requires SynchronizedResponder.js
 */
!function (module) {

    /**
     * Synchronizer is a utility that allows you to synchronize current task in the easiest way. Instance of this
     * class is available as first argument of `execute()` method when the task is defined as an `Object` or directly
     * as first argument of function, when the task is defined as a `Function`:
     *
     *     var task1 = {
     *             execute: function (synchronize) {
     *                 // synchronize.onCallback(...)
     *                 // synchronize.onEvent(...)
     *                 // synchronize.responder(...)
     *             }
     *         },
     *         task2 = function (synchronize) {
     *             // synchronize.onCallback(...)
     *             // synchronize.onEvent(...)
     *             // synchronize.responder(...)
     *         }
     *     };
     *     izi.queue().execute(task1, task2);
     *
     * When one of:
     *
     *  * {@link Izi.queue.Synchronizer#onCallback synchronize.onCallback}
     *  * {@link Izi.queue.Synchronizer#onEvent synchronize.onEvent}
     *  * {@link Izi.queue.Synchronizer#responder synchronize.responder}
     *
     * is called, it informs the queue that this task calls some asynchronous code, so queue should wait until all asynchronous callbacks
     * return. There may be synchronized more than one asynchronous code - the queue will be waiting for all of them.
     *
     * There is also available access to queue.cancel() method directly in synchronizer:
     *
     *     var task1 = {
     *         execute: function (synchronize) {
     *             // store handler of cancelQueue for later execution
     *             this.cancelQueue = synchronize.cancelQueue;
     *
     *             setTimeout(synchronize.onCallback(this.doOnCallback, this), 1000);
     *         },
     *
     *         doOnCallback: function () {
     *             if (someCondition) {
     *                 this.cancelQueue();
     *             }
     *         }
     *     }
     *
     *
     * @since 1.2.0
     * @class Izi.queue.Synchronizer
     * @constructor
     * @private
     * @param {Izi.queue.Queue} queue
     */
    var Synchronizer = function org_izi_queue_Synchronizer(queue) {
        this.queue = queue;
        this.synchronizations = new module.utils.Map();
        this.awaitedTasks = new module.utils.Map();

        /**
         * Delegates to queue.cancel()
         * @member Izi.queue.Synchronizer
         */
        this.cancelQueue = function () {
            queue.cancel();
        }
    };

    /**
     * Synchronizes the queue after `nonSynchronized` callback will be called by external caller. This method returns
     * a closure which executes first `nonSynchronized` function and after that notifies the queue to execute next task.
     * If `nonSynchronized` is not given, then queue will just execute next task when callback triggers.
     *
     * Example 1 - just synchronize on callback
     *
     *     var task1 = {
     *         execute: function(synchronize) {
     *             // when setTimeout() callback triggers after 1000ms, then queue will execute `task2`
     *             setTimeout(synchronize.onCallback(), 1000);
     *         }
     *     };
     *
     *     izi.queue().execute(task1, task2);
     *
     * Example 2 - synchronize on callback and execute some extra callback code
     *
     *     var task1 = {
     *         execute: function(synchronize) {
     *             setTimeout(synchronize.onCallback(this.doOnCallback, this), 1000);
     *         }
     *
     *         doOnCallback: function () {
     *             // do some extra code when callback called
     *             // after this code the queue will execute `task2`
     *         }
     *     };
     *
     *     izi.queue().execute(task1, task2);
     *
     * @since 1.2.0
     * @member Izi.queue.Synchronizer
     * @param {Function} [nonSynchronized]
     * @param {Object} [scope]
     * @return {Function}
     */
    Synchronizer.prototype.onCallback = function (nonSynchronized, scope) {
        var task = this.obtainTask(),
            synchronization = new module.queue.SynchronizedFunction(nonSynchronized, scope);

        this.recordSynchronization(synchronization, task);

        return module.utils.curry(synchronization.synchronizedFunction, synchronization);
    };

    /**
     * Synchronizes the queue when dispatcher will fire an event of given type
     *
     * Example - synchronize task when user clicks OK button
     *
     *     var task1 = {
     *         alertPopup: new AlertPopup(),
     *
     *         execute: function(synchronize) {
     *             synchronize.onEvent(this.alertPopup.okButton, izi.events.click());
     *         }
     *     };
     *
     *     izi.queue().execute(task1, task2);
     *
     * @since 1.2.0
     * @member Izi.queue.Synchronizer
     * @param {Object} dispatcher
     * @param {String...|Izi.events.EventConfig...} vararg of event types as String or `izi.events.*`
     */
    Synchronizer.prototype.onEvent = function (dispatcher, event) {
        var task = this.obtainTask(),
            synchronization = new module.queue.SynchronizedOnEvent(this.queue.iziApi, dispatcher, Array.prototype.slice.call(arguments, 1));
        this.recordSynchronization(synchronization, task);
    };

    /**
     * Synchronizes the queue when service triggers the responder either on `result()` or `error()` methods.
     * If you have reponder with methods different than `result()` or `error()`, then you can specify the custom ones.
     *
     * Example - synchronize task when any of `result()` or `error()` methods will be triggered
     *
     *     var task1 = {
     *
     *         execute: function(synchronize) {
     *             Ajax.request("/someUrl", someParameters, synchronize.responder(this));
     *         },
     *
     *         result: function (ajaxResponse) {
     *             // some code for handling Ajax response
     *             // after this code the queue will execute `task2`
     *         },
     *
     *         error: function (ajaxFailure) {
     *             // some code for handling Ajax error
     *             // after this code the queue will execute `task2`
     *         },
     *     };
     *
     *     izi.queue().execute(task1, task2);
     *
     * @since 1.2.0
     * @member Izi.queue.Synchronizer
     * @param {Object} responder
     * @param {String} [resultFunctionName="result"]
     * @param {String} [errorFunctionName="error"]
     * @return {*}
     */
    Synchronizer.prototype.responder = function (responder, resultFunctionName, errorFunctionName) {
        var task = this.obtainTask(),
            synchronization = new module.queue.SynchronizedResponder(responder, resultFunctionName, errorFunctionName);
        return this.recordSynchronization(synchronization, task).synchronizedResponder;
    };

    /**
     * @member Izi.queue.Synchronizer
     * @private
     * @param synchronization
     * @param task
     * @return {*}
     */
    Synchronizer.prototype.recordSynchronization = function (synchronization, task) {
        this.queue.log("        " + synchronization.logLabel + " was used by task: " + this.queue.getCurrentTaskIndex() + " of " + this.queue.countTasks());
        this.synchronizations.set(synchronization, task);
        synchronization.addListener("synchronized", this.removeSynchronization, this);
        return synchronization;
    };

    /**
     * @member Izi.queue.Synchronizer
     * @private
     * @param synchronization
     */
    Synchronizer.prototype.removeSynchronization = function (synchronization) {
        var task = this.synchronizations.get(synchronization);
        this.synchronizations.remove(synchronization);

        var pendingSynchronizationsOnTask = this.countSynchronizations(task);
        this.queue.log("        " + synchronization.logLabel + " completed by task: " + this.queue.getCurrentTaskIndex() + " of " + this.queue.countTasks());
        if (pendingSynchronizationsOnTask == 0)
            this.taskSynchronized(task);
    };

    /**
     * @member Izi.queue.Synchronizer
     * @private
     * @param task
     */
    Synchronizer.prototype.taskSynchronized = function (task) {
        var awaitedTasks = this.awaitedTasks;

        var proceedClosure = awaitedTasks.get(task);
        if (proceedClosure) {
            try {
                proceedClosure.fn.apply(proceedClosure.scope);
            }
            finally {
                awaitedTasks.remove(task);
            }
        }
    };

    /**
     * @member Izi.queue.Synchronizer
     * @private
     * @param task
     * @return {*}
     */
    Synchronizer.prototype.countSynchronizations = function (task) {
        return this.synchronizations.countValues(task);
    };

    /**
     * @member Izi.queue.Synchronizer
     * @private
     * @return {*}
     */
    Synchronizer.prototype.obtainTask = function () {
        var task = this.queue.currentTask;
        if (!task)
            throw new Error("There is no task executed. Please use izi.queue().execute(someTask) and use this method.");
        return task;
    };

    /**
     * @member Izi.queue.Synchronizer
     * @private
     * @return {boolean}
     */
    Synchronizer.prototype.hasPendingSynchronizations = function () {
        return !!this.synchronizations.count();
    };

    /**
     * @member Izi.queue.Synchronizer
     * @private
     * @param task
     * @param proceedClosure
     */
    Synchronizer.prototype.afterSynchronizingTaskCall = function (task, proceedClosure) {
        this.awaitedTasks.set(task, proceedClosure);
    };

    /**
     * @member Izi.queue.Synchronizer
     * @private
     * @param task
     */
    Synchronizer.prototype.taskTimeout = function (task) {
        var synchronizations = this.synchronizations,
            synchronizationsToRemove = synchronizations.getKeysOf(task);

        this.queue.log("    Time outed task: " + this.queue.getCurrentTaskIndex() + " of " + this.queue.countTasks());
        this.awaitedTasks.remove(task);

        module.utils.forEach(synchronizationsToRemove, function (synchronization) {
            synchronizations.remove(synchronization);
        });
    };

    module.queue.Synchronizer = Synchronizer;
}(Izi);
!function (module) {

    /**
     * @class Izi.queue.GenericTask
     * @private
     * @constructor
     * @param functionToExecute
     * @param scope
     */
    var GenericTask = function Izi_queue_GenericTask(functionToExecute, scope) {
        this.functionToExecute = functionToExecute;
        this.scope = scope;
    };

    /**
     * @member Izi.queue.GenericTask
     * @private
     */
    GenericTask.prototype.execute = function () {
        this.functionToExecute.apply(this.scope, arguments);
    };

    module.queue.GenericTask = GenericTask;
}(Izi);
/**
 * @requires ../utils/typeOf.js
 * @requires ../utils/mergeObjects.js
 * @requires ../utils/forEach.js
 * @requires ../utils/log.js
 * @requires TimeoutGuard.js
 * @requires Synchronizer.js
 * @requires GenericTask.js
 */
!function (module, global) {

    var typeOf = module.utils.typeOf,
        mergeObjects = module.utils.mergeObjects,
        forEach = module.utils.forEach,
        log = module.utils.log,
        queueUniqueId = 0;

    function formatTimeStamp() {
        var now = new Date();
        return padding(now.getHours(), 2) +
               ":" +
               padding(now.getMinutes(), 2) +
               ":" +
               padding(now.getSeconds(), 2) +
               "." +
               padding(now.getMilliseconds(), 3);
    }

    function padding(value, padding) {
        var number = "" + value;
        return new Array(padding - number.length + 1).join("0") + number;
    }

    /**
     * `izi.queue()` allows you to define and execute sequence of synchronous and asynchronous tasks. Task may be defined
     * as a `Function` or an `Object` with `execute()` function.
     *
     *     var taskAsFunction = function () {
     *         // some code of task
     *     }
     *
     *     var taskAsObject = {
     *         execute: function () {
     *             // some code of task
     *         }
     *     }
     *
     * Example - two equivalent ways for defining and running the queue:
     *
     *     izi.queue().execute(task1,
     *                         task2,
     *                         task3);
     *
     *     // is a shortcut of:
     *     izi.queue().push(task1,
     *                      task2,
     *                      task3).start();
     *
     * The second example allows you to define a queue once and run many times and also it allows to add event listeners
     * before starting the queue:
     *
     *     var queue = izi.queue().push(task1,
     *                                  task2,
     *                                  task3);
     *
     *     queue.onTaskStarted(doSomethingWhenTaskStarted);
     *     queue.onTaskFinished(doSomethingWhenTaskFinished);
     *
     *     queue.start();
     *
     * When the task executes some asynchronous code and the queue should wait until it finish - then we can say the task
     * is asynchronous and we need to notify somehow the queue to not execute next task immediately. This problem is
     * solved by usage of **{@link Izi.queue.Synchronizer synchronize}** argument passed to each task, like in example below:
     *
     *     var asynchronousTask = {
     *         execute: function (synchronize) {
     *             setTimeout(synchronize.onCallback(), 1000);
     *         }
     *     };
     *     var synchronousTask = {
     *         execute: function () {
     *             // do some synchronous code
     *         }
     *     }
     *
     *     izi.queue().execute(asynchronousTask,
     *                         synchronousTask);
     *
     * You can find more synchronization methods in {@link Izi.queue.Synchronizer} documentation
     *
     * @class Izi.queue.Queue
     * @since 1.2.0
     * @constructor
     * @private
     * @param {Object} impl framework queue implementation
     * @param {Object} config queue configuration
     * @param {izi} iziApi
     */
    var Queue = function Izi_queue_Queue(impl, config, iziApi) {
        var defaultConfig = {
            scope: global,
            defaultTimeout: 0,
            debug: undefined
        };

        this.config = mergeObjects(defaultConfig, config);
        this.iziApi = iziApi;
        this.queue = [];
        this.originalQueue = [];
        if (this.config.debug) {
            queueUniqueId++;
            this.id = this.config.debug + ":" + queueUniqueId;
        }

        this.delegatedIn = impl.createEventDispatcher();
        this.dispatchEvent = impl.dispatchEvent;

        this.synchronizer = new module.queue.Synchronizer(this);
        new module.queue.TimeoutGuard(this);
    };

    /**
     * Enqueue all given functions and tasks (object with execute function), and execute them sequentially
     *
     * @since 1.2.0
     * @member Izi.queue.Queue
     * @param {Function...|Object~execute()...} vararg of tasks or functions
     * @return {Izi.queue.Queue}
     */
    Queue.prototype.execute = function () {
        this.pushAll(arguments);
        this.start();
        return this;
    };

    /**
     * Enqueue all given functions and tasks (object with execute function)
     *
     * @since 1.2.0
     * @member Izi.queue.Queue
     * @param {Function...|Object~execute...} vararg of tasks or functions
     * @return {Izi.queue.Queue}
     */
    Queue.prototype.push = function () {
        this.pushAll(arguments);
        return this;
    };

    /**
     * Start executing tasks synchronously
     *
     * @since 1.2.0
     * @member Izi.queue.Queue
     * @return {Izi.queue.Queue}
     */
    Queue.prototype.start = function () {
        if (this.isExecutedTask()) {
            throw new Error("Can't start already started queue until it's finished");
        }

        this.queue = this.originalQueue.slice();
        this.log("Queue started. Total tasks to execute: " + this.countTasks());
        this.proceed();
        return this;
    };

    /**
     * Cancel executing tasks.
     *
     * @since 1.2.0
     * @member Izi.queue.Queue
     */
    Queue.prototype.cancel = function () {
        this.log("Queue canceled at executing task: " + this.getCurrentTaskIndex() + " of " + this.countTasks());
        this.dispatchTaskEvent("queueCanceled", true);
        this.queue = [];
        this.clearAndProceed();
    };

    /**
     * Add "taskStarted" event listener
     *
     * @since 1.2.0
     * @param {Function} fn
     * @param {Object} [scope]
     * @return {Izi.behavior.OnWidget}
     */
    Queue.prototype.onTaskStarted = function (fn, scope) {
        return this.iziApi.perform(fn, scope || global).when("taskStarted").on(this);
    };

    /**
     * Add "taskFinished" event listener
     *
     * @since 1.2.0
     * @param {Function} fn
     * @param {Object} [scope]
     * @return {Izi.behavior.OnWidget}
     */
    Queue.prototype.onTaskFinished = function (fn, scope) {
        return this.iziApi.perform(fn, scope || global).when("taskFinished").on(this);
    };

    /**
     * Add "taskTimeouted" event listener
     *
     * @since 1.2.0
     * @param {Function} fn
     * @param {Object} [scope]
     * @return {Izi.behavior.OnWidget}
     */
    Queue.prototype.onTaskTimeouted = function (fn, scope) {
        return this.iziApi.perform(fn, scope || global).when("taskTimeouted").on(this);
    };

    /**
     * Add "queueFinished" event listener
     *
     * @since 1.2.0
     * @param {Function} fn
     * @param {Object} [scope]
     * @return {Izi.behavior.OnWidget}
     */
    Queue.prototype.onQueueFinished = function (fn, scope) {
        return this.iziApi.perform(fn, scope || global).when("queueFinished").on(this);
    };

    /**
     * Add "queueCanceled" event listener
     *
     * @since 1.2.0
     * @param {Function} fn
     * @param {Object} [scope]
     * @return {Izi.behavior.OnWidget}
     */
    Queue.prototype.onQueueCanceled = function (fn, scope) {
        return this.iziApi.perform(fn, scope || global).when("queueCanceled").on(this);
    };

    /**
     * @member Izi.queue.Queue
     * @private
     * @param tasksOrFunctions
     */
    Queue.prototype.pushAll = function (tasksOrFunctions) {
        var me = this;

        forEach(tasksOrFunctions, function (taskOrFunction, index) {

            if (typeOf(taskOrFunction) === 'Function') {
                me.pushFunction(taskOrFunction);
            } else if (typeOf(taskOrFunction) === 'Object' && typeOf(taskOrFunction.execute) === 'Function') {
                me.pushTask(taskOrFunction);
            } else {
                throw new Error("Invalid queue element given at index: " + index + ". Expected Function or Object with execute() function.");
            }
        });
    };

    /**
     * @member Izi.queue.Queue
     * @private
     * @param task
     */
    Queue.prototype.pushTask = function (task) {
        this.originalQueue.push(task);
    };

    /**
     * @member Izi.queue.Queue
     * @private
     * @param fn
     */
    Queue.prototype.pushFunction = function (fn) {
        this.pushTask(new module.queue.GenericTask(fn, this.getScope()));
    };

    /**
     * @member Izi.queue.Queue
     * @private
     * @return {*}
     */
    Queue.prototype.getScope = function () {
        return this.config.scope;
    };

    /**
     * @member Izi.queue.Queue
     * @private
     */
    Queue.prototype.proceed = function () {
        if (this.isExecutedTask())
            return;

        if (this.isEmptyQueue()) {
            this.log("");
            this.log("Queue finished");
            this.dispatchTaskEvent("queueFinished");
            return;
        }

        this.executeSynchronously(this.queue.shift());
    };

    /**
     * @member Izi.queue.Queue
     * @private
     * @return {boolean}
     */
    Queue.prototype.isEmptyQueue = function () {
        return this.queue.length === 0
    };

    /**
     * @member Izi.queue.Queue
     * @private
     * @return {boolean}
     */
    Queue.prototype.isExecutedTask = function () {
        return !!this.currentTask;
    };

    /**
     * @member Izi.queue.Queue
     * @private
     * @param task
     */
    Queue.prototype.executeSynchronously = function (task) {
        this.currentTask = task;
        this.log("");
        this.log("    Task started: " + this.getCurrentTaskIndex() + " of " + this.countTasks());
        this.dispatchTaskEvent("taskStarted", true);
        task.execute(this.synchronizer);
        this.awaitSynchronizerOrProceed();
    };

    /**
     * @member Izi.queue.Queue
     * @private
     */
    Queue.prototype.awaitSynchronizerOrProceed = function () {
        if (this.synchronizer.hasPendingSynchronizations()) {
            this.synchronizer.afterSynchronizingTaskCall(this.currentTask, {fn: this.taskSynchronized, scope: this});
        }
        else {
            this.log("        No synchronizations used by task: " + this.getCurrentTaskIndex() + " of " + this.countTasks());
            this.taskSynchronized();
        }
    };

    /**
     * @member Izi.queue.Queue
     * @private
     */
    Queue.prototype.taskSynchronized = function () {
        this.log("    Task finished: " + this.getCurrentTaskIndex() + " of " + this.countTasks());
        this.dispatchTaskEvent("taskFinished", true);
        this.clearAndProceed();
    };

    /**
     * @member Izi.queue.Queue
     * @private
     */
    Queue.prototype.clearAndProceed = function () {
        this.currentTask = undefined;
        this.proceed();
    };

    /**
     * @member Izi.queue.Queue
     * @private
     * @param type
     * @param addStatistics
     */
    Queue.prototype.dispatchTaskEvent = function (type, addStatistics) {
        var event = {
            type: type,
            queue: this,
            task: this.currentTask
        };
        if (addStatistics) {
            event.currentTask = this.getCurrentTaskIndex();
            event.totalTasks = this.countTasks();
        }
        this.dispatchEvent(this.delegatedIn, type, event)
    };

    /**
     * @member Izi.queue.Queue
     * @private
     * @return {number}
     */
    Queue.prototype.getCurrentTaskIndex = function () {
        return this.originalQueue.length - this.queue.length;
    };

    /**
     * @member Izi.queue.Queue
     * @private
     * @return {Number}
     */
    Queue.prototype.countTasks = function () {
        return this.originalQueue.length;
    };

    /**
     * @member Izi.queue.Queue
     * @private
     * @param task
     * @return {Number}
     */
    Queue.prototype.timeoutForTask = function (task) {
        // todo - specific timeouts for tasks
        return this.config.defaultTimeout;
    };

    /**
     * @member Izi.queue.Queue
     * @private
     */
    Queue.prototype.currentTaskTimeouted = function () {
        this.synchronizer.taskTimeout(this.currentTask);
        this.dispatchTaskEvent("taskTimeouted", true);
        this.clearAndProceed();
    };

    Queue.prototype.log = function (message) {
        if (this.config.debug) {
            log("[izi.queue:" + this.id + "] " + formatTimeStamp() + " " + message);
        }
    };

    module.queue.Queue = Queue;

}(Izi, this);
/**
 * @requires Queue.js
 */
!function (module) {
    /**
     * @member Izi.binding
     * @method
     * @private
     * @param {Object} impl
     * @param {izi} iziApi
     */
    module.queue.register = function (impl, iziApi) {

        return function (config) {
            return new module.queue.Queue(impl, config, iziApi);
        };
    };
}(Izi);
/**
 * @requires indexOf.js
 */
!function (module) {
    /**
     * @member Izi.utils
     * @method
     * @private
     * @param {Array} array
     * @param {*} item
     * @return {Boolean}
     */
    module.utils.arrayContains = function (array, item) {
        return module.utils.indexOf(array, item) !== -1;
    };
}(Izi);
!function (module) {
    /**
     * @param {String} classString
     * @private
     * @constructor
     */
    module.utils.ClassNotFound = function (classString) {
        this.message = "Class name given as string: \"" + classString + "\" couldn't be resolved as a class";
    };

    module.utils.ClassNotFound.prototype = new Error();
}(Izi);
/**
 * @requires forEach.js
 * @requires ClassNotFound.js
 */
!function (module) {
    /**
     * @member Izi.utils
     * @method
     * @private
     * @param {String} classString
     * @param {Object} globals
     * @return {Function}
     */
    module.utils.getClassByName = function (classString, globals) {
        var currentPart,
            parts = classString.split(".");
        currentPart = globals;

        module.utils.forEach(parts, function (part) {
            var nextPart = currentPart[part];
            if (nextPart === undefined) {
                throw new module.utils.ClassNotFound(classString);
            }
            currentPart = nextPart;
        });

        return currentPart;
    };
}(Izi);
/**
 * @requires ../../utils/forEach.js
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
            if (bean[prop] && bean[prop].isIziInjection) {
                bean[prop] = bean[prop].resolveBean(context);
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
!function(module){
    /**
     * Ready instance strategy used in {@link Izi.ioc.bean.BeanBuilder}
     * @class Izi.ioc.bean.InstanceStrategy
     * @private
     * @constructor
     * @param {*} instance
     */
    var InstanceStrategy = function Izi_ioc_bean_InstanceStrategy(instance) {
        this.instance = instance;
    };

    InstanceStrategy.prototype.init = function (beansContext) {
        return this.instance;
    };

    InstanceStrategy.prototype.create = function (beansContext) {
        return this.instance;
    };

    InstanceStrategy.prototype.matchesByType = function (type) {
        return this.instance instanceof type;
    };

    InstanceStrategy.prototype.getArguments = function () {
        return [];
    };

    module.ioc.bean.InstanceStrategy = InstanceStrategy;
}(Izi);
!function(module) {
    /**
     * @private
     * @param {String|Function} beanIdOrType
     * @constructor
     */
    module.ioc.bean.NoBeanMatched = function (beanIdOrType) {
        this.message = "No bean matched: " + beanIdOrType;
    };
}(Izi);
/**
 * @requires ../utils/typeOf.js
 * @requires ../utils/forEach.js
 * @requires ../utils/hasOwnProperty.js
 * @requires ../utils/every.js
 * @requires ../model/Observable.js
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
/**
 * @requires ../utils/typeOf.js
 * @requires ../utils/getClassByName.js
 */
!function (module) {

    /**
     * Configuration used in IoC/DI fluent API
     * @class Izi.ioc.Config
     * @constructor
     * @private
     * @param {Function|String|Object} Class Class constructor, dotted class definition string or ready instance of bean
     * @param {Function} Strategy Strategy constructor
     * @param {Object} globals
     */
    var Config = function Izi_ioc_Config(Class, Strategy, globals) {
        this.Clazz = this._resolveClass(Class, globals);
        this.Strategy = Strategy;
        this.args = [];
    };

    /**
     * @member Izi.ioc.Config
     * @private
     * @return {*}
     */
    Config.prototype.createStrategy = function () {
        return new this.Strategy(this);
    };

    /**
     * @member Izi.ioc.Config
     * @private
     * @return {Array}
     */
    Config.prototype.getArguments = function () {
        return this.args;
    };

    /**
     * @member Izi.ioc.Config
     * @private
     * @return {Array}
     */
    Config.prototype.getProperties = function () {
        return this.props;
    };

    /**
     * @member Izi.ioc.Config
     * @private
     * @return {Function|String|Object}
     */
    Config.prototype.getClazz = function () {
        return this.Clazz;
    };

    /**
     * Arguments that will be used to object creation. It accept also {@link izi#inject izi.inject()} values.
     *     izi.bakeBeans({
     *         bean: izi.instantiate(Class).withArgs("Value", izi.inject("beanId")
     *     });
     *
     * @member Izi.ioc.Config
     * @noSanity
     * @param {Object...|Izi.ioc.Injection...} vararg arguments
     * @return {Izi.ioc.Config}
     */
    Config.prototype.withArgs = function () {
        if (arguments.length > 10) {
            throw new Error("Too many arguments passed. Ten arguments is maximum.");
        }

        this.args = arguments;
        return this;
    };

    /**
     * Properties that will be used to overwrite on created bean. It accept also {@link izi#inject izi.inject()} values.
     *     izi.bakeBeans({
     *         bean: izi.instantiate(Class).withProps({field1: "Value 1", field2: izi.inject("beanId")})
     *     });
     *
     * @member Izi.ioc.Config
     * @noSanity
     * @param {Object} props Map of property=>value used to overwrite on bean
     * @return {Izi.ioc.Config}
     */
    Config.prototype.withProps = function (props) {
        this.props = props;
        return this;
    };

    Config.prototype._resolveClass = function (Class, globals) {
        if (module.utils.typeOf(Class) === "String") {
            Class = module.utils.getClassByName(Class, globals);
        }
        return Class;
    };

    module.ioc.Config = Config;
}(Izi);
/**
 * @requires ../utils/getCallerLineProvider.js
 * @requires ../utils/ClassNotFound.js
 * @requires bean/NoBeanMatched.js
 */
!function (module) {

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
    };

    /**
     * @member Izi.ioc.Injection
     * @private
     * @return {String}
     */
    Injection.prototype.getBeanNotFoundMessage = function() {
        return "Bean couldn't be found from injection at line:\n" + this.getCallerLine();
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
        return bean;
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
/**
 * @requires ../../utils/hasOwnProperty.js
 * @requires ../../utils/getClassByName.js
 */
!function(module) {
    module.ioc.bean.createInstance = function (Clazz, args, props, beansContext) {

        function resolveArguments(args, beansContext) {
            var i, arg, result = [];
            for (i = 0; i < args.length; i = i + 1) {
                arg = args[i];
                if (arg && arg.isIziInjection) {
                    result.push(arg.resolveBean(beansContext));
                } else {
                    result.push(arg);
                }
            }
            return result;
        }

        function applyProps(instance, props) {
            if (props !== undefined) {
                for (var prop in props) {
                    if (module.utils.hasOwnProperty(props, prop)) {
                        instance[prop] = props[prop];
                    }
                }
            }
        }

        if (module.utils.typeOf(Clazz) === "String") {
            Clazz = module.utils.getClassByName(Clazz, beansContext.globals);
        }

        var a = resolveArguments(args, beansContext),
            argsCount = a.length,
            instance;

        if (argsCount === 0) {
            instance = new Clazz();
        } else if (argsCount === 1) {
            instance = new Clazz(a[0]);
        } else if (argsCount === 2) {
            instance = new Clazz(a[0], a[1]);
        } else if (argsCount === 3) {
            instance = new Clazz(a[0], a[1], a[2]);
        } else if (argsCount === 4) {
            instance = new Clazz(a[0], a[1], a[2], a[3]);
        } else if (argsCount === 5) {
            instance = new Clazz(a[0], a[1], a[2], a[3], a[4]);
        } else if (argsCount === 6) {
            instance = new Clazz(a[0], a[1], a[2], a[3], a[4], a[5]);
        } else if (argsCount === 7) {
            instance = new Clazz(a[0], a[1], a[2], a[3], a[4], a[5], a[6]);
        } else if (argsCount === 8) {
            instance = new Clazz(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7]);
        } else if (argsCount === 9) {
            instance = new Clazz(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8]);
        } else if (argsCount === 10) {
            instance = new Clazz(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9]);
        } else {
            throw new Error("Too many arguments given");
        }

        applyProps(instance, props);

        return instance;
    };
}(Izi);
/**
 * @requires createInstance.js
 */
!function (module) {

    /**
     * Singleton strategy used in {@link Izi.ioc.bean.BeanBuilder}
     * @class Izi.ioc.bean.SingletonStrategy
     * @private
     * @constructor
     * @param {Izi.ioc.Config} config
     */
    var SingletonStrategy = function Izi_ioc_bean_SingletonStrategy(config) {
        this.Clazz = config.getClazz();
        this.args = config.getArguments();
        this.props = config.getProperties();
        this.instance = undefined;
    };

    SingletonStrategy.prototype.createInstance = function (beansContext) {
        if (!this.instance) {
            this.instance = module.ioc.bean.createInstance(this.Clazz, this.args, this.props, beansContext);
        }

        return this.instance;
    };

    SingletonStrategy.prototype.init = function (beansContext) {
        return this.createInstance(beansContext);
    };

    SingletonStrategy.prototype.create = function (beansContext) {
        return this.createInstance(beansContext);
    };

    SingletonStrategy.prototype.matchesByType = function (type) {
        return type === this.Clazz;
    };

    SingletonStrategy.prototype.getArguments = function () {
        return this.args;
    };

    module.ioc.bean.SingletonStrategy = SingletonStrategy;
}(Izi);
/**
 * @requires createInstance.js
 */
!function(module) {
    /**
     * Lazy Singleton strategy used in {@link Izi.ioc.bean.BeanBuilder}
     * @class Izi.ioc.bean.LazySingletonStrategy
     * @private
     * @constructor
     * @param {Izi.ioc.Config} config
     */
    var LazySingletonStrategy = function Izi_ioc_bean_LazySingletonStrategy(config) {
        this.Clazz = config.getClazz();
        this.args = config.getArguments();
        this.props = config.getProperties();
        this.instance = undefined;
    };

    LazySingletonStrategy.prototype.init = function (context) {
        return null;
    };

    LazySingletonStrategy.prototype.create = function (context) {
        if (!this.instance) {
            this.instance = module.ioc.bean.createInstance(this.Clazz, this.args, this.props, context);
        }

        return this.instance;
    };

    LazySingletonStrategy.prototype.matchesByType = function (type) {
        return type === this.Clazz;
    };

    LazySingletonStrategy.prototype.getArguments = function () {
        return this.args;
    };
    
    module.ioc.bean.LazySingletonStrategy = LazySingletonStrategy;
}(Izi);
/**
 * @requires createInstance.js
 */
!function(module) {
    /**
     * Prototype strategy used in {@link Izi.ioc.bean.BeanBuilder}
     * @class Izi.ioc.bean.PrototypeStrategy
     * @private
     * @constructor
     * @param {Izi.ioc.Config} config
     */
    var PrototypeStrategy = function Izi_ioc_bean_PrototypeStrategy(config) {
        this.Clazz = config.getClazz();
        this.args = config.getArguments();
        this.props = config.getProperties();
    };

    PrototypeStrategy.prototype.init = function (beansContext) {
        return null;
    };

    PrototypeStrategy.prototype.create = function (beansContext) {
        return module.ioc.bean.createInstance(this.Clazz, this.args, this.props, beansContext);
    };

    PrototypeStrategy.prototype.matchesByType = function (type) {
        return type === this.Clazz;
    };

    PrototypeStrategy.prototype.getArguments = function () {
        return this.args;
    };

    module.ioc.bean.PrototypeStrategy = PrototypeStrategy;
}(Izi);
/**
 * @requires capitalize.js
 */
!function (module) {
    /**
     * @member Izi.utils
     * @method
     * @since 1.5.0
     * @private
     * @param {String} name
     * @return {String}
     */
    module.utils.setterOf = function (name) {
        return "set" + module.utils.capitalize(name);
    };
}(Izi);
/**
 * @requires Observable.js
 * @requires ../utils/getterOf.js
 * @requires ../utils/setterOf.js
 * @requires ../utils/typeOf.js
 */
!function (module) {

    var forEach = module.utils.forEach;

    function normalizeFields(fields) {
        var result = [];
        forEach(fields, function (field) {
            field = module.utils.typeOf(field) === "Object" ? field : {name: field};
            field.getter = module.utils.getterOf(field.name);
            field.setter = module.utils.setterOf(field.name);
            result.push(field);
        });
        return result;
    }

    function hasToPlainObjectMethod(value) {
        return value && module.utils.typeOf(value.toPlainObject) === "Function";
    }

    function implementGetterAndSetter(Class, name, getter, setter) {

        Class.prototype[name] = function (value) {
            if (arguments.length === 0) {
                return this[getter]();
            } else if (arguments.length === 1) {
                return this[setter](value);
            } else {
                throw new Error("Too many arguments. Setter function requires exactly one argument");
            }
        };

        Class.prototype[getter] = function () {
            return this.get(name);
        };

        Class.prototype[setter] = function (value) {
            return this.set(name, value);
        };
    }

    function createInitialData(fields) {
        var data = {};

        forEach(fields, function (field) {
            if (field.hasOwnProperty("defaultValue")) {
                data[field.name] = field.defaultValue;
            } else if (field.hasOwnProperty("initialValue")) {
                data[field.name] = field.initialValue;
            }
        });
        return data;
    }

    /**
     * See [Model guide](#guide/model) for usage documentation.
     *
     * @extends Izi.model.Observable
     * @class Izi.model.Model
     * @constructor
     */
    var Model = function Izi_Model() {
        Model.upper.constructor.apply(this, arguments);
        this.init();
    };

    module.utils.inherit(Model, module.model.Observable);

    /**
     * @member Izi.model.Model
     * @private
     * @type {Boolean}
     */
    Model.prototype.isIziModel = true;

    /**
     * Abstract init method called from constructor
     * @member Izi.model.Model
     * @protected
     */
    Model.prototype.init = function () {
    };

    /**
     * Retrieves value of given property name
     * @member Izi.model.Model
     * @param {String} propertyName
     * @return {*}
     */
    Model.prototype.get = function (propertyName) {
        return this.data[propertyName];
    };

    /**
     * Updates value of given property name and returns own model instance (this).
     * @member Izi.model.Model
     * @fires change
     * @fires propertyNameChange
     * @param {String|Object} propertyName or map of pairs property=>value
     * @param {*} [value]
     * @return {Izi.model.Model}
     */
    Model.prototype.set = function (propertyName, value) {

        if (arguments.length === 1 && module.utils.typeOf(propertyName) === "Object") {
            for (var prop in propertyName) {
                if (propertyName.hasOwnProperty(prop)) {
                    this.set(prop, propertyName[prop]);
                }
            }
            return this;
        }

        var currentValue = this.data[propertyName];

        if (!this.equals(currentValue, value)) {
            this.data[propertyName] = value;
            this.dispatchChange(propertyName, value, currentValue);
        }
        return this;
    };

    /**
     * Fires notifications about value changes. This method is used internally by {@link Izi.model.Model#set} method.
     * Firstly is fired event `"change"` and after that is fired event with name corresponding to `propertyName`.
     * For example for `dispatchChange("firstName")` will be fired two events: `"change"` and `"firstNameChange"`.
     *
     * @fires change
     * @fires propertyNameChange
     * @param {String} propertyName
     * @param {*} [newValue]
     * @param {*} [oldValue]
     */
    Model.prototype.dispatchChange = function (propertyName, newValue, oldValue) {
        this.dispatchEvent(propertyName + "Change", [newValue, oldValue]);
        this.dispatchEvent("change", [propertyName, newValue, oldValue]);
    };

    /**
     * Method used to detect if new value that is pretended to be set is different to the old one. Override
     * this method if you want to use custom equals function.
     *
     * @param {*} val1
     * @param {*} val2
     * @returns {Boolean}
     */
    Model.prototype.equals = function (val1, val2) {
        if (module.utils.typeOf(val1) === "Array" && module.utils.typeOf(val2) === "Array") {
            return this.equalsArray(val1, val2);
        }

        return val1 === val2;
    };

    /**
     * This method is used in default {@link Izi.model.Model#equals} method.
     *
     * @param arr1
     * @param arr2
     * @returns {boolean}
     */
    Model.prototype.equalsArray = function (arr1, arr2) {
        if (arr1.length !== arr2.length) {
            return false;
        }

        for (var i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }

        return true;
    };

    Model.prototype.iziObserveProperty = function (property, propertyChangeCallback) {
        var me = this,
            propertyChangeEvent = property + "Change";

        me.addListener(propertyChangeEvent, propertyChangeCallback);
        return function () {
            me.removeListener(propertyChangeEvent, propertyChangeCallback);
        }
    };

    Model.prototype.iziObserveWidget = function (eventConfig, action, scope, eventOptions) {
        var me = this,
            eventType = eventConfig.getEventType();

        me.addListener(eventType, action, scope);
        return function () {
            me.removeListener(eventType, action);
        }
    };

    /**
     * Exports all declared fields in `field: []` section using short getters like `firstName()`.
     *
     *     var User = izi.modelOf({
     *         fields: ["firstName", "lastName"]
     *     });
     *
     *     var john = new User().firstName("John").lastName("Smith");
     *     john.toPlainObject(); // {firstName: "John", lastName: "Smith"}
     *
     * When field value is an Array, then it will be converted to array of values. If any field or array item has
     * `.toPlainObject()` method, then it will be called to get result.
     *
     * Circular references between models are resolved as circular references between plain objects.
     *
     *     var TreeItem = izi.modelOf({
     *         fields: ["children", "parent"]
     *     });
     *
     *     var root = new TreeItem();
     *     var child1 = new TreeItem().parent(root);
     *     var child2 = new TreeItem().parent(root);
     *     root.children([child1, child2]);
     *
     *     root.toPlainObject(); // {children: [{parent: *refToRoot*},
     *                           //             {parent: *refToRoot*}] }
     *
     * If you have custom getter which is not declared in `fields` section you may override toPlainObject method:
     *
     *     var User = izi.modelOf({
     *         fields: ["firstName", "lastName"],
     *
     *         getFullName: function () {
     *             return this.firstName() + " " + this.lastName();
     *         },
     *
     *         toPlainObject: function () {
     *
     *             // call original implementation that converts firstName and lastName
     *             var plainObject = User.upper.toPlainObject.call(this);
     *
     *             // add your custom getters here
     *             plainObject.fullName = this.getFullName();
     *
     *             return plainObject;
     *         }
     *     });
     *
     *     var john = new User().firstName("John").lastName("Smith");
     *     john.toPlainObject(); // {firstName: "John", lastName: "Smith", fullName: "John Smith"}
     *
     * @returns {Object}
     * @since 1.5.0
     */
    Model.prototype.toPlainObject = function () {
        var result = {},
            arrayResult,
            circularCopyProp = "__iziCircularCopy__",
            wasVisited = circularCopyProp in this,
            cache = this[circularCopyProp];

        if (wasVisited) {
            return cache();
        }

        this[circularCopyProp] = function () {
            return result;
        };

        forEach(this.fields, function (field) {
            var value = this[field.getter]();

            if (hasToPlainObjectMethod(value)) {
                result[field.name] = value.toPlainObject();
            } else if (module.utils.typeOf(value) === "Array") {
                arrayResult = [];
                forEach(value, function (item) {
                    if (hasToPlainObjectMethod(item)) {
                        arrayResult.push(item.toPlainObject());
                    } else {
                        arrayResult.push(item);
                    }
                });
                result[field.name] = arrayResult;
            } else if (value && module.utils.typeOf(value.forEach) === "Function") {
                arrayResult = [];
                value.forEach(function (item) {
                    if (hasToPlainObjectMethod(item)) {
                        arrayResult.push(item.toPlainObject());
                    } else {
                        arrayResult.push(item);
                    }
                });
                result[field.name] = arrayResult;
            } else {
                result[field.name] = value;
            }
        }, this);

        delete this[circularCopyProp];
        return result;
    };

    /**
     * @private
     * @param config
     * @return {Function}
     */
    Model.define = function (config) {

        var fields = normalizeFields(config.fields),
            Class = function () {
                this.data = createInitialData(fields);
                this.fields = fields;
                Class.upper.constructor.apply(this);
            };
        module.utils.inherit(Class, Model);

        forEach(fields, function (field) {
            implementGetterAndSetter(Class, field.name, field.getter, field.setter);
        });

        for (var key in config) {
            if (module.utils.hasOwnProperty(config, key) && key != 'fields') {
                Class.prototype[key] = config[key];
            }
        }

        return Class;
    };


    module.model.Model = Model;

    /**
     * @event propertyNameChange
     * Fired when new value of property `"propertyName"` has been already set. Each property fires its own event so you should
     * register listener of `firstName` property using following code: `model.addListener("firstNameChange", handler)`
     *
     * @param {*} newValue new value
     * @param {*} oldValue current value
     */

    /**
     * @event change
     * Fired when new value of property has been already set.
     * @param {String} property property name that its value has changed
     * @param {*} newValue current value
     * @param {*} oldValue previous value
     */

    /** @ignore function: () { */
}(Izi);

/**
 * @requires EventConfig.js
 */
!function (module) {

    /**
     * @class Izi.events.KeyboardConfig
     * @extends Izi.events.EventConfig
     * @constructor
     * @private
     * @param {String} eventType
     */
    var KeyboardConfig = function Izi_events_KeyboardConfig(eventType) {
        module.events.EventConfig.apply(this, arguments);
        this.expectedKeyCode = 0;
    };
    KeyboardConfig.prototype = new module.events.EventConfig();
    KeyboardConfig.prototype.constructor = KeyboardConfig;

    /**
     * @member Izi.events.KeyboardConfig
     * @private
     * @type {Boolean}
     */
    KeyboardConfig.prototype.isKeyboardEventConfig = true;

    /**
     * Setup custom expected keyCode. Use it only when you can't find desired key in methods below:
     * <code>izi.events.keyDown().ENTER()</code> etc.
     * @member Izi.events.KeyboardConfig
     * @param {Number} value
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.keyCode = function (value) {
        this.expectedKeyCode = value;
        return this;
    };

    /**
     * Returns expected key code
     * @member Izi.events.KeyboardConfig
     * @private
     * @return {Number}
     */
    KeyboardConfig.prototype.getExpectedKeyCode = function () {
        return this.expectedKeyCode;
    };

    /**
     * Setup BACKSPACE key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.BACKSPACE = function () {
        return this.keyCode(8);
    };
    
    /**
     * Setup TAB key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.TAB = function () {
        return this.keyCode(9);
    };
    
    /**
     * Setup NUM_CENTER key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.NUM_CENTER = function () {
        return this.keyCode(12);
    };

    /**
     * Setup ENTER key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.ENTER = function () {
        return this.keyCode(13);
    };
    
    /**
     * Setup RETURN key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.RETURN = function () {
        return this.keyCode(13);
    };
    
    /**
     * Setup SHIFT key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.SHIFT = function () {
        this.shift(); // If you press SHIFT key - event modifier will be set to true, so we need to also expect that.
        return this.keyCode(16);
    };
    
    /**
     * Setup CTRL key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.CTRL = function () {
        this.ctrl(); // If you press CTRL key - event modifier will be set to true, so we need to also expect that.
        return this.keyCode(17);
    };
    
    /**
     * Setup ALT key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.ALT = function () {
        this.alt(); // If you press ALT key - event modifier will be set to true, so we need to also expect that.
        return this.keyCode(18);
    };
    
    /**
     * Setup PAUSE key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.PAUSE = function () {
        return this.keyCode(19);
    };
    
    /**
     * Setup CAPS_LOCK key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.CAPS_LOCK = function () {
        return this.keyCode(20);
    };
    
    /**
     * Setup ESC key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.ESC = function () {
        return this.keyCode(27);
    };
    
    /**
     * Setup SPACE key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.SPACE = function () {
        return this.keyCode(32);
    };
    
    /**
     * Setup PAGE_UP key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.PAGE_UP = function () {
        return this.keyCode(33);
    };
    
    /**
     * Setup PAGE_DOWN key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.PAGE_DOWN = function () {
        return this.keyCode(34);
    };
    
    /**
     * Setup END key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.END = function () {
        return this.keyCode(35);
    };
    
    /**
     * Setup HOME key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.HOME = function () {
        return this.keyCode(36);
    };
    
    /**
     * Setup LEFT key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.LEFT = function () {
        return this.keyCode(37);
    };
    
    /**
     * Setup UP key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.UP = function () {
        return this.keyCode(38);
    };
    
    /**
     * Setup RIGHT key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.RIGHT = function () {
        return this.keyCode(39);
    };
    
    /**
     * Setup DOWN key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.DOWN = function () {
        return this.keyCode(40);
    };
    
    /**
     * Setup PRINT_SCREEN key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.PRINT_SCREEN = function () {
        return this.keyCode(44);
    };
    
    /**
     * Setup INSERT key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.INSERT = function () {
        return this.keyCode(45);
    };
                                                                //
    /**
     * Setup DELETE key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.DELETE = function () {
        return this.keyCode(46);
    };
    
    /**
     * Setup ZERO key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.ZERO = function () {
        return this.keyCode(48);
    };
    
    /**
     * Setup ONE key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.ONE = function () {
        return this.keyCode(49);
    };
    
    /**
     * Setup TWO key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.TWO = function () {
        return this.keyCode(50);
    };
    
    /**
     * Setup THREE key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.THREE = function () {
        return this.keyCode(51);
    };
    
    /**
     * Setup FOUR key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.FOUR = function () {
        return this.keyCode(52);
    };
    
    /**
     * Setup FIVE key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.FIVE = function () {
        return this.keyCode(53);
    };
    
    /**
     * Setup SIX key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.SIX = function () {
        return this.keyCode(54);
    };
    
    /**
     * Setup SEVEN key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.SEVEN = function () {
        return this.keyCode(55);
    };
    
    /**
     * Setup EIGHT key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.EIGHT = function () {
        return this.keyCode(56);
    };
    
    /**
     * Setup NINE key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.NINE = function () {
        return this.keyCode(57);
    };

    /**
     * Setup A key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.A = function () {
        return this.keyCode(65);
    };

    /**
     * Setup B key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.B = function () {
        return this.keyCode(66);
    };

    /**
     * Setup C key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.C = function () {
        return this.keyCode(67);
    };

    /**
     * Setup D key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.D = function () {
        return this.keyCode(68);
    };

    /**
     * Setup E key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.E = function () {
        return this.keyCode(69);
    };

    /**
     * Setup F key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.F = function () {
        return this.keyCode(70);
    };

    /**
     * Setup G key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.G = function () {
        return this.keyCode(71);
    };

    /**
     * Setup H key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.H = function () {
        return this.keyCode(72);
    };

    /**
     * Setup I key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.I = function () {
        return this.keyCode(73);
    };

    /**
     * Setup J key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.J = function () {
        return this.keyCode(74);
    };

    /**
     * Setup K key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.K = function () {
        return this.keyCode(75);
    };

    /**
     * Setup L key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.L = function () {
        return this.keyCode(76);
    };

    /**
     * Setup M key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.M = function () {
        return this.keyCode(77);
    };

    /**
     * Setup N key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.N = function () {
        return this.keyCode(78);
    };

    /**
     * Setup O key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.O = function () {
        return this.keyCode(79);
    };

    /**
     * Setup P key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.P = function () {
        return this.keyCode(80);
    };

    /**
     * Setup Q key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.Q = function () {
        return this.keyCode(81);
    };

    /**
     * Setup R key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.R = function () {
        return this.keyCode(82);
    };

    /**
     * Setup S key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.S = function () {
        return this.keyCode(83);
    };

    /**
     * Setup T key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.T = function () {
        return this.keyCode(84);
    };

    /**
     * Setup U key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.U = function () {
        return this.keyCode(85);
    };

    /**
     * Setup V key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.V = function () {
        return this.keyCode(86);
    };

    /**
     * Setup W key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.W = function () {
        return this.keyCode(87);
    };

    /**
     * Setup X key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.X = function () {
        return this.keyCode(88);
    };

    /**
     * Setup Y key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.Y = function () {
        return this.keyCode(89);
    };

    /**
     * Setup Z key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.Z = function () {
        return this.keyCode(90);
    };

    /**
     * Setup NUM_ZERO key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.NUM_ZERO = function () {
        return this.keyCode(96);
    };

    /**
     * Setup NUM_ONE key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.NUM_ONE = function () {
        return this.keyCode(97);
    };

    /**
     * Setup NUM_TWO key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.NUM_TWO = function () {
        return this.keyCode(98);
    };

    /**
     * Setup NUM_THREE key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.NUM_THREE = function () {
        return this.keyCode(99);
    };

    /**
     * Setup NUM_FOUR key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.NUM_FOUR = function () {
        return this.keyCode(100);
    };

    /**
     * Setup NUM_FIVE key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.NUM_FIVE = function () {
        return this.keyCode(101);
    };

    /**
     * Setup NUM_SIX key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.NUM_SIX = function () {
        return this.keyCode(102);
    };

    /**
     * Setup NUM_SEVEN key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.NUM_SEVEN = function () {
        return this.keyCode(103);
    };

    /**
     * Setup NUM_EIGHT key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.NUM_EIGHT = function () {
        return this.keyCode(104);
    };

    /**
     * Setup NUM_NINE key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.NUM_NINE = function () {
        return this.keyCode(105);
    };

    /**
     * Setup NUM_MULTIPLY key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.NUM_MULTIPLY = function () {
        return this.keyCode(106);
    };

    /**
     * Setup NUM_PLUS key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.NUM_PLUS = function () {
        return this.keyCode(107);
    };

    /**
     * Setup NUM_MINUS key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.NUM_MINUS = function () {
        return this.keyCode(109);
    };

    /**
     * Setup NUM_PERIOD key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.NUM_PERIOD = function () {
        return this.keyCode(110);
    };

    /**
     * Setup NUM_DIVISION key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.NUM_DIVISION = function () {
        return this.keyCode(111);
    };

    /**
     * Setup F1 key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.F1 = function () {
        return this.keyCode(112);
    };

    /**
     * Setup F2 key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.F2 = function () {
        return this.keyCode(113);
    };

    /**
     * Setup F3 key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.F3 = function () {
        return this.keyCode(114);
    };

    /**
     * Setup F4 key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.F4 = function () {
        return this.keyCode(115);
    };

    /**
     * Setup F5 key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.F5 = function () {
        return this.keyCode(116);
    };

    /**
     * Setup F6 key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.F6 = function () {
        return this.keyCode(117);
    };

    /**
     * Setup F7 key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.F7 = function () {
        return this.keyCode(118);
    };

    /**
     * Setup F8 key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.F8 = function () {
        return this.keyCode(119);
    };

    /**
     * Setup F9 key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.F9 = function () {
        return this.keyCode(120);
    };

    /**
     * Setup F10 key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.F10 = function () {
        return this.keyCode(121);
    };

    /**
     * Setup F11 key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.F11 = function () {
        return this.keyCode(122);
    };

    /**
     * Setup F12 key as expected to be pressed
     * @member Izi.events.KeyboardConfig
     * @method
     * @return {Izi.events.KeyboardConfig}
     */
    KeyboardConfig.prototype.F12 = function () {
        return this.keyCode(123);
    };

    module.events.KeyboardConfig = KeyboardConfig;
}(Izi);
/**
 * @requires EventConfig.js
 * @requires KeyboardConfig.js
 */
!function (module) {

    /**
     * <code>izi.events.*</code> fluent API entry points. You can use them to define izi behaviors based on more complex events, like:
     *
     *      izi.perform(behavior).when(izi.events.click().shift()).on(button);
     *
     *      izi.perform(behavior).when(izi.events.keyDown().ENTER()).on(textInput);
     *
     *      izi.perform(behavior).when(izi.events.keyDown().F5().preventDefault()).on(document);
     *
     *      izi.perform(behavior).when(izi.events.keyDown().ctrl().alt().ONE()).on(document);
     *
     * @class Izi.events.Events
     */
    var Events = function Izi_events_Events() {
    };

    /**
     * Creates fluent builder for desired event type. If you need to watch keyboard events, please use
     * <code>izi.events.keyDown()</code> or <code>izi.events.keyUp()</code> or <code>izi.events.keyboardEvent('keypress')</code>
     * @member Izi.events.Events
     * @param {String} eventType
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.event = function (eventType) {
        return new module.events.EventConfig(eventType);
    };

    /**
     * Creates fluent builder. It is recommended to use only
     * <code>izi.events.keyDown()</code> or <code>izi.events.keyUp()</code>, because of not cross browsers
     * compatibility of "keyPress" event.
     * @member Izi.events.Events
     * @param {String} eventType
     * @return {Izi.events.KeyboardConfig}
     */
    Events.prototype.keyboardEvent = function (eventType) {
        return new module.events.KeyboardConfig(eventType);
    };

    // -------------------- Keyboard -----------------

    /**
     * Creates fluent builder for keyboard "keydown" event.
     * @member Izi.events.Events
     * @return {Izi.events.KeyboardConfig}
     */
    Events.prototype.keyDown = function () {
        return this.keyboardEvent('keydown');
    };

    /**
     * Creates fluent builder for keyboard "keyup" event.
     * @member Izi.events.Events
     * @return {Izi.events.KeyboardConfig}
     */
    Events.prototype.keyUp = function () {
        return this.keyboardEvent('keyup');
    };

    // -------------------- HTML Window -----------------

    /**
     * Creates fluent builder for html window "afterprint" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.afterPrint = function () {
        return this.event('afterprint');
    };

    /**
     * Creates fluent builder for html window "beforeprint" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.beforePrint = function () {
        return this.event('beforeprint');
    };

    /**
     * Creates fluent builder for html window "beforeonload" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.beforeOnLoad = function () {
        return this.event('beforeonload');
    };

    /**
     * Creates fluent builder for html window "error" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.error = function () {
        return this.event('error');
    };

    /**
     * Creates fluent builder for html window "haschange" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.hasChange = function () {
        return this.event('haschange');
    };

    /**
     * Creates fluent builder for html window "load" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.load = function () {
        return this.event('load');
    };

    /**
     * Creates fluent builder for html window "message" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.message = function () {
        return this.event('message');
    };

    /**
     * Creates fluent builder for html window "offline" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.offline = function () {
        return this.event('offline');
    };

    /**
     * Creates fluent builder for html window "line" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.line = function () {
        return this.event('line');
    };

    /**
     * Creates fluent builder for html window "pagehide" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.pageHide = function () {
        return this.event('pagehide');
    };

    /**
     * Creates fluent builder for html window "pageshow" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.pageShow = function () {
        return this.event('pageshow');
    };

    /**
     * Creates fluent builder for html window "popstate" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.popState = function () {
        return this.event('popstate');
    };

    /**
     * Creates fluent builder for html window "redo" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.redo = function () {
        return this.event('redo');
    };

    /**
     * Creates fluent builder for html window "resize" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.resize = function () {
        return this.event('resize');
    };

    /**
     * Creates fluent builder for html window "storage" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.storage = function () {
        return this.event('storage');
    };

    /**
     * Creates fluent builder for html window "undo" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.undo = function () {
        return this.event('undo');
    };

    /**
     * Creates fluent builder for html window "unload" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.unload = function () {
        return this.event('unload');
    };

    // -------------------- Form element -----------------

    /**
     * Creates fluent builder for form element "blur" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.blur = function () {
        return this.event('blur');
    };

    /**
     * Creates fluent builder for form element "change" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.change = function () {
        return this.event('change');
    };

    /**
     * Creates fluent builder for form element "contextmenu" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.contextMenu = function () {
        return this.event('contextmenu');
    };

    /**
     * Creates fluent builder for form element "focus" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.focus = function () {
        return this.event('focus');
    };

    /**
     * Creates fluent builder for form element "formchange" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.formChange = function () {
        return this.event('formchange');
    };

    /**
     * Creates fluent builder for form element "forminput" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.formInput = function () {
        return this.event('forminput');
    };

    /**
     * Creates fluent builder for form element "input" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.input = function () {
        return this.event('input');
    };

    /**
     * Creates fluent builder for form element "invalid" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.invalid = function () {
        return this.event('invalid');
    };

    /**
     * Creates fluent builder for form element "reset" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.reset = function () {
        return this.event('reset');
    };

    /**
     * Creates fluent builder for form element "select" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.select = function () {
        return this.event('select');
    };

    /**
     * Creates fluent builder for form element "submit" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.submit = function () {
        return this.event('submit');
    };

    // -------------------- Mouse -----------------

    /**
     * Creates fluent builder for mouse "click" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.click = function () {
        return this.event('click');
    };

    /**
     * Creates fluent builder for mouse "dblclick" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.dblClick = function () {
        return this.event('dblclick');
    };

    /**
     * Creates fluent builder for mouse "drag" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.drag = function () {
        return this.event('drag');
    };

    /**
     * Creates fluent builder for mouse "dragend" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.dragEnd = function () {
        return this.event('dragend');
    };

    /**
     * Creates fluent builder for mouse "dragenter" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.dragEnter = function () {
        return this.event('dragenter');
    };

    /**
     * Creates fluent builder for mouse "dragleave" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.dragLeave = function () {
        return this.event('dragleave');
    };

    /**
     * Creates fluent builder for mouse "dragover" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.dragOver = function () {
        return this.event('dragover');
    };

    /**
     * Creates fluent builder for mouse "dragstart" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.dragStart = function () {
        return this.event('dragstart');
    };

    /**
     * Creates fluent builder for mouse "drop" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.drop = function () {
        return this.event('drop');
    };

    /**
     * Creates fluent builder for mouse "mousedown" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.mouseDown = function () {
        return this.event('mousedown');
    };

    /**
     * Creates fluent builder for mouse "mousemove" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.mouseMove = function () {
        return this.event('mousemove');
    };

    /**
     * Creates fluent builder for mouse "mouseout" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.mouseOut = function () {
        return this.event('mouseout');
    };

    /**
     * Creates fluent builder for mouse "mouseover" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.mouseOver = function () {
        return this.event('mouseover');
    };

    /**
     * Creates fluent builder for mouse "mouseup" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.mouseUp = function () {
        return this.event('mouseup');
    };

    /**
     * Creates fluent builder for mouse "mousewheel" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.mouseWheel = function () {
        return this.event('mousewheel');
    };

    /**
     * Creates fluent builder for mouse "scroll" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.scroll = function () {
        return this.event('scroll');
    };

    // -------------------- Media -----------------

    /**
     * Creates fluent builder for media "abort" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.abort = function () {
        return this.event('abort');
    };

    /**
     * Creates fluent builder for media "canplay" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.canPlay = function () {
        return this.event('canplay');
    };

    /**
     * Creates fluent builder for media "canplaythrough" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.canPlayThrough = function () {
        return this.event('canplaythrough');
    };

    /**
     * Creates fluent builder for media "durationchange" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.durationChange = function () {
        return this.event('durationchange');
    };

    /**
     * Creates fluent builder for media "emptied" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.emptied = function () {
        return this.event('emptied');
    };

    /**
     * Creates fluent builder for media "ended" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.ended = function () {
        return this.event('ended');
    };

    /**
     * Creates fluent builder for media "loadeddata" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.loadedData = function () {
        return this.event('loadeddata');
    };

    /**
     * Creates fluent builder for media "loadedmetadata" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.loadedMetaData = function () {
        return this.event('loadedmetadata');
    };

    /**
     * Creates fluent builder for media "loadstart" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.loadStart = function () {
        return this.event('loadstart');
    };

    /**
     * Creates fluent builder for media "pause" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.pause = function () {
        return this.event('pause');
    };

    /**
     * Creates fluent builder for media "play" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.play = function () {
        return this.event('play');
    };

    /**
     * Creates fluent builder for media "playing" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.playing = function () {
        return this.event('playing');
    };

    /**
     * Creates fluent builder for media "progress" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.progress = function () {
        return this.event('progress');
    };

    /**
     * Creates fluent builder for media "ratechange" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.rateChange = function () {
        return this.event('ratechange');
    };

    /**
     * Creates fluent builder for media "readystatechange" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.readyStateChange = function () {
        return this.event('readystatechange');
    };

    /**
     * Creates fluent builder for media "seeked" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.seeked = function () {
        return this.event('seeked');
    };

    /**
     * Creates fluent builder for media "seeking" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.seeking = function () {
        return this.event('seeking');
    };

    /**
     * Creates fluent builder for media "stalled" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.stalled = function () {
        return this.event('stalled');
    };

    /**
     * Creates fluent builder for media "suspend" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.suspend = function () {
        return this.event('suspend');
    };

    /**
     * Creates fluent builder for media "timeupdate" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.timeUpdate = function () {
        return this.event('timeupdate');
    };

    /**
     * Creates fluent builder for media "volumechange" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.volumeChange = function () {
        return this.event('volumechange');
    };

    /**
     * Creates fluent builder for media "waiting" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.waiting = function () {
        return this.event('waiting');
    };

    // -------------------- Mobile -----------------

    /**
     * Creates fluent builder for mobile "touchstart" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.touchStart = function () {
        return this.event('touchstart');
    };

    /**
     * Creates fluent builder for mobile "touchmove" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.touchMove = function () {
        return this.event('touchmove');
    };

    /**
     * Creates fluent builder for mobile "touchend" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.touchEnd = function () {
        return this.event('touchend');
    };

    /**
     * Creates fluent builder for mobile "touchcancel" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.touchCancel = function () {
        return this.event('touchcancel');
    };

    /**
     * Creates fluent builder for mobile "touchenter" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.touchEnter = function () {
        return this.event('touchenter');
    };

    /**
     * Creates fluent builder for mobile "touchlave" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.touchLave = function () {
        return this.event('touchlave');
    };

    /**
     * Creates fluent builder for mobile "gesturestart" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.gestureStart = function () {
        return this.event('gesturestart');
    };

    /**
     * Creates fluent builder for mobile "gesturechange" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.gestureChange = function () {
        return this.event('gesturechange');
    };

    /**
     * Creates fluent builder for mobile "gestureend" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.gestureEnd = function () {
        return this.event('gestureend');
    };

    /**
     * Creates fluent builder for mobile "orientationchange" event.
     * @member Izi.events.Events
     * @return {Izi.events.EventConfig}
     */
    Events.prototype.orientationChange = function () {
        return this.event('orientationchange');
    };

    module.events.Events = Events;

}(Izi);
/**
 * @requires debug.js
 * @requires behavior/register.js
 * @requires binding/register.js
 * @requires queue/register.js
 * @requires utils/typeOf.js
 * @requires utils/forEach.js
 * @requires utils/arrayContains.js
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
        return izi;
    }
    if (typeof define === "function" && typeof define.amd === "object" && define.amd.vendor !== "dojotoolkit.org") {
        define([], amdFactory);
    } else if (typeof exports === 'object') {
        module.exports = amdFactory();
    } else {
        global.izi = amdFactory();
    }
})(this);
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
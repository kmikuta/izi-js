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
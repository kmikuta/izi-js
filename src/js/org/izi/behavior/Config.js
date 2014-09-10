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
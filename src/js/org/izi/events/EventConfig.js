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
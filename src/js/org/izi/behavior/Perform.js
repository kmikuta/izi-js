/**
 * @ignore
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
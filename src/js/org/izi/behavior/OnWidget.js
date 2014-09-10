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
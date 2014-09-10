function registerObservableBehaviorImpl() {

    var impl = {
        defaultPerformFunction: "perform",

        observeWidget: function (widget, eventConfig, action, scope, options) {
            var eventType = eventConfig.getEventType();
            widget.addListener(eventType, action, scope);

            return function () {
                widget.removeListener(eventType, action);
            }
        },

        observeKeyStroke: function () {

        }
    };

    izi.registerBehaviorImpl(impl);
}

function registerQueueImpl() {

    var impl = {
        createEventDispatcher: function () {
            return new izi.module.model.Observable();
        },

        dispatchEvent: function (dispatcher, eventType, eventParameters) {
            dispatcher.dispatchEvent(eventType, [eventParameters]);
        }
    };

    izi.registerQueueImpl(impl);
}
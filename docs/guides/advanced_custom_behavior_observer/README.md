Custom observations of behaviors
================================

izi has some limitations for using `izi.perform(behavior).when('event').on(target)` because each javascript library
has own implementation of handling events. If you use for example **izi-jquery** implementation and you need to
use behavior syntax for `target` different than instance of `$("selector")` you may extend your `target` object with
`iziObserveWidget()` or `iziObserveKeyStroke()` methods.

    /**
     * @param {Izi.events.EventConfig} eventConfig
     * @param {Function} action
     * @param {Object} scope
     * @param {Object} [eventOptions]
     * @returns {Function}
     */
    SomeStrangeEventDispatcher.prototype.iziObserveWidget = function (eventConfig, action, scope, eventOptions) {

        var event = eventConfig.getEventType(); // "anyEvent"

        this.addStrangeListener(event, action, scope);

        return function () {

            this.removeStrangeListener(event, action, scope);
        }
    }

    var strangeTarget = new SomeStrangeEventDispatcher();

    izi.perform(behavior).when("anyEvent").on(strangeTarget);

If you want to handle keystrokes events you should implement method `iziObserveKeyStroke()`:

    /**
     * @param {Izi.events.KeyboardConfig} eventConfig
     * @param {Function} action
     * @param {Object} scope
     * @param {Object} [eventOptions]
     * @returns {Function}
     */
    SomeStrangeEventDispatcher.prototype.iziObserveKeyStroke = function (eventConfig, action, scope, eventOptions) {

        var event = eventConfig.getEventType();         // "keydown"
        var keyCode = eventConfig.getExpectedKeyCode(); // 13

        this.addStrangeListener(event, action, scope);

        return function () {

            this.removeStrangeListener(event, action, scope);
        }
    }

    var strangeTarget = new SomeStrangeEventDispatcher();

    izi.perform(behavior).when(izi.events.keyDown().ENTER()).on(strangeTarget);


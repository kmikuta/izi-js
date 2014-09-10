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
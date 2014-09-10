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
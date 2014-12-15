/**
 * @ignore
 * @requires ../utils/curry.js
 */
!function (module) {
    var curry = module.utils.curry;

    /**
     * @class Izi.queue.TimeoutGuard
     * @private
     * @constructor
     * @param {Izi.queue.Queue} queue
     */
    var TimeoutGuard = function Izi_queue_TimeoutGuard(queue) {
        this.queue = queue;
        queue.onTaskStarted(this.startCountDown, this);
        queue.onTaskFinished(this.stopCountDown, this);
    };

    /**
     * @member Izi.queue.TimeoutGuard
     * @private
     * @param event
     */
    TimeoutGuard.prototype.startCountDown = function (event) {
        var timeout = this.queue.timeoutForTask(event.task);
        if (timeout > 0) {
            this.timeoutId = setTimeout(curry(this.timeoutTask, this), timeout);
        }
    };

    /**
     * @member Izi.queue.TimeoutGuard
     * @private
     */
    TimeoutGuard.prototype.timeoutTask = function () {
        this.queue.currentTaskTimeouted();
    };

    /**
     * @member Izi.queue.TimeoutGuard
     * @private
     */
    TimeoutGuard.prototype.stopCountDown = function () {
        clearTimeout(this.timeoutId);
    };

    module.queue.TimeoutGuard = TimeoutGuard;
}(Izi);
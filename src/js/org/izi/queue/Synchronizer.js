/**
 * @ignore
 * @requires ../utils/Map.js
 * @requires ../utils/curry.js
 * @requires ../utils/forEach.js
 * @requires SynchronizedFunction.js
 * @requires SynchronizedOnEvent.js
 * @requires SynchronizedResponder.js
 */
!function (module) {

    /**
     * Synchronizer is a utility that allows you to synchronize current task in the easiest way. Instance of this
     * class is available as first argument of `execute()` method when the task is defined as an `Object` or directly
     * as first argument of function, when the task is defined as a `Function`:
     *
     *     var task1 = {
     *             execute: function (synchronize) {
     *                 // synchronize.onCallback(...)
     *                 // synchronize.onEvent(...)
     *                 // synchronize.responder(...)
     *             }
     *         },
     *         task2 = function (synchronize) {
     *             // synchronize.onCallback(...)
     *             // synchronize.onEvent(...)
     *             // synchronize.responder(...)
     *         }
     *     };
     *     izi.queue().execute(task1, task2);
     *
     * When one of:
     *
     *  * {@link Izi.queue.Synchronizer#onCallback synchronize.onCallback}
     *  * {@link Izi.queue.Synchronizer#onEvent synchronize.onEvent}
     *  * {@link Izi.queue.Synchronizer#responder synchronize.responder}
     *
     * is called, it informs the queue that this task calls some asynchronous code, so queue should wait until all asynchronous callbacks
     * return. There may be synchronized more than one asynchronous code - the queue will be waiting for all of them.
     *
     * There is also available access to queue.cancel() method directly in synchronizer:
     *
     *     var task1 = {
     *         execute: function (synchronize) {
     *             // store handler of cancelQueue for later execution
     *             this.cancelQueue = synchronize.cancelQueue;
     *
     *             setTimeout(synchronize.onCallback(this.doOnCallback, this), 1000);
     *         },
     *
     *         doOnCallback: function () {
     *             if (someCondition) {
     *                 this.cancelQueue();
     *             }
     *         }
     *     }
     *
     *
     * @since 1.2.0
     * @class Izi.queue.Synchronizer
     * @constructor
     * @private
     * @param {Izi.queue.Queue} queue
     */
    var Synchronizer = function org_izi_queue_Synchronizer(queue) {
        this.queue = queue;
        this.synchronizations = new module.utils.Map();
        this.awaitedTasks = new module.utils.Map();

        /**
         * Delegates to queue.cancel()
         * @member Izi.queue.Synchronizer
         */
        this.cancelQueue = function () {
            queue.cancel();
        }
    };

    /**
     * Synchronizes the queue after `nonSynchronized` callback will be called by external caller. This method returns
     * a closure which executes first `nonSynchronized` function and after that notifies the queue to execute next task.
     * If `nonSynchronized` is not given, then queue will just execute next task when callback triggers.
     *
     * Example 1 - just synchronize on callback
     *
     *     var task1 = {
     *         execute: function(synchronize) {
     *             // when setTimeout() callback triggers after 1000ms, then queue will execute `task2`
     *             setTimeout(synchronize.onCallback(), 1000);
     *         }
     *     };
     *
     *     izi.queue().execute(task1, task2);
     *
     * Example 2 - synchronize on callback and execute some extra callback code
     *
     *     var task1 = {
     *         execute: function(synchronize) {
     *             setTimeout(synchronize.onCallback(this.doOnCallback, this), 1000);
     *         }
     *
     *         doOnCallback: function () {
     *             // do some extra code when callback called
     *             // after this code the queue will execute `task2`
     *         }
     *     };
     *
     *     izi.queue().execute(task1, task2);
     *
     * @since 1.2.0
     * @member Izi.queue.Synchronizer
     * @param {Function} [nonSynchronized]
     * @param {Object} [scope]
     * @return {Function}
     */
    Synchronizer.prototype.onCallback = function (nonSynchronized, scope) {
        var task = this.obtainTask(),
            synchronization = new module.queue.SynchronizedFunction(nonSynchronized, scope);

        this.recordSynchronization(synchronization, task);

        return module.utils.curry(synchronization.synchronizedFunction, synchronization);
    };

    /**
     * Synchronizes the queue when dispatcher will fire an event of given type
     *
     * Example - synchronize task when user clicks OK button
     *
     *     var task1 = {
     *         alertPopup: new AlertPopup(),
     *
     *         execute: function(synchronize) {
     *             synchronize.onEvent(this.alertPopup.okButton, izi.events.click());
     *         }
     *     };
     *
     *     izi.queue().execute(task1, task2);
     *
     * @since 1.2.0
     * @member Izi.queue.Synchronizer
     * @param {Object} dispatcher
     * @param {String...|Izi.events.EventConfig...} vararg of event types as String or `izi.events.*`
     */
    Synchronizer.prototype.onEvent = function (dispatcher, event) {
        var task = this.obtainTask(),
            synchronization = new module.queue.SynchronizedOnEvent(this.queue.iziApi, dispatcher, Array.prototype.slice.call(arguments, 1));
        this.recordSynchronization(synchronization, task);
    };

    /**
     * Synchronizes the queue when service triggers the responder either on `result()` or `error()` methods.
     * If you have reponder with methods different than `result()` or `error()`, then you can specify the custom ones.
     *
     * Example - synchronize task when any of `result()` or `error()` methods will be triggered
     *
     *     var task1 = {
     *
     *         execute: function(synchronize) {
     *             Ajax.request("/someUrl", someParameters, synchronize.responder(this));
     *         },
     *
     *         result: function (ajaxResponse) {
     *             // some code for handling Ajax response
     *             // after this code the queue will execute `task2`
     *         },
     *
     *         error: function (ajaxFailure) {
     *             // some code for handling Ajax error
     *             // after this code the queue will execute `task2`
     *         },
     *     };
     *
     *     izi.queue().execute(task1, task2);
     *
     * @since 1.2.0
     * @member Izi.queue.Synchronizer
     * @param {Object} responder
     * @param {String} [resultFunctionName="result"]
     * @param {String} [errorFunctionName="error"]
     * @return {*}
     */
    Synchronizer.prototype.responder = function (responder, resultFunctionName, errorFunctionName) {
        var task = this.obtainTask(),
            synchronization = new module.queue.SynchronizedResponder(responder, resultFunctionName, errorFunctionName);
        return this.recordSynchronization(synchronization, task).synchronizedResponder;
    };

    /**
     * @member Izi.queue.Synchronizer
     * @private
     * @param synchronization
     * @param task
     * @return {*}
     */
    Synchronizer.prototype.recordSynchronization = function (synchronization, task) {
        this.queue.log("        " + synchronization.logLabel + " was used by task: " + this.queue.getCurrentTaskIndex() + " of " + this.queue.countTasks());
        this.synchronizations.set(synchronization, task);
        synchronization.addListener("synchronized", this.removeSynchronization, this);
        return synchronization;
    };

    /**
     * @member Izi.queue.Synchronizer
     * @private
     * @param synchronization
     */
    Synchronizer.prototype.removeSynchronization = function (synchronization) {
        var task = this.synchronizations.get(synchronization);
        this.synchronizations.remove(synchronization);

        var pendingSynchronizationsOnTask = this.countSynchronizations(task);
        this.queue.log("        " + synchronization.logLabel + " completed by task: " + this.queue.getCurrentTaskIndex() + " of " + this.queue.countTasks());
        if (pendingSynchronizationsOnTask == 0)
            this.taskSynchronized(task);
    };

    /**
     * @member Izi.queue.Synchronizer
     * @private
     * @param task
     */
    Synchronizer.prototype.taskSynchronized = function (task) {
        var awaitedTasks = this.awaitedTasks;

        var proceedClosure = awaitedTasks.get(task);
        if (proceedClosure) {
            try {
                proceedClosure.fn.apply(proceedClosure.scope);
            }
            finally {
                awaitedTasks.remove(task);
            }
        }
    };

    /**
     * @member Izi.queue.Synchronizer
     * @private
     * @param task
     * @return {*}
     */
    Synchronizer.prototype.countSynchronizations = function (task) {
        return this.synchronizations.countValues(task);
    };

    /**
     * @member Izi.queue.Synchronizer
     * @private
     * @return {*}
     */
    Synchronizer.prototype.obtainTask = function () {
        var task = this.queue.currentTask;
        if (!task)
            throw new Error("There is no task executed. Please use izi.queue().execute(someTask) and use this method.");
        return task;
    };

    /**
     * @member Izi.queue.Synchronizer
     * @private
     * @return {boolean}
     */
    Synchronizer.prototype.hasPendingSynchronizations = function () {
        return !!this.synchronizations.count();
    };

    /**
     * @member Izi.queue.Synchronizer
     * @private
     * @param task
     * @param proceedClosure
     */
    Synchronizer.prototype.afterSynchronizingTaskCall = function (task, proceedClosure) {
        this.awaitedTasks.set(task, proceedClosure);
    };

    /**
     * @member Izi.queue.Synchronizer
     * @private
     * @param task
     */
    Synchronizer.prototype.taskTimeout = function (task) {
        var synchronizations = this.synchronizations,
            synchronizationsToRemove = synchronizations.getKeysOf(task);

        this.queue.log("    Time outed task: " + this.queue.getCurrentTaskIndex() + " of " + this.queue.countTasks());
        this.awaitedTasks.remove(task);

        module.utils.forEach(synchronizationsToRemove, function (synchronization) {
            synchronizations.remove(synchronization);
        });
    };

    module.queue.Synchronizer = Synchronizer;
}(Izi);
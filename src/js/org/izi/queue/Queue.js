/**
 * @requires ../utils/typeOf.js
 * @requires ../utils/mergeObjects.js
 * @requires ../utils/forEach.js
 * @requires ../utils/log.js
 * @requires TimeoutGuard.js
 * @requires Synchronizer.js
 * @requires GenericTask.js
 */
!function (module, global) {

    var typeOf = module.utils.typeOf,
        mergeObjects = module.utils.mergeObjects,
        forEach = module.utils.forEach,
        log = module.utils.log,
        queueUniqueId = 0;

    function formatTimeStamp() {
        var now = new Date();
        return padding(now.getHours(), 2) +
               ":" +
               padding(now.getMinutes(), 2) +
               ":" +
               padding(now.getSeconds(), 2) +
               "." +
               padding(now.getMilliseconds(), 3);
    }

    function padding(value, padding) {
        var number = "" + value;
        return new Array(padding - number.length + 1).join("0") + number;
    }

    /**
     * `izi.queue()` allows you to define and execute sequence of synchronous and asynchronous tasks. Task may be defined
     * as a `Function` or an `Object` with `execute()` function.
     *
     *     var taskAsFunction = function () {
     *         // some code of task
     *     }
     *
     *     var taskAsObject = {
     *         execute: function () {
     *             // some code of task
     *         }
     *     }
     *
     * Example - two equivalent ways for defining and running the queue:
     *
     *     izi.queue().execute(task1,
     *                         task2,
     *                         task3);
     *
     *     // is a shortcut of:
     *     izi.queue().push(task1,
     *                      task2,
     *                      task3).start();
     *
     * The second example allows you to define a queue once and run many times and also it allows to add event listeners
     * before starting the queue:
     *
     *     var queue = izi.queue().push(task1,
     *                                  task2,
     *                                  task3);
     *
     *     queue.onTaskStarted(doSomethingWhenTaskStarted);
     *     queue.onTaskFinished(doSomethingWhenTaskFinished);
     *
     *     queue.start();
     *
     * When the task executes some asynchronous code and the queue should wait until it finish - then we can say the task
     * is asynchronous and we need to notify somehow the queue to not execute next task immediately. This problem is
     * solved by usage of **{@link Izi.queue.Synchronizer synchronize}** argument passed to each task, like in example below:
     *
     *     var asynchronousTask = {
     *         execute: function (synchronize) {
     *             setTimeout(synchronize.onCallback(), 1000);
     *         }
     *     };
     *     var synchronousTask = {
     *         execute: function () {
     *             // do some synchronous code
     *         }
     *     }
     *
     *     izi.queue().execute(asynchronousTask,
     *                         synchronousTask);
     *
     * You can find more synchronization methods in {@link Izi.queue.Synchronizer} documentation
     *
     * @class Izi.queue.Queue
     * @since 1.2.0
     * @constructor
     * @private
     * @param {Object} impl framework queue implementation
     * @param {Object} config queue configuration
     * @param {izi} iziApi
     */
    var Queue = function Izi_queue_Queue(impl, config, iziApi) {
        var defaultConfig = {
            scope: global,
            defaultTimeout: 0,
            debug: undefined
        };

        this.config = mergeObjects(defaultConfig, config);
        this.iziApi = iziApi;
        this.queue = [];
        this.originalQueue = [];
        if (this.config.debug) {
            queueUniqueId++;
            this.id = this.config.debug + ":" + queueUniqueId;
        }

        this.delegatedIn = impl.createEventDispatcher();
        this.dispatchEvent = impl.dispatchEvent;

        this.synchronizer = new module.queue.Synchronizer(this);
        new module.queue.TimeoutGuard(this);
    };

    /**
     * Enqueue all given functions and tasks (object with execute function), and execute them sequentially
     *
     * @since 1.2.0
     * @member Izi.queue.Queue
     * @param {Function...|Object~execute()...} vararg of tasks or functions
     * @return {Izi.queue.Queue}
     */
    Queue.prototype.execute = function () {
        this.pushAll(arguments);
        this.start();
        return this;
    };

    /**
     * Enqueue all given functions and tasks (object with execute function)
     *
     * @since 1.2.0
     * @member Izi.queue.Queue
     * @param {Function...|Object~execute...} vararg of tasks or functions
     * @return {Izi.queue.Queue}
     */
    Queue.prototype.push = function () {
        this.pushAll(arguments);
        return this;
    };

    /**
     * Start executing tasks synchronously
     *
     * @since 1.2.0
     * @member Izi.queue.Queue
     * @return {Izi.queue.Queue}
     */
    Queue.prototype.start = function () {
        if (this.isExecutedTask()) {
            throw new Error("Can't start already started queue until it's finished");
        }

        this.queue = this.originalQueue.slice();
        this.log("Queue started. Total tasks to execute: " + this.countTasks());
        this.proceed();
        return this;
    };

    /**
     * Cancel executing tasks.
     *
     * @since 1.2.0
     * @member Izi.queue.Queue
     */
    Queue.prototype.cancel = function () {
        this.log("Queue canceled at executing task: " + this.getCurrentTaskIndex() + " of " + this.countTasks());
        this.dispatchTaskEvent("queueCanceled", true);
        this.queue = [];
        this.clearAndProceed();
    };

    /**
     * Add "taskStarted" event listener
     *
     * @since 1.2.0
     * @param {Function} fn
     * @param {Object} [scope]
     * @return {Izi.behavior.OnWidget}
     */
    Queue.prototype.onTaskStarted = function (fn, scope) {
        return this.iziApi.perform(fn, scope || global).when("taskStarted").on(this);
    };

    /**
     * Add "taskFinished" event listener
     *
     * @since 1.2.0
     * @param {Function} fn
     * @param {Object} [scope]
     * @return {Izi.behavior.OnWidget}
     */
    Queue.prototype.onTaskFinished = function (fn, scope) {
        return this.iziApi.perform(fn, scope || global).when("taskFinished").on(this);
    };

    /**
     * Add "taskTimeouted" event listener
     *
     * @since 1.2.0
     * @param {Function} fn
     * @param {Object} [scope]
     * @return {Izi.behavior.OnWidget}
     */
    Queue.prototype.onTaskTimeouted = function (fn, scope) {
        return this.iziApi.perform(fn, scope || global).when("taskTimeouted").on(this);
    };

    /**
     * Add "queueFinished" event listener
     *
     * @since 1.2.0
     * @param {Function} fn
     * @param {Object} [scope]
     * @return {Izi.behavior.OnWidget}
     */
    Queue.prototype.onQueueFinished = function (fn, scope) {
        return this.iziApi.perform(fn, scope || global).when("queueFinished").on(this);
    };

    /**
     * Add "queueCanceled" event listener
     *
     * @since 1.2.0
     * @param {Function} fn
     * @param {Object} [scope]
     * @return {Izi.behavior.OnWidget}
     */
    Queue.prototype.onQueueCanceled = function (fn, scope) {
        return this.iziApi.perform(fn, scope || global).when("queueCanceled").on(this);
    };

    /**
     * @member Izi.queue.Queue
     * @private
     * @param tasksOrFunctions
     */
    Queue.prototype.pushAll = function (tasksOrFunctions) {
        var me = this;

        forEach(tasksOrFunctions, function (taskOrFunction, index) {

            if (typeOf(taskOrFunction) === 'Function') {
                me.pushFunction(taskOrFunction);
            } else if (typeOf(taskOrFunction) === 'Object' && typeOf(taskOrFunction.execute) === 'Function') {
                me.pushTask(taskOrFunction);
            } else {
                throw new Error("Invalid queue element given at index: " + index + ". Expected Function or Object with execute() function.");
            }
        });
    };

    /**
     * @member Izi.queue.Queue
     * @private
     * @param task
     */
    Queue.prototype.pushTask = function (task) {
        this.originalQueue.push(task);
    };

    /**
     * @member Izi.queue.Queue
     * @private
     * @param fn
     */
    Queue.prototype.pushFunction = function (fn) {
        this.pushTask(new module.queue.GenericTask(fn, this.getScope()));
    };

    /**
     * @member Izi.queue.Queue
     * @private
     * @return {*}
     */
    Queue.prototype.getScope = function () {
        return this.config.scope;
    };

    /**
     * @member Izi.queue.Queue
     * @private
     */
    Queue.prototype.proceed = function () {
        if (this.isExecutedTask())
            return;

        if (this.isEmptyQueue()) {
            this.log("");
            this.log("Queue finished");
            this.dispatchTaskEvent("queueFinished");
            return;
        }

        this.executeSynchronously(this.queue.shift());
    };

    /**
     * @member Izi.queue.Queue
     * @private
     * @return {boolean}
     */
    Queue.prototype.isEmptyQueue = function () {
        return this.queue.length === 0
    };

    /**
     * @member Izi.queue.Queue
     * @private
     * @return {boolean}
     */
    Queue.prototype.isExecutedTask = function () {
        return !!this.currentTask;
    };

    /**
     * @member Izi.queue.Queue
     * @private
     * @param task
     */
    Queue.prototype.executeSynchronously = function (task) {
        this.currentTask = task;
        this.log("");
        this.log("    Task started: " + this.getCurrentTaskIndex() + " of " + this.countTasks());
        this.dispatchTaskEvent("taskStarted", true);
        task.execute(this.synchronizer);
        this.awaitSynchronizerOrProceed();
    };

    /**
     * @member Izi.queue.Queue
     * @private
     */
    Queue.prototype.awaitSynchronizerOrProceed = function () {
        if (this.synchronizer.hasPendingSynchronizations()) {
            this.synchronizer.afterSynchronizingTaskCall(this.currentTask, {fn: this.taskSynchronized, scope: this});
        }
        else {
            this.log("        No synchronizations used by task: " + this.getCurrentTaskIndex() + " of " + this.countTasks());
            this.taskSynchronized();
        }
    };

    /**
     * @member Izi.queue.Queue
     * @private
     */
    Queue.prototype.taskSynchronized = function () {
        this.log("    Task finished: " + this.getCurrentTaskIndex() + " of " + this.countTasks());
        this.dispatchTaskEvent("taskFinished", true);
        this.clearAndProceed();
    };

    /**
     * @member Izi.queue.Queue
     * @private
     */
    Queue.prototype.clearAndProceed = function () {
        this.currentTask = undefined;
        this.proceed();
    };

    /**
     * @member Izi.queue.Queue
     * @private
     * @param type
     * @param addStatistics
     */
    Queue.prototype.dispatchTaskEvent = function (type, addStatistics) {
        var event = {
            type: type,
            queue: this,
            task: this.currentTask
        };
        if (addStatistics) {
            event.currentTask = this.getCurrentTaskIndex();
            event.totalTasks = this.countTasks();
        }
        this.dispatchEvent(this.delegatedIn, type, event)
    };

    /**
     * @member Izi.queue.Queue
     * @private
     * @return {number}
     */
    Queue.prototype.getCurrentTaskIndex = function () {
        return this.originalQueue.length - this.queue.length;
    };

    /**
     * @member Izi.queue.Queue
     * @private
     * @return {Number}
     */
    Queue.prototype.countTasks = function () {
        return this.originalQueue.length;
    };

    /**
     * @member Izi.queue.Queue
     * @private
     * @param task
     * @return {Number}
     */
    Queue.prototype.timeoutForTask = function (task) {
        // todo - specific timeouts for tasks
        return this.config.defaultTimeout;
    };

    /**
     * @member Izi.queue.Queue
     * @private
     */
    Queue.prototype.currentTaskTimeouted = function () {
        this.synchronizer.taskTimeout(this.currentTask);
        this.dispatchTaskEvent("taskTimeouted", true);
        this.clearAndProceed();
    };

    Queue.prototype.log = function (message) {
        if (this.config.debug) {
            log("[izi.queue:" + this.id + "] " + formatTimeStamp() + " " + message);
        }
    };

    module.queue.Queue = Queue;

}(Izi, this);
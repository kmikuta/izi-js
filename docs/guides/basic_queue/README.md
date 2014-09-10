# Queue

`izi.queue()` allows you to define and execute sequence of synchronous and asynchronous tasks. This functionality
may be helpful when you need to execute some asynchronous Ajax calls sequentially:

    izi.queue().execute(callAsyncAjaxAndWaitForResult1,
                        callAsyncAjaxAndWaitForResult2,
                        doSomethingUsingBothResults);

Next use case shows how to create simple interaction with user which is editing some form:

    izi.queue().execute(askUserToSaveChanges,   // show prompt popup and wait until user clicks OK button
                        saveChangesOnServer,    // call async Ajax and wait for response
                        showSaveStatusMessage);

All above items (like `askUserToSaveChanges` or `saveChangesOnServer`) are tasks described in next section.

## Task

Task may be defined as a `Function` or an `Object` with `execute()` method:
    
    var taskAsFunction = function () {
         // some code of task
    }

    var taskAsObject = {
        execute: function () {
            // some code of task
        }
    }

    izi.queue().execute(taskAsFunction,
                        taskAsObject);

The only difference is the scope of executions:

 * `taskAsFunction` is executed by default in `window` scope or in scope defined in configuration: `izi.queue({scope: someScope})`
 * `taskAsObject.execute()` is executed in its own `taskAsObject` scope

Queue is executing tasks sequentially by calling each of them and passing as an argument instance of
{@link Izi.queue.Synchronizer} which gives you possibility to synchronize the task if it is needed:
    
    var asynchronousTask = {
        execute: function (synchronize) {
            // synchronize.onCallback(...)
            // synchronize.onEvent(...)
            // synchronize.responder(...)
        }
    };

    izi.queue().execute(asynchronousTask);

When one of:

 * {@link Izi.queue.Synchronizer#onCallback synchronize.onCallback}
 * {@link Izi.queue.Synchronizer#onEvent synchronize.onEvent}
 * {@link Izi.queue.Synchronizer#responder synchronize.responder}

is called, it informs the queue that this task calls some asynchronous code, so queue should wait until all asynchronous callbacks
return. There may be synchronized more than one asynchronous code - the queue will be waiting for all of them.

If you don't use any of synchronize.* methods inside the task - this task will be treated as synchronous task and
queue will execute next task immediately.

## Synchronize async callback

Usage of {@link Izi.queue.Synchronizer#onCallback synchronize.onCallback} will hold queue execution until
asynchronous callback will be triggered. synchronize.onCallback() returns a `Function` closure which releases the queue
when the closure is executed:

    var waitTwoSecondsTask = function (synchronize) {
            setTimeout(synchronize.onCallback(), 2000);
        },
        showAlertTask = function () {
            alert("Alert showed after 4 seconds!");
        };

    izi.queue().execute(waitTwoSecondsTask,
                        waitTwoSecondsTask,
                        showAlertTask);

There is also an option to execute additional callback code before next task will be executed:

    var writeFoo = function () {
            console.log("Foo");
        },
        waitTwoSecondsAndWriteFooTask = function (synchronize) {
            setTimeout(synchronize.onCallback(writeFoo), 2000);
        },
        writeBarTask = function () {
            console.log("Bar");
        };

    izi.queue().execute(waitTwoSecondsAndWriteFooTask,
                        writeBarTask);

    // will log on console:
    // "Foo"
    // "Bar"

## Synchronize on event

Usage of {@link Izi.queue.Synchronizer#onEvent synchronize.onEvent} synchronizes the queue when dispatcher will fire
an event of given type.

    var showPopupAndWaitForOkTask = {
        alertPopup: new AlertPopup(),

        execute: function(synchronize) {
            synchronize.onEvent(this.alertPopup.okButton, "click");
            this.alertPopup.show();
        }
    };

    izi.queue().execute(showPopupAndWaitForOkTask,
                        otherTask);

## Synchronize responder

Usage of {@link Izi.queue.Synchronizer#responder synchronize.responder} synchronizes the queue when service triggers
the responder either on result() or error() methods. If you have reponder with methods different than result() or error(),
then you can specify the custom ones.

    var callAjaxAndWaitForResponse = {

        execute: function(synchronize) {
            Ajax.request("/someUrl", someParameters, synchronize.responder(this));
        },

        result: function (ajaxResponse) {
            // some code for handling Ajax response
            // after this code the queue will execute `otherTask`
        },

        error: function (ajaxFailure) {
            // some code for handling Ajax error
            // after this code the queue will execute `otherTask`
        },
    };

    izi.queue().execute(callAjaxAndWaitForResponse,
                        otherTask);

## Cancelling the queue

You can cancel already started queue using {@link Izi.queue.Queue#cancel queue.cancel()} method:

    var queue = izi.queue().execute(task1, task2, task3);
    // ... and in any time:
    queue.cancel();

When you want to cancel the queue from task scope - it would be easiest to use
{@link Izi.queue.Synchronizer#cancelQueue synchronize.cancelQueue()} closure from synchronizer, so you don't
need to worry about passing queue reference to the task:

    var task1 = {
        execute: function (synchronize) {
            // store handler of cancelQueue for later execution
            this.cancelQueue = synchronize.cancelQueue;

            setTimeout(synchronize.onCallback(this.doOnCallback, this), 1000);
        },

        doOnCallback: function () {
            if (someCondition) {
                this.cancelQueue();
            }
        }
    }

## Queue events

There is a couple events that are fired by the queue during processing:

 * {@link Izi.queue.Queue#onTaskStarted "taskStarted"} - fired when each task is started
 * {@link Izi.queue.Queue#onTaskFinished "taskFinished"} - fired when each task is finished
 * {@link Izi.queue.Queue#onTaskTimeouted "taskTimeouted"} - fired when the task is time outed
 * {@link Izi.queue.Queue#onTaskTimeouted "taskTimeouted"} - fired when the task is time outed
 * {@link Izi.queue.Queue#onQueueCanceled "queueCanceled"} - fired when the queue is canceled
 * {@link Izi.queue.Queue#onQueueFinished "queueFinished"} - fired when the queue is finished

You can add listeners in two ways:

 * using callbacks passed to: `queue.onTaskStarted(callback, scope)` etc...
 * using izi behaviors: `izi.perform(callback).when("taskStarted").on(queue)`

Each event object contains some useful data:

    queue.onTaskStarted(function (event) {
        event.type // type of event, like "taskStarted"
        event.queue // reference to queue
        event.task // reference to current task
        event.currentTask // index of currently executed task starting from 1 (not 0!)
        event.totalTasks // total number of all tasks in queue
    });

## Debugging the queue

You may want to see in browser's console any activity of queue by setting debug property in configuration object to
some name as String:

    izi.queue({debug: "MyQueue"}).execute(task1, task2);

It is useful when you have many queues run and you need to recognize what kind of activities belong to which queue.
Example output from Chrome console:

    [izi.queue:MyQueue:4] 10:36:45.061 Queue started. Total tasks to execute: 2
    [izi.queue:MyQueue:4] 10:36:45.061
    [izi.queue:MyQueue:4] 10:36:45.061     Task started: 1 of 2
    [izi.queue:MyQueue:4] 10:36:45.061         synchronize.onCallback() was used by task: 1 of 2
    [izi.queue:MyQueue:4] 10:36:45.162         synchronize.onCallback() completed by task: 1 of 2
    [izi.queue:MyQueue:4] 10:36:45.162     Task finished: 1 of 2
    [izi.queue:MyQueue:4] 10:36:45.162
    [izi.queue:MyQueue:4] 10:36:45.171     Task started: 2 of 2
    [izi.queue:MyQueue:4] 10:36:45.171         No synchronizations used by task: 2 of 2
    [izi.queue:MyQueue:4] 10:36:45.171     Task finished: 2 of 2
    [izi.queue:MyQueue:4] 10:36:45.162
    [izi.queue:MyQueue:4] 10:36:45.162 Queue finished

where:

 * `izi.queue:MyQueue:4` - "4" number is a unique identifier of queue instance
 * `10:36:45.061` is a timestamp

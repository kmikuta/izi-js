describe("Queue", function () {

    var texts,
        globalScope = window,
        syncScope,
        asyncScope,
        service,
        serviceTask,
        Izi = izi.module;

    function callAndPushText(text) {

        return function () {
            syncScope = this;
            texts.push(text);
        };
    }

    function callAsyncAndPushText(text, callbackScope) {

        return function (synchronize) {
            asyncScope = this;
            setTimeout(synchronize.onCallback(callAndPushText(text), callbackScope || globalScope), 100);
        };
    }

    beforeEach(function () {
        registerObservableBehaviorImpl();
        registerQueueImpl();
        // given
        texts = [];
        service = {
            someMethod: function (responder) {
                this.responder = responder;
            },

            doResponse: function (responseData) {
                this.responder.result(responseData);
            },

            doError: function (errorData) {
                this.responder.error(errorData);
            }
        };

        serviceTask = {

            execute: function (synchronize) {
                service.someMethod(synchronize.responder(this));
            },

            result: function (responseData) {
                this.responseData = responseData;
            },

            error: function (errorData) {
                this.errorData = errorData;
            }
        };
    });

    it("Should call 2 synchronous functions in global scope", function () {
        // when
        izi.queue().execute(
            callAndPushText("One"),
            callAndPushText("Two")
        );

        // then
        expect(texts).toEqual(["One", "Two"]);
        expect(syncScope).toBe(globalScope);
    });

    it("Should be able to prepare queue using push() and start using start()", function () {
        // given
        var queue = izi.queue().push(
            callAndPushText("One"),
            callAndPushText("Two")
        );

        // when
        queue.start();

        // then
        expect(texts).toEqual(["One", "Two"]);
    });

    it("Should be able to run one queue many times", function () {
        // given
        var queue = izi.queue().push(
            callAndPushText("One"),
            callAndPushText("Two")
        );

        // when
        queue.start();
        queue.start();

        // then
        expect(texts).toEqual(["One", "Two", "One", "Two"]);
    });

    it("Should throw an error when queue is run", function () {
        // given
        var queue = izi.queue().execute(
            callAsyncAndPushText("One")
        );

        // when
        expect(function () {
            queue.start();
            queue.start();
        }).toThrowError("Can't start already started queue until it's finished");
    });

    it("Should execute a task in its scope", function () {
        // given
        var taskScope,
            task = {
                execute: function () {
                    taskScope = this;
                }
            };

        // when
        izi.queue({scope: syncScope}).execute(
            task
        );

        // then
        expect(taskScope).not.toBe(syncScope);
        expect(taskScope).toBe(task);
    });

    it("Should call 2 synchronous functions in given scope", function () {
        // given
        var taskScope = {};

        // when
        izi.queue({scope: taskScope}).execute(
            callAndPushText("One"),
            callAndPushText("Two")
        );

        // then
        expect(texts).toEqual(["One", "Two"]);
        expect(syncScope).toBe(taskScope);
    });

    it("Should call 2 asynchronous functions in global scope", function (done) {
        // given
        var callbackScope = {};

        // when
        izi.queue().execute(
            callAsyncAndPushText("One", callbackScope),
            callAsyncAndPushText("Two", callbackScope)
        );

        setTimeout(function () {
            // then
//            expect(texts).toEqual(["One", "Two"]);
            expect(asyncScope).toBe(globalScope);
            expect(syncScope).toBe(callbackScope);
            done();
        }, 300);
    });

    it("Should call 2 asynchronous functions in given scope", function (done) {
        // given
        var callbackScope = {},
            taskScope = {};

        // when
        izi.queue({scope: taskScope}).execute(
            callAsyncAndPushText("One", callbackScope),
            callAsyncAndPushText("Two", callbackScope)
        );
        setTimeout(function () {
            // then
            expect(texts).toEqual(["One", "Two"]);
            expect(asyncScope).toBe(taskScope);
            expect(syncScope).toBe(callbackScope);
            done();
        }, 300);
    });

    it("Should call mixed async and sync tasks", function (done) {

        // when
        izi.queue().execute(
            callAndPushText("One"),
            callAsyncAndPushText("Two"),
            callAsyncAndPushText("Three"),
            callAndPushText("Four"),
            callAsyncAndPushText("Five")
        );

        setTimeout(function () {
            // then
            expect(texts).toEqual(["One", "Two", "Three", "Four", "Five"]);
            done();
        }, 500);
    });

    it("Should synchronize more than one async callbacks", function (done) {

        // when
        izi.queue().execute(
            function (synchronize) {
                setTimeout(synchronize.onCallback(callAndPushText("One")), 50);
                setTimeout(synchronize.onCallback(callAndPushText("Two")), 100);
            },
            callAndPushText("Three")
        );

        setTimeout(function () {
            // then
            expect(texts).toEqual(["One", "Two", "Three"]);
            done();
        }, 300);
    });

    it("Should synchronize on event", function () {

        // given
        var dispatcher = new Izi.model.Observable(),
            waitForSomeEvent = function (synchronize) {
                synchronize.onEvent(dispatcher, "someEvent");
            };
        izi.queue().execute(
            callAndPushText("One"),
            waitForSomeEvent,
            callAndPushText("Two")
        );
        expect(texts).toEqual(["One"]);

        // when
        dispatcher.dispatchEvent("someEvent");

        // then
        expect(texts).toEqual(["One", "Two"]);
    });

    it("Should synchronize on more events and eventConfigs", function () {

        // given
        var dispatcher = new Izi.model.Observable(),
            waitForSomeEvent = function (synchronize) {
                synchronize.onEvent(dispatcher, izi.events.click(), izi.events.dblClick());
            };
        izi.queue().execute(
            callAndPushText("One"),
            waitForSomeEvent,
            callAndPushText("Two")
        );
        expect(texts).toEqual(["One"]);

        // when
        dispatcher.dispatchEvent("dblclick");

        // then
        expect(texts).toEqual(["One", "Two"]);
    });

    it("Should synchronize on two events", function () {

        // given
        var dispatcher = new Izi.model.Observable(),
            waitForSomeEvent = function (synchronize) {
                synchronize.onEvent(dispatcher, "someEvent1");
                synchronize.onEvent(dispatcher, "someEvent2");
            };
        izi.queue().execute(
            callAndPushText("One"),
            waitForSomeEvent,
            callAndPushText("Two")
        );
        dispatcher.dispatchEvent("someEvent1");
        expect(texts).toEqual(["One"]);

        // when
        dispatcher.dispatchEvent("someEvent2");

        // then
        expect(texts).toEqual(["One", "Two"]);
    });

    it("Should synchronize responder on result", function () {

        // given
        izi.queue().execute(
            callAndPushText("One"),
            serviceTask,
            callAndPushText("Two")
        );

        // when
        expect(texts).toEqual(["One"]);
        service.doResponse("SomeResponse");

        // then
        expect(texts).toEqual(["One", "Two"]);
        expect(serviceTask.responseData).toEqual("SomeResponse");
    });

    it("Should synchronize responder on error", function () {

        // given
        izi.queue().execute(
            callAndPushText("One"),
            serviceTask,
            callAndPushText("Two")
        );

        // when
        expect(texts).toEqual(["One"]);
        service.doError("SomeError");

        // then
        expect(texts).toEqual(["One", "Two"]);
        expect(serviceTask.errorData).toEqual("SomeError");
    });

    it("Should dispatch events", function () {

        // given
        function checkScope() {
            callbackScope = this;
        }

        var scope = {},
            callbackScope,
            queue = izi.queue().push(
                callAndPushText("One"),
                callAndPushText("Two")
            );
        queue.onTaskStarted(callAndPushText("taskStarted"));
        queue.onTaskFinished(callAndPushText("taskFinished"));
        queue.onQueueFinished(callAndPushText("queueFinished"));
        queue.onQueueFinished(checkScope, scope);

        // when
        queue.start();

        // then
        expect(callbackScope).toBe(scope);
        expect(texts).toEqual(["taskStarted",
                               "One",
                               "taskFinished",
                               "taskStarted",
                               "Two",
                               "taskFinished",
                               "queueFinished"]);
    });

    it("Should not dispatch events when stopped", function () {

        // given
        var queue = izi.queue().push(
            callAndPushText("One"),
            callAndPushText("Two")
        );
        queue.onTaskStarted(callAndPushText("taskStarted")).stopObserving();
        queue.onTaskFinished(callAndPushText("taskFinished")).stopObserving();
        queue.onQueueFinished(callAndPushText("queueFinished")).stopObserving();

        // when
        queue.start();

        // then
        expect(texts).toEqual(["One",
                               "Two"]);
    });

    it("Should dispatch events with more information", function () {

        // given
        var taskStartedEvents = [],
            taskFinishedEvents = [],
            queueFinishedEvents = [],
            queue = izi.queue().push(
                callAndPushText("One"),
                callAndPushText("Two")
            ),
            onTaskStarted = function (event) {
                taskStartedEvents.push(event);
            },
            onTaskFinished = function (event) {
                taskFinishedEvents.push(event);
            },
            onQueueFinished = function (event) {
                queueFinishedEvents.push(event);
            };
        queue.onTaskStarted(onTaskStarted);
        queue.onTaskFinished(onTaskFinished);
        queue.onQueueFinished(onQueueFinished);

        // when
        queue.start();

        // Task 1
        expect(taskStartedEvents[0].type).toBe("taskStarted");
        expect(taskStartedEvents[0].totalTasks).toBe(2);
        expect(taskStartedEvents[0].currentTask).toBe(1);
        expect(taskStartedEvents[0].task).toBeDefined();
        expect(taskStartedEvents[0].queue).toBe(queue);

        expect(taskFinishedEvents[0].type).toBe("taskFinished");
        expect(taskFinishedEvents[0].totalTasks).toBe(2);
        expect(taskFinishedEvents[0].currentTask).toBe(1);
        expect(taskFinishedEvents[0].task).toBeDefined();
        expect(taskFinishedEvents[0].queue).toBe(queue);

        // Task 2
        expect(taskStartedEvents[1].type).toBe("taskStarted");
        expect(taskStartedEvents[1].totalTasks).toBe(2);
        expect(taskStartedEvents[1].currentTask).toBe(2);
        expect(taskStartedEvents[1].task).toBeDefined();
        expect(taskStartedEvents[1].queue).toBe(queue);

        expect(taskFinishedEvents[1].type).toBe("taskFinished");
        expect(taskFinishedEvents[1].totalTasks).toBe(2);
        expect(taskFinishedEvents[1].currentTask).toBe(2);
        expect(taskFinishedEvents[1].task).toBeDefined();
        expect(taskFinishedEvents[1].queue).toBe(queue);

        // Whole queue
        expect(queueFinishedEvents[0].type).toBe("queueFinished");
        expect(queueFinishedEvents[0].queue).toBe(queue);
    });

    it("Should timeout too long sustained task", function (done) {
        // given
        var timeoutedEvent,
            queue;

        // when
        queue = izi.queue({defaultTimeout: 10}).push(
            callAsyncAndPushText("One"),
            callAndPushText("Two")
        );
        queue.onTaskTimeouted(function (event) {
            timeoutedEvent = event;
        });
        queue.start();

        setTimeout(function () {
            // then
            expect(texts).toEqual(["Two"]);
            expect(timeoutedEvent.type).toBe("taskTimeouted");
            expect(timeoutedEvent.queue).toBe(queue);
            done();
        }, 20);
    });

    it("Should cancel a queue by synchronizer closure 'cancelQueue()'", function () {
        // given
        var canceledEvent,
            doCancelQueue = function (synchronize) {
                synchronize.cancelQueue.call(); // any scope
            },
            queue = izi.queue().push(callAndPushText("One"),
                                     doCancelQueue,
                                     callAndPushText("Two"));
        queue.onQueueCanceled(function (event) {
            canceledEvent = event;
        });

        // when
        queue.start();

        // then
        expect(texts).toEqual(["One"]);
        expect(canceledEvent.type).toBe("queueCanceled");
        expect(canceledEvent.task).toBeDefined();
        expect(canceledEvent.currentTask).toBe(2);
        expect(canceledEvent.totalTasks).toBe(3);
    });
});

describe("Behavior", function () {

    izi.registerBehaviorImpl({

                                 defaultPerformFunction: "performFunction",

                                 observeWidget: function (target, eventConfig, action, scope, options) {

                                     target.addListener(action, scope);

                                     return function stopObserving() {
                                         target.removeListener(action, scope);
                                     };
                                 },

                                 observeKeyStroke: function (target, keyboardConfig, action, scope, options) {
                                 }
                             });

    it("Should add listener on default perform function", function () {

        // given
        var dispatcher = {
                addListener: sinon.spy(),
                removeListener: sinon.spy()
            },
            behavior = {
                performFunction: function () {
                }
            };

        // when
        izi.perform(behavior).when("someEventType").on(dispatcher).stopObserving();

        // then
        expect(dispatcher.addListener).toHaveBeenCalledWithExactly(behavior.performFunction, behavior);
        expect(dispatcher.removeListener).toHaveBeenCalledWithExactly(behavior.performFunction, behavior);
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should add listener on group of behaviors", function () {

        // given
        var dispatcher = {
                addListener: sinon.spy(),
                removeListener: sinon.spy()
            },
            behavior1 = {
                performFunction: function () {
                }
            },
            behavior2 = {
                performFunction: function () {
                }
            },
            perform = izi.perform();

        // when
        perform(behavior1).when("someEventType").on(dispatcher);
        perform(behavior2).when("someEventType").on(dispatcher);

        perform.stopObserving();

        // then
        expect(dispatcher.addListener).toHaveBeenCalledWithExactly(behavior1.performFunction, behavior1);
        expect(dispatcher.addListener).toHaveBeenCalledWithExactly(behavior2.performFunction, behavior2);
        expect(dispatcher.removeListener).toHaveBeenCalledWithExactly(behavior1.performFunction, behavior1);
        expect(dispatcher.removeListener).toHaveBeenCalledWithExactly(behavior2.performFunction, behavior2);
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should add listener for delegated in object", function () {

        // given
        var dispatcher = {
                addListener: sinon.spy()
            },
            holder = {
                delegatedIn: dispatcher
            },
            behavior = {
                method: function () {
                }
            };

        // when
        izi.perform(behavior.method, behavior).when("someEventType").on(holder);

        // then
        expect(dispatcher.addListener).toHaveBeenCalledOnce();

    }); // -------------------------------------------------------------------------------------------------------------

    it("Should allow to add and remove listeners by own event registrar", function () {
        // given
        var target = {},
            registrar = {
                register: sinon.spy(),
                unregister: sinon.spy()
            };

        // when
        var observer = izi.perform(registrar).on(target);
        observer.stopObserving();

        // then
        expect(registrar.register).toHaveBeenCalledWith(target);
        expect(registrar.unregister).toHaveBeenCalledWith(target);
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should throw an exception when izi.perform(behavior).on(target) called without custom registrar", function () {
        // given
        var target = {},
            behavior = {
                performFunction: sinon.spy()
            };

        expect(function () {
            // when
            izi.perform(behavior).on(target);

            // then
        }).toThrowError("Use on(target) method only for custom registrars: izi.perform({register: function (target){...}).on(target)");
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should use built in iziObserveWidget() method", function () {
        // given

        var args,
            off = sinon.spy(),
            dispatcher = {
                iziObserveWidget: function (eventConfig, action, scope, options) {
                    args = arguments;
                    return off;
                }
            },
            behavior = {
                performFunction: sinon.spy()
            };

        // when
        izi.perform(behavior).when("someEventType").on(dispatcher).stopObserving();

        // then
        expect(args[0].getEventType()).toBe("someEventType");
        expect(args[1]).toBe(behavior.performFunction);
        expect(args[2]).toBe(behavior);
        expect(off).toHaveBeenCalledOnce();
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should use built in iziObserveKeyStroke() method", function () {
        // given

        var args,
            off = sinon.spy(),
            dispatcher = {
                iziObserveKeyStroke: function (eventConfig, action, scope, options) {
                    args = arguments;
                    return off;
                }
            },
            behavior = {
                performFunction: sinon.spy()
            };

        // when
        izi.perform(behavior).when(izi.events.keyDown().ENTER()).on(dispatcher).stopObserving();

        // then
        expect(args[0].getEventType()).toBe("keydown");
        expect(args[1]).toBe(behavior.performFunction);
        expect(args[2]).toBe(behavior);
        expect(off).toHaveBeenCalledOnce();
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should use custom registrar in when section", function () {

        // given
        var behavior = {performFunction: sinon.spy()},
            dispatcher = {},
            options = {},
            registrar = sinon.spy();

        // when
        izi.perform(behavior).when(registrar, options).on(dispatcher);

        // then
        expect(registrar).toHaveBeenCalledWith(dispatcher, behavior.performFunction, behavior);

    }); // -------------------------------------------------------------------------------------------------------------

});
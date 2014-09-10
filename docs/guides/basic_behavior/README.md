Behaviors
=========

Basic behavior setup
--------------------

**izi** promotes usage of behavior/observer pattern in your application. It allows you to keep not tight
coupled code and easily reuse parts of your code. In order to execute some behavior you can use friendly fluent API.

In examples below classes are built using [MooTools framework](http://mootools.net/)

### 1. Prepare behavior class

    Demo.behaviors.ShowMessage = new Class({

        message: "",

        perform: function (event) {
            alert(this.message + event);
        }
    });


### 2. Observe UI interaction and execute behavior
Place button somewhere in your HTML:

    <input type="button" id="button" value="Click Me!"/>

Setup behavior:

    var button = $("button");
    var showMessage = new Demo.behaviors.ShowMessage();
    showMessage.message = "You clicked: ";

    izi.perform(showMessage).when('click').on(button);

Above example means, that **izi** will execute by default **perform** method of
**showMessage** instance when user **click**s the **button**.

That's all! If you want to show message in other parts in your application - just reuse ShowMessage behavior and bind
it to user interaction events.

Observing model changes
-----------------------
**izi** supports also behavior executions when model is changing its data:

    izi.perform(behavior).whenChangeOf("firstName", "lastName").on(userModel);

Above example means, that **izi** will execute by default **perform** method of
**behavior** instance when either **firstName** or **lastName** field changes
in the **userModel**. You can pass as many model fields as you want.

Executing custom functions
--------------------------
You can also call any function (not only special behavior with perform method) if you want:

    izi.perform(someFunction).when('click').on(button);

If you need to call someFunction in specified scope:

    izi.perform(someFunction, someScope).when('click').on(button);

Observing complex events
------------------------
There are several entry points to more complex events. Let say you need to observe mouse click, but you need also
to check if SHIFT key was pressed during that behavior.

    izi.perform(behavior).when(izi.events.click().shift()).on(button);

Observing keyboard
------------------
If you want to executed some parts of application using keyboard, below example will be best for you:

    izi.perform(behavior).when(izi.events.keyDown().ctrl().F3().preventDefault()).on(document);

Above statement means that when user presses CTRL+F3 keys in any part of HTML document, then behavior will be executed.
Moreover if a web browser has defined any CTRL+F3 keystroke - it will be prevented by <code>.preventDefault()</code>.

Observing multiple events
-------------------------
If you need to trigger behavior when more than one event is fired, then you can use:

    izi.perform(behavior).when('change', 'click').on(textInput);

There is also possible to use event shortcuts from izi.events API:
    izi.perform(behavior).when(izi.events.change(), izi.events.click()).on(textInput);


Event registration function
---------------------------
`.when(eventRegistration)` part of behavior API supports custom event registration function.

    // target - is a button in this example
    // action - is a reference to `behavior.perform` function
    // scope - is a reference to `behavior`
    function click(target, action, scope, eventOptions) {

        // You may use any custom registration here
        target.addListener("click", action, scope);

        return function stopObserving() {

            // You must return function that will unregister listener
            target.removeListener("click", action, scope);
        }
    }

    izi.perform(behavior).when(click).on(button);

Complex event registrar
----------------------
Sometimes there is needed to implement more complicated event registration (ex. for drag and drop support), then you
 may want to use following pattern:

    var drag = {
        register: function (target) {
            target.addEventListener('mousedown', target, startDrag);
            target.addEventListener('mousemove', target, moveDrag);
        },

        unregister: function (target) {
            target.removeEventListener('mousedown', target, startDrag);
            target.removeEventListener('mousemove', target, moveDrag);
        }
    };

    izi.perform(drag).on(item);

Grouping behaviors
------------------

To unregister all event listeners you should use `stopObserving()` method:

    this.handler = izi.perform(behavior).when("click").on(target);

    // then somewhere else within the same class you want to stop observing:

    this.handler.stopObserving();

But when you have to use a lot of behaviors, then you must to keep a lot of handlers:

    this.handler1 = izi.perform(behavior1).when("click").on(target1);
    this.handler2 = izi.perform(behavior2).when("click").on(target2);
    this.handler3 = izi.perform(behavior3).when("click").on(target3);

    // and then:
    this.handler1.stopObserving();
    this.handler2.stopObserving();
    this.handler3.stopObserving();

To solve this problem use following trick:

    var perform = this.behaviors = izi.perform();

    perform(behavior1).when("click").on(target1);
    perform(behavior2).when("click").on(target2);
    perform(behavior3).when("click").on(target3);

    // and then only one call to stop observing them all:
    this.behaviors.stopObserving();


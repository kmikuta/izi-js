Using delegated events with behaviors
======================================

jQuery supports delegated events that require to setup two selectors: the first one for existing DOM element and the
 second one for descendant element which we want to observe that may not be present in DOM at the time when our
 code calls `.on()` method.

Behaviors registration syntax doesn't allow to pass more than one target but it is possible to pass event registration
 function using `.when()` method. To setup behavior with delegated event use following syntax:

    // Basic syntax
    izi.perform(behavior).when($.iziDelegate("click", ".not-existing-element")).on($(".existing-element"));

    // or more readable way
    var click = $.iziDelegate("click");

    izi.perform(behavior).when(click(".not-existing-element")).on($(".existing-element"));

`$.iziDelegate()` is a function added to jQuery by izi-js-jquery implementation and returns event registration function
described [here](#!/api/Izi.behavior.Perform-method-when).
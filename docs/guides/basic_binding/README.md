Data Binding
============

**izi** allows you to setup data bindings from widget to model and from model to widget (also from model to model).
Both widget and model must somehow notify about their changes. That's why the model can't be just stupid javascript object.
Below there are examples using some simple model delivered with izi-js.

For all examples below we have **textField** as a widget and **user** as model.
User model has 2 fields: **firstName** and **lastName** and also getter **getFullName()**
which join those fields together.

    var User = izi.modelOf({
        fields: [
            {name: 'firstName'},
            {name: 'lastName'}
        ],

        getFullName: function() {
            return this.get('firstName') + " " + this.get('lastName');
        }
    });

    var textField = $('textfield');
    var user = new User();

Basic syntax
------------

Use {@link izi#bind izi.bind()} function to initiate binding fluent setup:

    izi.bind().valueOf(source, sourceProperty).to(target, targetProperty);

Binding from widget to model
----------------------------

    izi.bind().valueOf(textField).to(user, "firstName");

    // which is more elegant version of:
    izi.bind().valueOf(textField, "value").to(user, "firstName");

Binding from model to widget
----------------------------

    izi.bind().valueOf(user, "firstName").to().valueOf(textField);

    // which is more elegant version of:
    izi.bind().valueOf(user, "firstName").to(textField, "value");
    
Two way binding
---------------
Since izi 1.5.0 it is possible to setup two way bindings.

    izi.bind().valueOf(user, "firstName").to(textField, "value").twoWay();

    /*
      Order of source and target matters. For example above
      initially bindings will be executed in following order:

      1. user.firstName => textField.value
      2. textField.value => user.firstName
    */


There are following limitations for using two way binding:

 * source property must be only one
 * `through()` function can't be used
 * target can't be a reference to function

Binding through format function
-------------------------------

    var upperCaseFormatter = function (value) {
        return value ? value.toUpperCase() : "";
    };

    izi.bind().valueOf(user, "firstName").through(upperCaseFormatter).to().valueOf(textField);

Binding from more fields than one
---------------------------------

It requires use {@link Izi.binding.ValueOf#through through(formatFunction)}. If any of **firstName**
or **lastName** fields change, then binding will be executed:

    var fullNameFormatter = function (firstName, lastName) {
        return firstName + ' ' + lastName;
    };

    izi.bind().valueOf(user, "firstName", "lastName").through(fullNameFormatter).to().valueOf(textField);

Binding triggered by change of other fields
-------------------------------------------
Please notice that for **fullName** field izi is getting value from camelcased getter **getFullName()** function:

    izi.bind().valueOf(user, "fullName")
              .onChangeOf("firstName").onChangeOf("lastName")
              .to().valueOf(textField);

Binding from model to model
---------------------------
    var user1 = new User();
    var user2 = new User();

    izi.bind().valueOf(user1, "firstName").to(user2, "firstName");
    izi.bind().valueOf(user2, "firstName").to(user1, "firstName");

Function as a target of binding
-------------------------------
You can easily use a function as a target of binding:

    var user = new User();

    function firstNameChangeHandler(value) {
        console.log(value); // "John"
    }

    izi.bind().valueOf(user, "firstName").to(firstNameChangeHandler);
    user.firstName("John");
    
Function (with given scope) as a target of binding
--------------------------------------------------

    var scope = {
        firstName: null,

        firstNameChangeHandler: function (value) {
            this.firstName = value;
        }
    }

    izi.bind().valueOf(model, "firstName").to(scope.firstNameChangeHandler, scope);
    model.firstName("John");

Grouping bindings
-----------------
To unregister all bindings you should use `unbind()` method:

    this.binding = izi.bind().valueOf(model, "firstName").to().valueOf(textField);

    // then somewhere else within the same class you want to stop observing:

    this.binding.unbind();

But when you have to use a lot of bindings, then you must to keep a lot of handlers:

    this.binding1 = izi.bind().valueOf(model, "firstName").to().valueOf(textField1);
    this.binding2 = izi.bind().valueOf(model, "lastName").to().valueOf(textField2);
    this.binding3 = izi.bind().valueOf(model, "email").to().valueOf(textField3);

    // and then:
    this.binding1.unbind();
    this.binding2.unbind();
    this.binding3.unbind();

To solve this problem use following trick:

    var bind = this.bindings = izi.bind();

    bind().valueOf(model, "firstName").to().valueOf(textField1);
    bind().valueOf(model, "lastName").to().valueOf(textField2);
    bind().valueOf(model, "email").to().valueOf(textField3);

    // and then only one call to unbind them all:
    this.behaviors.unbindAll();

    // or in case of manually steered bindings
    this.behaviors.executeAll();

Nested bindings
---------------
Since izi 1.5.0 it is possible to setup nested bindings. It is applicable to source and target properties chains.

    var User = izi.modelOf({
        fields: [
            {name: 'firstName'},
            {name: 'lastName'},
            {name: 'address'}
        ]
    });

    var Address = izi.modelOf({
        fields: [
            {name: 'city'},
            {name: 'street'}
        ]
    });

    var address = new Address();
    var user = new User().address(address);

    izi.bind().valueOf(user, "address.city").to().valueOf(textField);
    izi.bind().valueOf(textField).to(user, "address.city");

    // You can change any time either address or city value
    address.city("London");                       // textField.value > "London"
    user.address(new Address().city("New York")); // textField.value > "New York"

Manually steered binding
------------------------
Sometimes you may want not to trigger bindings automatically or not to trigger binding immediately after its declaration.
You can use binding options:

    var bind = izi.bind({auto: false, executeAtStartup: false});

    bind.valueOf(user, "firstName").to().valueOf(firstNameTextField);
    bind.valueOf(user, "lastName").to().valueOf(lastNameTextField);

    bind.executeAll(); // will execute bindings for both properties (firstName and lastName)
    bind.unbindAll(); // will destroy bindings

Debugging bindings
------------------
Bindings executions may be debugged using following option:

    izi.bind({debug: true}).valueOf(user, "firstName").to().valueOf(textField);
You will get information on browser console during binding execution about: source, source properties, target, target property, committed
 value and place in your code where binding was declared (useful when you debug more than one binding).
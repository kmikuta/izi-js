Model
=====

If your JS framework doesn't implement any bindable model implementation then you may use model built in izi-js.
Please see also {@link Izi.model.Model Model API}

Basic usage
-----------

    var UserModel = izi.modelOf({
        fields: [
                    "firstName",                                   // field may be declared as `String`
                    "lastName",
                    "email",
                    {name : "activeAccount", defaultValue: true}   // or by object with `name` and `defaultValue`
                ]
    });

    var user = new UserModel();

    // UserModel class has generated setters and getters for each field:
    user.getFirstName();
    user.setFirstName("John");

    // and shorter version
    user.firstName();        // getter
    user.firstName("John");  // setter

    // all setters are chainable:
    user.firstName("John").lastName("Kowalsky").email("john.kowalsky@domain.com");

    // generic getter and setter
    user.get("firstName");
    user.set("firstName", "John");

    // multiple properties setter - only given properties will be set
    user.set({
       firstName: "John",
       lastName: "Kowalsky"
       // email and activeAccount will be untouched
    });

    // default value is already present
    user.getActiveAccount(); // true


Custom setters and getters
--------------------------

If you want to implement more complicated setter or getter, then you may specify any methods in configuration:

    var UserModel = izi.modelOf({
        fields: ["firstName", "lastName"],

        // getter of field that is not owned by model
        getFullName: function () {
            return this.getFirstName() + " " + this.getLastName();
        },

        setFullName: function (value) {
            var elements = value.split(" ");
            this.set({                         // this setter doesn't call setFirstName() and setLastName()
                firstName: elements[0],
                lastName: elements[1],
            });
            this.dispatchChange("fullName");    // trigger data bindings for `getFullName()`
        }

        setFirstName: function (value) {        // overrides original setter
            this.set("firstName", value);       // call original functionality
            this.dispatchChange("fullName");    // trigger data bindings for `getFullName()`
            return this;                        // make it chainable
        },

        setLastName: function (value) {         // overrides original setter
            this.set("lastName", value);        // call original functionality
            this.dispatchChange("fullName");    // trigger data bindings for `getFullName()`
            // make it chainable
            return this;
        }
    });

Notice: under the hood original setters are implemented as in an example below:

    UserModel.prototype.setFirstName: function (value) {
        return this.set("firstName", value);
    }

    UserModel.prototype.firstName: function (value) {
        if (arguments.length > 0) {
            return this.setFirstName(value);
        } else {
            return this.getFirstName();
        }
    }

It means when you call `user.firstName("John")` it will call your overridden setter `setFirstName("John")`.
Above example is not efficient - please look at

Init method
-----------

`init` method is called from model constructor. You may want to register event listeners there or set default
values of complex type like `Array` or `Object`.

    var UserModel = izi.modelOf({
        fields: ["firstName",
                 "lastName",
                 "fullName",
                 "hobbies"],

        init: function () {
            console.log("init");

            // Default values of Array and Object types should be created in `init()` method to avoid sharing
            // the same reference between all model instances.
            this.setHobbies([]);

            // More efficient way to provide field that depends on values of other fields
            this.addListener("firstNameChange", this._updateFullName, this);
            this.addListener("lastNameChange", this._updateFullName, this);
        },

        _updateFullName: function () {
            this.setFullName(this.getFirstName() + " " + this.getLastName());
        }
    });

    new UserModel();  // console log: "init"


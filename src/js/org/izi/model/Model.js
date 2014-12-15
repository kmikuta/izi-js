/**
 * @ignore
 * @requires Observable.js
 * @requires ../utils/getterOf.js
 * @requires ../utils/setterOf.js
 * @requires ../utils/typeOf.js
 */
!function (module) {

    var forEach = module.utils.forEach;

    function normalizeFields(fields) {
        var result = [];
        forEach(fields, function (field) {
            field = module.utils.typeOf(field) === "Object" ? field : {name: field};
            field.getter = module.utils.getterOf(field.name);
            field.setter = module.utils.setterOf(field.name);
            result.push(field);
        });
        return result;
    }

    function hasToPlainObjectMethod(value) {
        return value && module.utils.typeOf(value.toPlainObject) === "Function";
    }

    function implementGetterAndSetter(Class, name, getter, setter) {

        Class.prototype[name] = function (value) {
            if (arguments.length === 0) {
                return this[getter]();
            } else if (arguments.length === 1) {
                return this[setter](value);
            } else {
                throw new Error("Too many arguments. Setter function requires exactly one argument");
            }
        };

        Class.prototype[getter] = function () {
            return this.get(name);
        };

        Class.prototype[setter] = function (value) {
            return this.set(name, value);
        };
    }

    function createInitialData(fields) {
        var data = {};

        forEach(fields, function (field) {
            if (field.hasOwnProperty("defaultValue")) {
                data[field.name] = field.defaultValue;
            } else if (field.hasOwnProperty("initialValue")) {
                data[field.name] = field.initialValue;
            }
        });
        return data;
    }

    /**
     * See [Model guide](#guide/model) for usage documentation.
     *
     * @extends Izi.model.Observable
     * @class Izi.model.Model
     * @constructor
     */
    var Model = function Izi_Model() {
        Model.upper.constructor.apply(this, arguments);
        this.init();
    };

    module.utils.inherit(Model, module.model.Observable);

    /**
     * @member Izi.model.Model
     * @private
     * @type {Boolean}
     */
    Model.prototype.isIziModel = true;

    /**
     * Abstract init method called from constructor
     * @member Izi.model.Model
     * @protected
     */
    Model.prototype.init = function () {
    };

    /**
     * Retrieves value of given property name
     * @member Izi.model.Model
     * @param {String} propertyName
     * @return {*}
     */
    Model.prototype.get = function (propertyName) {
        return this.data[propertyName];
    };

    /**
     * Updates value of given property name and returns own model instance (this).
     * @member Izi.model.Model
     * @fires change
     * @fires propertyNameChange
     * @param {String|Object} propertyName or map of pairs property=>value
     * @param {*} [value]
     * @return {Izi.model.Model}
     */
    Model.prototype.set = function (propertyName, value) {

        if (arguments.length === 1 && module.utils.typeOf(propertyName) === "Object") {
            for (var prop in propertyName) {
                if (propertyName.hasOwnProperty(prop)) {
                    this.set(prop, propertyName[prop]);
                }
            }
            return this;
        }

        var currentValue = this.data[propertyName];

        if (!this.equals(currentValue, value)) {
            this.data[propertyName] = value;
            this.dispatchChange(propertyName, value, currentValue);
        }
        return this;
    };

    /**
     * Fires notifications about value changes. This method is used internally by {@link Izi.model.Model#set} method.
     * Firstly is fired event `"change"` and after that is fired event with name corresponding to `propertyName`.
     * For example for `dispatchChange("firstName")` will be fired two events: `"change"` and `"firstNameChange"`.
     *
     * @fires change
     * @fires propertyNameChange
     * @param {String} propertyName
     * @param {*} [newValue]
     * @param {*} [oldValue]
     */
    Model.prototype.dispatchChange = function (propertyName, newValue, oldValue) {
        this.dispatchEvent(propertyName + "Change", [newValue, oldValue]);
        this.dispatchEvent("change", [propertyName, newValue, oldValue]);
    };

    /**
     * Method used to detect if new value that is pretended to be set is different to the old one. Override
     * this method if you want to use custom equals function.
     *
     * @param {*} val1
     * @param {*} val2
     * @returns {Boolean}
     */
    Model.prototype.equals = function (val1, val2) {
        if (module.utils.typeOf(val1) === "Array" && module.utils.typeOf(val2) === "Array") {
            return this.equalsArray(val1, val2);
        }

        return val1 === val2;
    };

    /**
     * This method is used in default {@link Izi.model.Model#equals} method.
     *
     * @param arr1
     * @param arr2
     * @returns {boolean}
     */
    Model.prototype.equalsArray = function (arr1, arr2) {
        if (arr1.length !== arr2.length) {
            return false;
        }

        for (var i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }

        return true;
    };

    Model.prototype.iziObserveProperty = function (property, propertyChangeCallback) {
        var me = this,
            propertyChangeEvent = property + "Change";

        me.addListener(propertyChangeEvent, propertyChangeCallback);
        return function () {
            me.removeListener(propertyChangeEvent, propertyChangeCallback);
        }
    };

    Model.prototype.iziObserveWidget = function (eventConfig, action, scope, eventOptions) {
        var me = this,
            eventType = eventConfig.getEventType();

        me.addListener(eventType, action, scope);
        return function () {
            me.removeListener(eventType, action);
        }
    };

    /**
     * Exports all declared fields in `field: []` section using short getters like `firstName()`.
     *
     *     var User = izi.modelOf({
     *         fields: ["firstName", "lastName"]
     *     });
     *
     *     var john = new User().firstName("John").lastName("Smith");
     *     john.toPlainObject(); // {firstName: "John", lastName: "Smith"}
     *
     * When field value is an Array, then it will be converted to array of values. If any field or array item has
     * `.toPlainObject()` method, then it will be called to get result.
     *
     * Circular references between models are resolved as circular references between plain objects.
     *
     *     var TreeItem = izi.modelOf({
     *         fields: ["children", "parent"]
     *     });
     *
     *     var root = new TreeItem();
     *     var child1 = new TreeItem().parent(root);
     *     var child2 = new TreeItem().parent(root);
     *     root.children([child1, child2]);
     *
     *     root.toPlainObject(); // {children: [{parent: *refToRoot*},
     *                           //             {parent: *refToRoot*}] }
     *
     * If you have custom getter which is not declared in `fields` section you may override toPlainObject method:
     *
     *     var User = izi.modelOf({
     *         fields: ["firstName", "lastName"],
     *
     *         getFullName: function () {
     *             return this.firstName() + " " + this.lastName();
     *         },
     *
     *         toPlainObject: function () {
     *
     *             // call original implementation that converts firstName and lastName
     *             var plainObject = User.upper.toPlainObject.call(this);
     *
     *             // add your custom getters here
     *             plainObject.fullName = this.getFullName();
     *
     *             return plainObject;
     *         }
     *     });
     *
     *     var john = new User().firstName("John").lastName("Smith");
     *     john.toPlainObject(); // {firstName: "John", lastName: "Smith", fullName: "John Smith"}
     *
     * @returns {Object}
     * @since 1.5.0
     */
    Model.prototype.toPlainObject = function () {
        var result = {},
            arrayResult,
            circularCopyProp = "__iziCircularCopy__",
            wasVisited = circularCopyProp in this,
            cache = this[circularCopyProp];

        if (wasVisited) {
            return cache();
        }

        this[circularCopyProp] = function () {
            return result;
        };

        forEach(this.fields, function (field) {
            var value = this[field.getter]();

            if (hasToPlainObjectMethod(value)) {
                result[field.name] = value.toPlainObject();
            } else if (module.utils.typeOf(value) === "Array") {
                arrayResult = [];
                forEach(value, function (item) {
                    if (hasToPlainObjectMethod(item)) {
                        arrayResult.push(item.toPlainObject());
                    } else {
                        arrayResult.push(item);
                    }
                });
                result[field.name] = arrayResult;
            } else if (value && module.utils.typeOf(value.forEach) === "Function") {
                arrayResult = [];
                value.forEach(function (item) {
                    if (hasToPlainObjectMethod(item)) {
                        arrayResult.push(item.toPlainObject());
                    } else {
                        arrayResult.push(item);
                    }
                });
                result[field.name] = arrayResult;
            } else {
                result[field.name] = value;
            }
        }, this);

        delete this[circularCopyProp];
        return result;
    };

    /**
     * @private
     * @param config
     * @return {Function}
     */
    Model.define = function (config) {

        var fields = normalizeFields(config.fields),
            Class = function () {
                this.data = createInitialData(fields);
                this.fields = fields;
                Class.upper.constructor.apply(this);
            };
        module.utils.inherit(Class, Model);

        forEach(fields, function (field) {
            implementGetterAndSetter(Class, field.name, field.getter, field.setter);
        });

        for (var key in config) {
            if (module.utils.hasOwnProperty(config, key) && key != 'fields') {
                Class.prototype[key] = config[key];
            }
        }

        return Class;
    };


    module.model.Model = Model;

    /**
     * @event propertyNameChange
     * Fired when new value of property `"propertyName"` has been already set. Each property fires its own event so you should
     * register listener of `firstName` property using following code: `model.addListener("firstNameChange", handler)`
     *
     * @param {*} newValue new value
     * @param {*} oldValue current value
     */

    /**
     * @event change
     * Fired when new value of property has been already set.
     * @param {String} property property name that its value has changed
     * @param {*} newValue current value
     * @param {*} oldValue previous value
     */

    /** @ignore function: () { */
}(Izi);

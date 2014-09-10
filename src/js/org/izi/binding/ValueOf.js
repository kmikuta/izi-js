/**
 * @requires Binding.js
 */
!function (module) {

    /**
     * After `izi.bind().valueOf(widget)...` fluent API
     * @class Izi.binding.ValueOf
     * @constructor
     * @private
     * @param {Izi.binding.Config} config
     */
    var ValueOf = function Izi_binding_ValueOf(config) {
        this.config = config;
    };

    /**
     * Binding target setup.
     * You can pass directly target instance or object containing target on <strong>delegatedIn</strong> property.
     * 
     *     var label = new Label();
     *     var wrapper = {
     *         delegatedIn: label
     *     }
     *     izi.bind().valueOf(model).to(label, "text");
     *
     *     //will work also for:
     *     izi.bind().valueOf(model).to(wrapper, "text");
     * 
     * You can skip both parameters in order to more elegant notation:
     * 
     *     izi.bind().valueOf(model).to().textOf(label);
     * 
     *
     * As a target you can also use a function with given scope:
     *
     *     var scope = {
     *         firstName: null,
     *
     *         firstNameChangeHandler: function (value) {
     *             this.firstName = value;
     *         }
     *     }
     *
     *     izi.bind().valueOf(model, "firstName").to(scope.firstNameChangeHandler, scope);
     *     model.firstName("John");
     *
     * You can also skip the scope:
     *
     *     function firstNameChangeHandler(value) {
     *         console.log(value); // "John"
     *     }
     *
     *     izi.bind().valueOf(model, "firstName").to(firstNameChangeHandler);
     *     model.firstName("John");
     *
     * @member Izi.binding.ValueOf
     * @sanity izi.sanityOf("to()").args().args(izi.arg("targetFunction").ofFunction()).args(izi.arg("targetFunction").ofFunction(), izi.arg("scope").ofObject()).args(izi.arg("target").ofObject(), izi.arg("targetProperty").ofString()).args(izi.arg("target").ofObject().havingProperty("delegatedIn"), izi.arg("targetProperty").ofString()).check(arguments);
     * @param {Object/Function} [target] Model or widget or Function
     * @param {String/Object} [targetProperty] Target property name or Function scope
     * @return {Izi.binding.Binding|Izi.binding.ValueOf} `.to()` returns Izi.binding.ValueOf, `.to(target, "property")` returns Izi.binding.Binding
     */
    ValueOf.prototype.to = function (target, targetProperty) {
        if (arguments.length === 0) {
            return this;
        } else {
            return new module.binding.Binding(this.config.withTarget(target).withTargetProperty(targetProperty));
        }
    };

    /**
     * Binding target setup for 'value' property.
     *
     * @member Izi.binding.ValueOf
     * @sanity izi.sanityOf("valueOf()").args(izi.arg("target").ofObject()).args(izi.arg("target").ofObject().havingProperty("delegatedIn")).check(arguments);
     * @param {Object} target
     * @return {Izi.binding.Binding}
     */
    ValueOf.prototype.valueOf = function (target) {
        return this.to(target, "value");
    };

    /**
     * Binding target setup for 'text' property.
     *
     * @member Izi.binding.ValueOf
     * @sanity izi.sanityOf("textOf()").args(izi.arg("target").ofObject()).args(izi.arg("target").ofObject().havingProperty("delegatedIn")).check(arguments);
     * @param {Object} target
     * @return {Izi.binding.Binding}
     */
    ValueOf.prototype.textOf = function (target) {
        return this.to(target, "text");
    };

    /**
     * Binding target setup for 'selectedItems' property.
     *
     * @member Izi.binding.ValueOf
     * @sanity izi.sanityOf("selectedItemsOf()").args(izi.arg("target").ofObject()).args(izi.arg("target").ofObject().havingProperty("delegatedIn")).check(arguments);
     * @param {Object} target
     * @return {Izi.binding.Binding}
     */
    ValueOf.prototype.selectedItemsOf = function (target) {
        return this.to(target, "selectedItems");
    };

    /**
     * Formatter function which is used before set value on target.
     * If you specified more than one source properties - you must also specify formatter function.
     * 
     *     var fullNameFormatter = function (firstName, lastName) {
     *         return firstName + ' ' + lastName;
     *     }
     *     izi.bind().valueOf(model, 'firstName', 'lastName').through(fullNameFormatter)
     * 
     *
     * @member Izi.binding.ValueOf
     * @param {Function} formatter Function that combines all source values to one value
     * @return {Izi.binding.ValueOf}
     */
    ValueOf.prototype.through = function (formatter) {
        this.config.withFormatter(formatter);
        return this;
    };

    /**
     * Additional source property which change will trigger binding execution.
     * 
     *     var label = new Label();
     *     var model = new User();
     *     model.getFullName = function () {
     *       return this.get("firstName") + ' ' + this.get("lastName");
     *     }
     *
     *     izi.bind().valueOf(model, "fullName")
     *               .onChangeOf("firstName")
     *               .onChangeOf("lastName")
     *               .to().textOf(label);
     * 
     *
     * @member Izi.binding.ValueOf
     * @param {String} property Model property that triggers binding execution
     * @return {Izi.binding.ValueOf}
     */
    ValueOf.prototype.onChangeOf = function (property) {
        this.config.addTriggerProperty(property);
        return this;
    };

    module.binding.ValueOf = ValueOf;

}(Izi);
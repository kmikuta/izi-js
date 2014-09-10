/**
 * @requires ValueOf.js
 * @requires Config.js
 * @requires ../utils/getCallerLineProvider.js
 * @requires ../utils/forEach.js
 */
!function (module) {

    /**
     * After `izi.bind()...` fluent API
     * @class Izi.binding.Bind
     * @constructor
     * @private
     * @param {Izi.binding.Config} config
     */
    var Bind = function Izi_binding_Bind(config) {
        this.config = config;
    };

    /**
     * @param source
     * @param sourceProperty
     * @return {Izi.binding.ValueOf}
     * @private
     */
    Bind.prototype._valueOf = function (source, sourceProperty) {

        if (arguments.length > 2) {
            sourceProperty = Array.prototype.slice.call(arguments, 1);
        }
        var config = this.cloneConfig()
            .withSource(source)
            .withSourceProperties(sourceProperty || "value")
            .withCallerLineProvider(module.utils.getCallerLineProvider(2));

        return new module.binding.ValueOf(config);
    };

    /**
     * Binding source setup.
     *
     * You can pass directly source instance or object containing source on <strong>delegatedIn</strong> property.
     *
     *     var model = new User();
     *     var wrapper = {
     *         delegatedIn: model
     *     }
     *     izi.bind().valueOf(model, 'firstName');
     *
     *     // will work also for:
     *     izi.bind().valueOf(wrapper, 'firstName');
     *
     * You can also specify more than one property:
     *
     *     izi.bind().valueOf(model, 'firstName', 'lastName', 'title');
     *
     *
     * @sanity izi.sanityOf("valueOf()").args(izi.arg("source").ofObject()).args(izi.arg("source").ofObject().havingProperty("delegatedIn")).args(izi.arg("source").ofObject(), izi.varargOf(izi.arg("sourceProperty").ofString())).args(izi.arg("source").ofObject().havingProperty("delegatedIn"), izi.varargOf(izi.arg("sourceProperty").ofString())).check(arguments);
     * @member Izi.binding.Bind
     * @param {*} source Model or widget
     * @param {String...} [sourceProperty="value"] Property name or properties names
     * @return {Izi.binding.ValueOf}
     */
    Bind.prototype.valueOf = function (source, sourceProperty) {
        return this._valueOf.apply(this, arguments);
    };

    /**
     * Binding source setup for selected items of lists, grids, etc.
     * This is an alias to `this.valueOf(source, "selectedItems")`
     * You can pass directly model instance or object containing model on <strong>delegatedIn</strong> property.
     *
     *     var dataGrid = new DataGrid();
     *     var wrapper = {
     *         delegatedIn: dataGrid
     *     }
     *     izi.bind().selectedItemsOf(dataGrid);
     *
     *     // will work also for:
     *     izi.bind().selectedItemsOf(wrapper);
     *
     * @member Izi.binding.Bind
     * @sanity izi.sanityOf("selectedItemsOf()").args(izi.arg("source").ofObject()).args(izi.arg("source").ofObject().havingProperty("delegatedIn")).check(arguments);
     * @param {*} source Grid, list or any other 'selectedItems' holder
     * @return {Izi.binding.ValueOf}
     */
    Bind.prototype.selectedItemsOf = function (source) {
        return this._valueOf(source, "selectedItems");
    };

    /**
     * @member Izi.binding.Bind
     * @private
     * @return {Izi.binding.Config}
     */
    Bind.prototype.cloneConfig = function () {
        return new module.binding.Config(this.config.impl)
            .withBindings(this.config.bindings)
            .withOptions(this.config.options);
    };

    /**
     * Unbind all registered bindings created by one `izi.bind()` instance.
     *
     *     var model = new User();
     *     var firstNameEditor, lastNameEditor;
     *
     *     var bind = izi.bind();
     *
     *     bind.valueOf(model, "firstName").to().valueOf(firstNameEditor);
     *     bind.valueOf(model, "lastName").to().valueOf(lastNameEditor);
     *
     *     bind.unbindAll(); // will stop listening for changes of both properties (firstName and lastName)
     *
     * @since 1.1.0
     * @member Izi.binding.Bind
     */
    Bind.prototype.unbindAll = function () {
        module.utils.forEach(this.config.bindings, function (binding) {
            binding.unbind();
        })
    };

    /**
     * Execute manually all registered bindings created by one `izi.bind({auto: false})` instance.
     *
     *     var model = new User();
     *     var firstNameEditor, lastNameEditor;
     *
     *     var bind = izi.bind();
     *
     *     bind.valueOf(model, "firstName").to().valueOf(firstNameEditor);
     *     bind.valueOf(model, "lastName").to().valueOf(lastNameEditor);
     *
     *     bind.executeAll(); // will execute bindings for both properties (firstName and lastName)
     *
     * @since 1.1.0
     * @member Izi.binding.Bind
     */
    Bind.prototype.executeAll = function () {
        module.utils.forEach(this.config.bindings, function (binding) {
            binding.execute();
        })
    };

    module.binding.Bind = Bind;

}(Izi);
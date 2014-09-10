/**
 * @requires ../../Binding.js
 * @requires ../../Config.js
 * @requires ../../../utils/inherit.js
 * @requires ../../../model/Observable.js
 */
!function (module) {

    function extractFirstField(field) {
        if (field.indexOf(".") === -1) {
            return field;
        }
        return field.substr(0, field.indexOf("."));
    }

    function extractNextFields(field) {
        if (field.indexOf(".") === -1) {
            return undefined;
        }

        return field.substr(field.indexOf(".") + 1);
    }

    var NestedWatcher = function Izi_binding_impl_NestedWatcher(path, bindingImpl) {
        this.path = path;
        this.bindingImpl = bindingImpl;
        this.sourceProperty = extractFirstField(path);

        var nextFields = extractNextFields(path);
        if (nextFields) {
            this.child = new NestedWatcher(nextFields, this.bindingImpl);
            this.child.onValueChanged(this.fireChange, this);
        }

        NestedWatcher.upper.constructor.apply(this);
    };

    module.utils.inherit(NestedWatcher, module.model.Observable);


    NestedWatcher.prototype.setSource = function (source) {
        this.stopObserving();
        this.source = source;
        this.startObserving();
    };

    NestedWatcher.prototype.onValueChanged = function (callback, scope) {
        this.addListener("valueChanged", callback, scope);
    };

    NestedWatcher.prototype.stopObserving = function () {
        if (this.handler) {
            this.handler.unbind();
        }

        if (this.child) {
            this.child.stopObserving();
        }
    };

    NestedWatcher.prototype.startObserving = function () {
        if (this.source) {
            var config = new module.binding.Config(this.bindingImpl)
                .withOptions({allowNotWatchable: true})
                .withSource(this.source)
                .withSourceProperties(this.sourceProperty)
                .withTarget(this.valueChanged)
                .withTargetProperty(this);
            this.handler = new module.binding.Binding(config);
        } else {
            this.fireChange(undefined);
        }
    };

    NestedWatcher.prototype.valueChanged = function (value) {
        if (this.child) {
            this.child.setSource(value);
        } else {
            this.fireChange(value);
        }
    };

    NestedWatcher.prototype.fireChange = function (value) {
        this.dispatchEvent("valueChanged", [value]);
    };

    module.binding.impl.nested.NestedWatcher = NestedWatcher;

}(Izi);
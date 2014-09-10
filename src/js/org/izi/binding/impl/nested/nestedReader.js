/**
 * @requires NestedWatcher.js
 * @requires isNestedProperty.js
 * @requires ../createReader.js
 */
!function (module) {

    function watchForCurrentValue(object, property, bindingImpl) {
        var nestedWatcher;

        if (!object.iziNestedWatchers) {
            object.iziNestedWatchers = {};
        }

        if (!object.iziNestedWatchers[property]) {
            nestedWatcher = new module.binding.impl.nested.NestedWatcher(property, bindingImpl);
            nestedWatcher.onValueChanged(function (value) {
                this.currentValue = value;
            }, nestedWatcher);
            nestedWatcher.setSource(object);
            object.iziNestedWatchers[property] = nestedWatcher;
        }
    }

    function matcher(bindingImpl) {

        return function (object, property, type) {
            var isWatchableNestedProperty = type === "sourceReader" && module.binding.impl.nested.isNestedProperty(property);

            if (isWatchableNestedProperty) {
                watchForCurrentValue(object, property, bindingImpl);
            }

            return isWatchableNestedProperty;
        }
    }

    function reader(object, property) {
        return object.iziNestedWatchers[property].currentValue;
    }

    module.binding.impl.nested.nestedReader = function (bindingImpl) {
        return module.binding.impl.createReader(matcher(bindingImpl), reader);
    };

}(Izi);
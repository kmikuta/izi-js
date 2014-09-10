/**
 * @requires isNestedProperty.js
 * @requires ../createObserver.js
 * @requires ../../../utils/curry.js
 */
!function (module) {

    function matcher(source, sourceProperty, target, targetProperty, transferValueFn) {
        return module.binding.impl.nested.isNestedProperty(sourceProperty);
    }

    function observer(source, sourceProperty, target, targetProperty, transferValueFn) {

        var nestedWatcher = source.iziNestedWatchers[sourceProperty];
        nestedWatcher.onValueChanged(transferValueFn);

        return module.utils.curry(nestedWatcher.stopObserving, nestedWatcher);
    }

    module.binding.impl.nested.nestedObserver = module.binding.impl.createObserver(matcher, observer);

}(Izi);
/**
 * @requires createObserver.js
 */
!function(module) {

    function matcher(source, sourceProperty, target, targetProperty, transferValueFn) {
        return source.iziObserveProperty;
    }

    function observer(source, sourceProperty, target, targetProperty, transferValueFn) {
        return source.iziObserveProperty(sourceProperty, transferValueFn);
    }

    module.binding.impl.customPropertyObserver = module.binding.impl.createObserver(matcher, observer);
}(Izi);
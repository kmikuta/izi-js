!function (module) {
    module.binding.impl.createObserver = function (matcher, observer) {
        return function () {
            return matcher.apply(this, arguments) ? observer : null;
        }
    };
}(Izi);

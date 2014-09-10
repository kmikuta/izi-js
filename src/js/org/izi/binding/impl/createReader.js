!function (module) {
    module.binding.impl.createReader = function (matcher, reader) {
        return function () {
            return matcher.apply(this, arguments) ? reader : null;
        }
    };
}(Izi);
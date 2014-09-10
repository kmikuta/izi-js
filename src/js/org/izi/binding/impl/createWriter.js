!function(module) {
    module.binding.impl.createWriter = function (matcher, writer) {
        return function () {
            return matcher.apply(this, arguments) ? writer : null;
        }
    };
}(Izi);

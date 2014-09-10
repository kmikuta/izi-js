!function (module) {
    module.utils.inherit = function (Child, Parent) {
        var Proxy = function () {
        };
        Proxy.prototype = Parent.prototype;
        Child.prototype = new Proxy();
        Child.upper = Parent.prototype;
        Child.prototype.constructor = Child;
    };
}(Izi);
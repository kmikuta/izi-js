!function (module) {
    /**
     * @member Izi.utils
     * @method
     * @private
     * @param {Array} factories
     * @param {Array} args
     * @param {Object} scope
     */
    module.utils.findClosure = function Izi_utils_findClosure(factories, args, scope) {
        var i, factory, closure;
        for (i = 0; i < factories.length; i = i + 1) {
            factory = factories[i];
            closure = factory.apply(scope, args);
            if (closure) {
                return closure;
            }
        }

        throw new Error("Closure not found");
    };
}(Izi);
!function (module) {
    /**
     * @member Izi.utils
     * @method
     * @since 1.1.0
     * @private
     * @param {Function} fn
     * @param {Object} scope
     * @return {Function}
     */
    module.utils.curry = function (fn, scope) {
        return function () {
            fn.apply(scope, arguments);
        }
    };
}(Izi);
!function (module) {
    /**
     * @member Izi.utils
     * @method
     * @private
     * @param {Array} array
     * @param {Function} item
     * @param {Object} scope
     */
    module.utils.some = (function () {

        function bySome(array, fn, scope) {
            return Array.prototype.some.call(array, fn, scope);
        }

        function byLoop(array, fn, scope) {

            var len = array.length >>> 0;
            if (typeof fn != "function")
                throw new TypeError();

            for (var i = 0; i < len; i++) {
                if (i in array && fn.call(scope, array[i], i, array))
                    return true;
            }

            return false;
        }

        function hasSome() {
            return (typeof Array.prototype.some) === 'function';
        }

        return hasSome() ? bySome : byLoop;
    }());
}(Izi);
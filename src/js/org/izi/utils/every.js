!function (module) {
    /**
     * @member Izi.utils
     * @method
     * @private
     * @param {Array} array
     * @param {Function} item
     * @param {Object} scope
     */
    module.utils.every = (function () {

        function byEvery(array, fn, scope) {
            return Array.prototype.every.call(array, fn, scope);
        }

        function byLoop(array, fn, scope) {

            var len = array.length >>> 0;

            for (var i = 0; i < len; i++) {
                if (i in array && !fn.call(scope, array[i], i, array))
                    return false;
            }

            return true;
        }

        function hasEvery() {
            return (typeof Array.prototype.every) === 'function';
        }

        return hasEvery() ? byEvery : byLoop;
    }());
}(Izi);
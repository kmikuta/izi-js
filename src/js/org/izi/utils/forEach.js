!function (module) {
    /**
     * @member Izi.utils
     * @method
     * @private
     * @param {Array} array
     * @param {Function} item
     * @param {Object} scope
     */
    module.utils.forEach = (function () {

        function byForEach(array, fn, scope) {
            Array.prototype.forEach.call(array, fn, scope);
        }

        function byLoop(array, fn, scope) {
            var i,
                ln = array.length;

            for (i = 0; i < ln; i = i + 1) {
                fn.call(scope, array[i], i, array);
            }
        }

        function hasForEach() {
            return (typeof Array.prototype.forEach) === 'function';
        }

        return hasForEach() ? byForEach : byLoop;
    }());
}(Izi);
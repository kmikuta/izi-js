!function (module) {
    /**
     * @member Izi.utils
     * @method
     * @private
     * @param {Array} array
     * @param {*} item
     * @return {Number}
     */
    module.utils.indexOf = (function () {

        function byIndexOf(array, item) {
            return Array.prototype.indexOf.call(array, item);
        }

        function byLoop(array, item) {
            var i, ln = array.length;

            for (i = 0; i < ln; i = i + 1) {
                if (array[i] === item) {
                    return i;
                }
            }

            return -1;
        }

        function hasIndexOf() {
            return (typeof Array.prototype.indexOf) === 'function';
        }

        return hasIndexOf() ? byIndexOf : byLoop;
    }());

}(Izi);
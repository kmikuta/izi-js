/**
 * @ignore
 * @requires indexOf.js
 */
!function (module) {
    /**
     * @member Izi.utils
     * @method
     * @private
     * @param {Array} array
     * @param {*} item
     */
    module.utils.removeItem = function (array, item) {
        var start = module.utils.indexOf(array, item);
        if (start !== -1) {
            array.splice(start, 1);
        }
    };
}(Izi);
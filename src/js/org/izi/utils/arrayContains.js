/**
 * @requires indexOf.js
 */
!function (module) {
    /**
     * @member Izi.utils
     * @method
     * @private
     * @param {Array} array
     * @param {*} item
     * @return {Boolean}
     */
    module.utils.arrayContains = function (array, item) {
        return module.utils.indexOf(array, item) !== -1;
    };
}(Izi);
!function (module) {
    /**
     * @member Izi.utils
     * @method
     * @private
     * @param {Object} object host object
     * @param {String} property to be examined to
     */
    module.utils.hasOwnProperty = function (object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    };
}(Izi);
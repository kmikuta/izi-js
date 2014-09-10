!function (module) {
    /**
     * @member Izi.utils
     * @method
     * @private
     * @param {String} text
     * @return {String}
     */
    module.utils.capitalize = function (text) {
        return text.charAt(0).toUpperCase() + text.substr(1);
    };
}(Izi);
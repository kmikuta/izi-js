!function (module) {
    /**
     * @member Izi.utils
     * @method
     * @since 1.1.0
     * @private
     * @param {String} text
     * @return {String}
     */
    module.utils.trim = function (text) {
        return text.replace(/^\W+/, '').replace(/\W+$/, '');
    };
}(Izi);
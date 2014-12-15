/**
 * @ignore
 * @requires capitalize.js
 */
!function (module) {
    /**
     * @member Izi.utils
     * @method
     * @since 1.5.0
     * @private
     * @param {String} name
     * @return {String}
     */
    module.utils.setterOf = function (name) {
        return "set" + module.utils.capitalize(name);
    };
}(Izi);
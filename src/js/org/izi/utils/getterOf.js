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
    module.utils.getterOf = function (name) {
        return "get" + module.utils.capitalize(name);
    };
}(Izi);
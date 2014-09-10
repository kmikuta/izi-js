/**
 * @requires hasOwnProperty.js
 */
!function (module) {
    /**
     * @member Izi.utils
     * @method
     * @private
     * @param {Object...} vararg of any Objects
     */
    module.utils.mergeObjects = function () {

        function copyProperties(source, target) {
            for (var key in source) {
                if (module.utils.hasOwnProperty(source, key)) {
                    target[key] = source[key];
                }
            }
        }

        return function () {
            var result = {};
            for (var i = 0; i < arguments.length; i++) {
                copyProperties(arguments[i], result);
            }
            return result;
        }
    }();
}(Izi);
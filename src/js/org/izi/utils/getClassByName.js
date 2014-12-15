/**
 * @ignore
 * @requires forEach.js
 * @requires ClassNotFound.js
 */
!function (module) {
    /**
     * @member Izi.utils
     * @method
     * @private
     * @param {String} classString
     * @param {Object} globals
     * @return {Function}
     */
    module.utils.getClassByName = function (classString, globals) {
        var currentPart,
            parts = classString.split(".");
        currentPart = globals;

        module.utils.forEach(parts, function (part) {
            var nextPart = currentPart[part];
            if (nextPart === undefined) {
                throw new module.utils.ClassNotFound(classString);
            }
            currentPart = nextPart;
        });

        return currentPart;
    };
}(Izi);
!function (module) {
    /**
     * @param {String} classString
     * @private
     * @constructor
     */
    module.utils.ClassNotFound = function (classString) {
        this.message = "Class name given as string: \"" + classString + "\" couldn't be resolved as a class";
    };

    module.utils.ClassNotFound.prototype = new Error();
}(Izi);
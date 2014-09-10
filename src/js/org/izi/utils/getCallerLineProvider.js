!function (module) {
    /**
     * @member Izi.utils
     * @method
     * @private
     * @param {Number} stackOffset
     * @return {Function}
     */
    module.utils.getCallerLineProvider = function (stackOffset) {
        if (!module.isDebug) {
            return function () {
                return "Line numbers are available only in debug version of izi-js";
            }
        }
        var error = Error();

        return function getCallerLine() {
            if (error.stack) {
                // WebKit / FireFox / Opera
                var callStack = error.stack.split("\n");
                var index = navigator.userAgent.indexOf("WebKit") > -1
                    ? 3 + stackOffset // Chrome
                    : 1 + stackOffset; // Firefox and Opera
                return callStack[index];
            } else {
                // IE
                return " [IE doesn't provide line number in call stack]";
            }
        }
    }
}(Izi);
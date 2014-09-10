!function (module, global) {
    /**
     * @member Izi.utils
     * @method
     * @since 1.2.0
     * @private
     */
    var logImpl;
    if ("console" in global) {
        logImpl = function () {
            if (global.console.log.apply) {
                global.console.log.apply(global.console, arguments);
            } else {
                // IE :)
                global.console.log(Array.prototype.slice.call(arguments));
            }

        }
    } else {
        logImpl = function () {
            // no loggers other than window.console
        }
    }

    module.utils.log = function () {
        logImpl.apply(global, arguments);
    }

}(Izi, this);
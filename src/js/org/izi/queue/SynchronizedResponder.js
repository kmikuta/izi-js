/**
 * @ignore
 * @requires ../model/Observable.js
 * @requires ../utils/inherit.js
 */
!function (module) {

    /**
     * @class Izi.queue.SynchronizedResponder
     * @private
     * @constructor
     * @param {Object} responder
     * @param {String} [resultFunctionName="result"]
     * @param {String} [errorFunctionName="error"]
     */
    var SynchronizedResponder = function Izi_queue_SynchronizedResponder(responder, resultFunctionName, errorFunctionName) {
        SynchronizedResponder.upper.constructor.apply(this);

        var me = this;
        resultFunctionName = resultFunctionName || "result";
        errorFunctionName = errorFunctionName || "error";

        this.synchronizedResponder = {};
        this.synchronizedResponder[resultFunctionName] = function () {
            try {
                responder[resultFunctionName].apply(responder, arguments);
            } finally {
                me.dispatchEvent("synchronized", [me]);
            }
        };
        this.synchronizedResponder[errorFunctionName] = function () {
            try {
                responder[errorFunctionName].apply(responder, arguments);
            } finally {
                me.dispatchEvent("synchronized", [me]);
            }
        };
        this.logLabel = "synchronize.responder()";
    };

    module.utils.inherit(SynchronizedResponder, module.model.Observable);

    module.queue.SynchronizedResponder = SynchronizedResponder;
}(Izi);
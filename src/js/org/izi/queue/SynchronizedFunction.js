/**
 * @requires ../model/Observable.js
 * @requires ../utils/inherit.js
 */
!function (module) {

    /**
     * @class Izi.queue.SynchronizedFunction
     * @private
     * @param originalFunction
     * @param scope
     */
    var SynchronizedFunction = function Izi_queue_SynchronizedFunction(originalFunction, scope) {
        SynchronizedFunction.upper.constructor.apply(this);
        this.originalFunction = originalFunction;
        this.scope = scope;
        this.logLabel = "synchronize.onCallback()";
    };
    module.utils.inherit(SynchronizedFunction, module.model.Observable);

    /**
     * @member Izi.queue.SynchronizedFunction
     * @private
     * @return {Function}
     */
    SynchronizedFunction.prototype.synchronizedFunction = function () {
        try
        {
            if (this.originalFunction)
                return this.originalFunction.apply(this.scope, arguments);
        }
        finally
        {
            this.dispatchEvent("synchronized", [this]);
        }
    };

    module.queue.SynchronizedFunction = SynchronizedFunction;
}(Izi);
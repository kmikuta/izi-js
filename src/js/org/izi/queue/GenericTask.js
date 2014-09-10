!function (module) {

    /**
     * @class Izi.queue.GenericTask
     * @private
     * @constructor
     * @param functionToExecute
     * @param scope
     */
    var GenericTask = function Izi_queue_GenericTask(functionToExecute, scope) {
        this.functionToExecute = functionToExecute;
        this.scope = scope;
    };

    /**
     * @member Izi.queue.GenericTask
     * @private
     */
    GenericTask.prototype.execute = function () {
        this.functionToExecute.apply(this.scope, arguments);
    };

    module.queue.GenericTask = GenericTask;
}(Izi);
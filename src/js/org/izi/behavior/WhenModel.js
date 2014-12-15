/**
 * @ignore
 * @requires OnModel.js
 */
!function (module) {

    /**
     * After `izi.perform(behavior).whenChangeOf('firstName')...` behavior API
     * @class Izi.behavior.WhenModel
     * @constructor
     * @private
     * @param {Izi.behavior.Config} config
     */
    var WhenModel = function Izi_behavior_WhenModel(config) {
        this.config = config;
    };

    /**
     * Model declaration. You can pass directly model instance or object containing model on <strong>delegatedIn</strong> property.
     *
     *     var showFullName = new ShowFullName();
     *     var model = new UserModel();
     *     var wrapper = {
     *         delegatedIn: model
     *     };
     *
     *     izi.perform(showFullName).whenChangeOf('firstName', 'lastName').on(model);
     *
     *     // will work also for:
     *     izi.perform(showFullName).whenChangeOf('firstName', 'lastName').on(wrapper);
     *
     * @member Izi.behavior.WhenModel
     * @param {Object} model Model that should be observed for properties changes.
     * @return {Izi.behavior.OnModel}
     */
    WhenModel.prototype.on = function (model) {
        return new module.behavior.OnModel(this.config.withDispatcher(model));
    };

    module.behavior.WhenModel = WhenModel;

}(Izi);
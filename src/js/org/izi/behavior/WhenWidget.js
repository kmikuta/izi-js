/**
 * @ignore
 * @requires OnWidget.js
 */
!function (module) {

    /**
     * After `izi.perform(behavior).when('click')...` behavior API
     * @class Izi.behavior.WhenWidget
     * @constructor
     * @private
     * @param {Izi.behavior.Config} config
     */
    var WhenWidget = function Izi_behavior_WhenWidget(config) {
        this.config = config;
    };

    /**
     * Widget declaration. You can pass directly widget instance or object containing widget on **delegatedIn** property.
     *
     *     var showMessage = new ShowMessage();
     *     var button = new Button();
     *     var wrapper = {
     *         delegatedIn: button
     *     };
     *
     *     izi.perform(showMessage).when('click').on(button);
     *
     *     // will work also for:
     *     izi.perform(showMessage).when('click').on(wrapper);
     *
     *
     * @member Izi.behavior.WhenWidget
     * @param {*} widget Widget that should be observed.
     * @return {Izi.behavior.OnWidget}
     */
    WhenWidget.prototype.on = function (widget) {
        return new module.behavior.OnWidget(this.config.withDispatcher(widget));
    };

    module.behavior.WhenWidget = WhenWidget;

}(Izi);
/**
 * @ignore
 * @requires ../utils/forEach.js
 */
!function (module) {

    /**
     * After <code>izi.perform(behavior).whenChangeOf('property1', 'property2').on(model)...</code> behavior API
     * @class Izi.behavior.OnModel
     * @constructor
     * @private
     * @param {Izi.behavior.Config} config
     */
    module.behavior.OnModel = function Izi_behavior_OnModel(config) {
        var action = config.getAction(),
            scope = config.getScope(),
            model = config.getDispatcher(),
            modelProperties = config.getModelProperties(),
            bindings = [];

        config.behavior = this;

        function triggerAction() {
            action.apply(scope, arguments);
        }

        module.utils.forEach(modelProperties, function (property) {
            bindings.push(config.iziApi.bind({executeAtStartup: false}).valueOf(model, property).to(triggerAction));
        });

        /**
         * Stops observing the model
         */
        this.stopObserving = function () {
            module.utils.forEach(bindings, function (binding) {
                binding.unbind();
            });
        };
    };

}(Izi);
/**
 * @ignore
 * @requires Perform.js
 * @requires Config.js
 * @requires ../utils/forEach.js
 */
!function(module) {

    /**
     * @member Izi.behavior
     * @method
     * @private
     * @param {Object} impl
     * @param {izi} iziApi
     */
    module.behavior.register = function (impl, iziApi) {

        if (!impl.defaultPerformFunction) {
            throw new Error("Behavior implementation must have defined property: defaultPerformFunction: 'someFunctionName'");
        }
        if (!impl.observeWidget) {
            throw new Error("Behavior implementation must have defined function observeWidget (widget, eventConfig, action, scope, options)");
        }
        if (!impl.observeKeyStroke) {
            throw new Error("Behavior implementation must have defined function observeKeyStroke (widget, keyboardConfig, action, scope, options)");
        }

        /**
         * @ignore
         * @sanity izi.sanityOf("izi.perform()").args().args(izi.arg("behavior").ofObject().havingFunction(impl.defaultPerformFunction)).args(izi.arg("behaviorWrapper").ofObject().havingProperty("delegatedIn")).args(izi.arg("callback").ofFunction()).args(izi.arg("callback").ofFunction(), izi.arg("scope").ofObject()).args(izi.arg("registrar").ofObject().havingFunctions("register", "unregister")).check(arguments);
         */
        return function (action, scope) {

            if (arguments.length === 0) {
                var configs = [];

                var registerBehaviors = function (action, scope) {
                    var config = new module.behavior.Config(impl, iziApi).withAction(action).withScope(scope);
                    configs.push(config);
                    return new module.behavior.Perform(config);
                };

                registerBehaviors.stopObserving = function () {
                    module.utils.forEach(configs, function (config) {
                        config.behavior.stopObserving();
                    });
                };

                return registerBehaviors;
            }

            return new module.behavior.Perform(new module.behavior.Config(impl, iziApi).withAction(action).withScope(scope));
        };
    };
}(Izi);
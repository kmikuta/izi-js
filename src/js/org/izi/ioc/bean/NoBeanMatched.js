!function(module) {
    /**
     * @private
     * @param {String|Function} beanIdOrType
     * @constructor
     */
    module.ioc.bean.NoBeanMatched = function (beanIdOrType) {
        this.message = "No bean matched: " + beanIdOrType;
    };
}(Izi);
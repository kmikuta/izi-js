!function(module){
    /**
     * Ready instance strategy used in {@link Izi.ioc.bean.BeanBuilder}
     * @class Izi.ioc.bean.InstanceStrategy
     * @private
     * @constructor
     * @param {*} instance
     */
    var InstanceStrategy = function Izi_ioc_bean_InstanceStrategy(instance) {
        this.instance = instance;
    };

    InstanceStrategy.prototype.init = function (beansContext) {
        return this.instance;
    };

    InstanceStrategy.prototype.create = function (beansContext) {
        return this.instance;
    };

    InstanceStrategy.prototype.matchesByType = function (type) {
        return this.instance instanceof type;
    };

    InstanceStrategy.prototype.getArguments = function () {
        return [];
    };

    module.ioc.bean.InstanceStrategy = InstanceStrategy;
}(Izi);
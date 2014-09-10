/**
 * @requires createInstance.js
 */
!function(module) {
    /**
     * Prototype strategy used in {@link Izi.ioc.bean.BeanBuilder}
     * @class Izi.ioc.bean.PrototypeStrategy
     * @private
     * @constructor
     * @param {Izi.ioc.Config} config
     */
    var PrototypeStrategy = function Izi_ioc_bean_PrototypeStrategy(config) {
        this.Clazz = config.getClazz();
        this.args = config.getArguments();
        this.props = config.getProperties();
    };

    PrototypeStrategy.prototype.init = function (beansContext) {
        return null;
    };

    PrototypeStrategy.prototype.create = function (beansContext) {
        return module.ioc.bean.createInstance(this.Clazz, this.args, this.props, beansContext);
    };

    PrototypeStrategy.prototype.matchesByType = function (type) {
        return type === this.Clazz;
    };

    PrototypeStrategy.prototype.getArguments = function () {
        return this.args;
    };

    module.ioc.bean.PrototypeStrategy = PrototypeStrategy;
}(Izi);
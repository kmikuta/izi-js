/**
 * @ignore
 * @requires createInstance.js
 */
!function (module) {

    /**
     * Singleton strategy used in {@link Izi.ioc.bean.BeanBuilder}
     * @class Izi.ioc.bean.SingletonStrategy
     * @private
     * @constructor
     * @param {Izi.ioc.Config} config
     */
    var SingletonStrategy = function Izi_ioc_bean_SingletonStrategy(config) {
        this.Clazz = config.getClazz();
        this.args = config.getArguments();
        this.props = config.getProperties();
        this.instance = undefined;
    };

    SingletonStrategy.prototype.createInstance = function (beansContext) {
        if (!this.instance) {
            this.instance = module.ioc.bean.createInstance(this.Clazz, this.args, this.props, beansContext);
        }

        return this.instance;
    };

    SingletonStrategy.prototype.init = function (beansContext) {
        return this.createInstance(beansContext);
    };

    SingletonStrategy.prototype.create = function (beansContext) {
        return this.createInstance(beansContext);
    };

    SingletonStrategy.prototype.matchesByType = function (type) {
        return type === this.Clazz;
    };

    SingletonStrategy.prototype.getArguments = function () {
        return this.args;
    };

    module.ioc.bean.SingletonStrategy = SingletonStrategy;
}(Izi);
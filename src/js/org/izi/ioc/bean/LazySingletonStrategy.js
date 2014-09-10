/**
 * @requires createInstance.js
 */
!function(module) {
    /**
     * Lazy Singleton strategy used in {@link Izi.ioc.bean.BeanBuilder}
     * @class Izi.ioc.bean.LazySingletonStrategy
     * @private
     * @constructor
     * @param {Izi.ioc.Config} config
     */
    var LazySingletonStrategy = function Izi_ioc_bean_LazySingletonStrategy(config) {
        this.Clazz = config.getClazz();
        this.args = config.getArguments();
        this.props = config.getProperties();
        this.instance = undefined;
    };

    LazySingletonStrategy.prototype.init = function (context) {
        return null;
    };

    LazySingletonStrategy.prototype.create = function (context) {
        if (!this.instance) {
            this.instance = module.ioc.bean.createInstance(this.Clazz, this.args, this.props, context);
        }

        return this.instance;
    };

    LazySingletonStrategy.prototype.matchesByType = function (type) {
        return type === this.Clazz;
    };

    LazySingletonStrategy.prototype.getArguments = function () {
        return this.args;
    };
    
    module.ioc.bean.LazySingletonStrategy = LazySingletonStrategy;
}(Izi);
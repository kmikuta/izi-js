/**
 * @ignore
 * @requires ../utils/typeOf.js
 * @requires ../utils/getClassByName.js
 */
!function (module) {

    /**
     * Configuration used in IoC/DI fluent API
     * @class Izi.ioc.Config
     * @constructor
     * @private
     * @param {Function|String|Object} Class Class constructor, dotted class definition string or ready instance of bean
     * @param {Function} Strategy Strategy constructor
     * @param {Object} globals
     */
    var Config = function Izi_ioc_Config(Class, Strategy, globals) {
        this.Clazz = this._resolveClass(Class, globals);
        this.Strategy = Strategy;
        this.args = [];
    };

    /**
     * @member Izi.ioc.Config
     * @private
     * @return {*}
     */
    Config.prototype.createStrategy = function () {
        return new this.Strategy(this);
    };

    /**
     * @member Izi.ioc.Config
     * @private
     * @return {Array}
     */
    Config.prototype.getArguments = function () {
        return this.args;
    };

    /**
     * @member Izi.ioc.Config
     * @private
     * @return {Array}
     */
    Config.prototype.getProperties = function () {
        return this.props;
    };

    /**
     * @member Izi.ioc.Config
     * @private
     * @return {Function|String|Object}
     */
    Config.prototype.getClazz = function () {
        return this.Clazz;
    };

    /**
     * Arguments that will be used to object creation. It accept also {@link izi#inject izi.inject()} values.
     *     izi.bakeBeans({
     *         bean: izi.instantiate(Class).withArgs("Value", izi.inject("beanId")
     *     });
     *
     * @member Izi.ioc.Config
     * @noSanity
     * @param {Object...|Izi.ioc.Injection...} vararg arguments
     * @return {Izi.ioc.Config}
     */
    Config.prototype.withArgs = function () {
        if (arguments.length > 10) {
            throw new Error("Too many arguments passed. Ten arguments is maximum.");
        }

        this.args = arguments;
        return this;
    };

    /**
     * Properties that will be used to overwrite on created bean. It accept also {@link izi#inject izi.inject()} values.
     *     izi.bakeBeans({
     *         bean: izi.instantiate(Class).withProps({field1: "Value 1", field2: izi.inject("beanId")})
     *     });
     *
     * @member Izi.ioc.Config
     * @noSanity
     * @param {Object} props Map of property=>value used to overwrite on bean
     * @return {Izi.ioc.Config}
     */
    Config.prototype.withProps = function (props) {
        this.props = props;
        return this;
    };

    Config.prototype._resolveClass = function (Class, globals) {
        if (module.utils.typeOf(Class) === "String") {
            Class = module.utils.getClassByName(Class, globals);
        }
        return Class;
    };

    module.ioc.Config = Config;
}(Izi);
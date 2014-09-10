/**
 * @requires ../utils/getCallerLineProvider.js
 * @requires ../utils/ClassNotFound.js
 * @requires bean/NoBeanMatched.js
 */
!function (module) {

    /**
     * Injection marker for beans arguments and properties.
     * @class Izi.ioc.Injection
     * @constructor
     * @private
     * @param {String|Function} beanIdOrType Bean id or constructor function or dotted string class definition
     */
    var Injection = function Izi_ioc_Injection(beanIdOrType) {
        this.beanIdOrType = beanIdOrType;
        this.getCallerLine = module.utils.getCallerLineProvider(2);
    };

    /**
     * @member Izi.ioc.Injection
     * @private
     * @return {String}
     */
    Injection.prototype.getBeanNotFoundMessage = function() {
        return "Bean couldn't be found from injection at line:\n" + this.getCallerLine();
    };

    /**
     * Delegates get bean
     * @member Izi.ioc.Injection
     * @private
     * @param {Izi.ioc.BeansContext} beansContext
     * @return {*}
     */
    Injection.prototype.resolveBean = function (beansContext) {
        var bean;
        try {
            bean = beansContext.getBean(this.beanIdOrType);
        } catch (e) {
            if (e instanceof module.utils.ClassNotFound || e instanceof module.ioc.bean.NoBeanMatched) {
                throw new Error(this.getBeanNotFoundMessage());
            }
            else {
                throw e;
            }
        }
        return bean;
    };

    /**
     * Delegates find bean builder
     * @member Izi.ioc.Injection
     * @private
     * @param {Izi.ioc.BeansContext} beansContext
     * @return {Izi.ioc.bean.BeanBuilder}
     */
    Injection.prototype.findBeanBuilder = function (beansContext) {
        var beanBuilder = beansContext.findBeanBuilder(this.beanIdOrType);
        if (beanBuilder === null) {
            throw new Error(this.getBeanNotFoundMessage());
        }
        return beanBuilder;
    };

    /**
     * Marker field to use instead of: ... instanceof Izi.ioc.Injection
     * @member Izi.ioc.Injection
     * @private
     * @type {Boolean}
     */
    Injection.prototype.isIziInjection = true;

    module.ioc.Injection = Injection;
}(Izi);
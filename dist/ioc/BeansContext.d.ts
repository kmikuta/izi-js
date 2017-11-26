import { BeanBuilder } from './bean/BeanBuilder';
import { Bean, BeanIdentity, BeansConfig } from './types';
import { Observable } from '../utils/Observable';
/**
 * BeansContext instance is returned by {@link Api#bakeBeans izi.bakeBeans()} function. It is also available
 * in <code>.iziContext(context)</code> function implemented on any bean, ie:
 *
 *     izi.bakeBeans({
 *
 *         bean: izi.instantiate(SomeDependency),
 *
 *         myBean: {
 *
 *             dependency: izi.inject(SomeDependency),
 *
 *             iziContext: function (context) {
 *                 // iziContext function is called when all dependencies are provided and ready to use
 *             }
 *
 *             iziInit: function () {
 *                 // iziInit() is called after iziContext()
 *             }
 *         }
 *     });
 *
 *  When you have BeansContext reference, you can:
 *
 *   * wire dependencies to object created outside the context: <code>context.wire(objectContainingIziInjects)</code>
 *   * create descendant context: <code>izi.bakeBeans({...}, parentContext);</code>
 *   * destroy context: <code>context.destroy()</code>
 *
 */
export declare class BeansContext {
    parentContext: BeansContext;
    destroyDispatcher: Observable;
    private beans;
    private beansBuilders;
    constructor(beans: BeansConfig | BeansConfig[], parentContext?: BeansContext);
    /**
     * Find bean by its id or class name
     */
    getBean(beanIdOrType: BeanIdentity): Bean;
    /**
     * Injects needed dependencies from this context into passed object.
     */
    wire(objectContainingIziInjects: any): Bean;
    /**
     * Detaches bean wired by context.wire() to prevent memory leaks.
     */
    detachBean(bean: Bean): void;
    /**
     * Destroys beans context and all descendant contexts. First it calls <code>.iziPreDestroy()</code> method on every
     * created bean if implemented. Throwing an error inside <code>.iziPreDestroy()</code> stops destroying the context.
     * After calling <code>.iziPreDestroy()</code> izi calls <code>.iziDestroy()</code> methods on every created bean
     * if implemented. All thrown errors inside <code>.iziDestroy()</code> are caught and ignored.
     *
     * <code>.iziDestroy()</code> is a place where you should unregister all event listeners added within its class.
     *
     *     var context = izi.bakeBeans({
     *
     *         someBean: {
     *
     *             iziInit: function () {
     *                 var bind = this.bind = izi.bind();
     *
     *                 bind.valueOf(loginInput).to(model, "login");
     *                 bind.valueOf(passwordInput).to(model, "password");
     *
     *                 this.login = izi.perform(doLogin).when("click").on(loginButton);
     *             },
     *
     *             iziPreDestroy: function () {
     *                 // you can throw new Error() here if you don't want to destroy context for any reason
     *             }
     *
     *             iziDestroy: function () {
     *                 this.bind.unbindAll();
     *                 this.login.stopObserving();
     *             }
     *         }
     *     });
     *
     *     context.destroy();
     *
     */
    destroy(): boolean;
    doDestroy(): boolean;
    /**
     * Find bean builder by its id or type
     * @private
     */
    findBeanBuilder(beanIdOrType: BeanIdentity): BeanBuilder;
}

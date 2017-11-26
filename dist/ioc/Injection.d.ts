import { Bean, BeanIdentity } from './types';
import { BeansContext } from './BeansContext';
import { BeanBuilder } from './bean/BeanBuilder';
export declare type Injector = (target: Object, prop: string, dependency: any) => void;
export declare type DependencyConverter = (dependency: any) => any;
/**
 * Injection marker for beans arguments and properties.
 */
export declare class Injection {
    isIziInjection: boolean;
    beanIdOrType: BeanIdentity;
    getCallerLine: Function;
    injector: Injector;
    dependencyConverter: DependencyConverter;
    constructor(beanIdOrType: BeanIdentity);
    getBeanNotFoundMessage(): string;
    /**
     * Delegates get bean
     */
    resolveBean(beansContext: BeansContext): Bean;
    /**
     * Warning: use only for property injection! It doesn't work for constructor argument injection.
     *
     * The default property injection just set dependency as property in following code:
     *
     *     function defaultInjector(target, prop, dependency) {
     *         target[prop] = dependency;
     *     }
     *
     * If you want to inject dependency in different way you may use custom injector function:
     *
     *     userModel: izi.inject("userModel").by(function (target, prop, dependency) {
     *         target.setUserModel(dependency);
     *     });
     *
     * Notice: `dependency` argument is processed by dependency converter set by `.through()` or set by `.property()`
     *
     */
    by(injector: Injector): Injection;
    /**
     * The default dependency converter returns just the dependency as in following code:
     *
     *     function defaultDependencyConverter(dependency) {
     *         return dependency;
     *     }
     *
     * If you want to inject transformed dependency, you may use custom dependency converter:
     *
     *     userModel: izi.inject("userModel").trough(function (dependency) {
     *         return dependency.toJSON();
     *     });
     *
     */
    through(dependencyConverter: DependencyConverter): Injection;
    /**
     * Inject value of `dependency[property]` instead of `dependency`
     *
     *     firstName: izi.inject("userModel").property("firstName")
     *
     */
    property(property: string): Injection;
    /**
     * Delegates find bean builder
     */
    findBeanBuilder(beansContext: BeansContext): BeanBuilder;
}

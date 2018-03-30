import { BeanIdentity, DecoratorInjectionConfig } from '../types';
export declare function inject(beanIdOrType: BeanIdentity, injectionConfig?: DecoratorInjectionConfig): (target: Element, propertyKey: string) => void;

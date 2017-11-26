import { Bean, BeanCreationStrategy, ClassConstructor } from '../types';
import { BeansContext } from '../BeansContext';
import { Config } from '../Config';
export declare class LazySingletonStrategy implements BeanCreationStrategy {
    Clazz: ClassConstructor;
    args: Array<any>;
    props: Object;
    instance: Bean;
    constructor(config: Config);
    init(): Bean;
    create(beansContext: BeansContext): Bean;
    matchesByType(type: Function): boolean;
    getArguments(): Array<any>;
}

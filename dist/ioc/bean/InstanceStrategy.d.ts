import { Bean, BeanCreationStrategy } from '../types';
export declare class InstanceStrategy implements BeanCreationStrategy {
    instance: Object;
    constructor(instance: Object);
    init(): Bean;
    create(): Bean;
    matchesByType(type: Function): boolean;
    getArguments(): Array<any>;
}

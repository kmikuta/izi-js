import { Bean, BeanCreationStrategy, BeanIdentity } from '../types';
import { BeansContext } from '../BeansContext';
export declare class BeanBuilder {
    id: string;
    strategy: BeanCreationStrategy;
    createdBeans: Bean[];
    constructor(id: string, strategy: BeanCreationStrategy);
    /**
     * Delegates init on strategy
     */
    init(beansContext: BeansContext): Bean;
    /**
     * Delegates create on strategy
     */
    create(beansContext: BeansContext): Bean;
    destroyCreatedBeans(): void;
    /**
     * Matches factory by id or class type
     */
    matches(idOrType: BeanIdentity): boolean;
    /**
     * Matches whether bean has been created by this bean builder
     */
    matchesBeanInstance(bean: Bean): boolean;
    /**
     * Get bean factories that are set as argument dependencies
     */
    getArgumentsDependencies(context: BeansContext): Array<any>;
}

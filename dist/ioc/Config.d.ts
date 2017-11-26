import { AnyArgs, AnyProps, BeanCreationStrategy, ClassConstructor, StrategyClass } from './types';
export declare class Config {
    private Clazz;
    private Strategy;
    private args;
    private props;
    constructor(Class: ClassConstructor, Strategy: StrategyClass);
    createStrategy(): BeanCreationStrategy;
    getArguments(): AnyArgs;
    getProperties(): AnyProps;
    getClazz(): ClassConstructor;
    /**
     * Arguments that will be used to object creation. It accept also {@link izi#inject izi.inject()} values.
     *     izi.bakeBeans({
     *         bean: izi.instantiate(Class).withArgs("SomeValue", izi.inject("beanId"))
     *     });
     */
    withArgs(...args: AnyArgs): Config;
    /**
     * Properties that will be used to overwrite on created bean. It accept also {@link izi#inject izi.inject()} values.
     *     izi.bakeBeans({
     *         bean: izi.instantiate(Class).withProps({field1: "Value 1", field2: izi.inject("beanId")})
     *     });
     */
    withProps(props: AnyProps): Config;
}

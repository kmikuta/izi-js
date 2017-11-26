import { AnyArgs, AnyProps, BeanCreationStrategy, ClassConstructor, StrategyClass } from './types'

export class Config {
  private Clazz: ClassConstructor
  private Strategy: StrategyClass
  private args: AnyArgs = []
  private props: AnyProps

  constructor (Class: ClassConstructor, Strategy: StrategyClass) {
    this.Clazz = Class
    this.Strategy = Strategy
  }

  createStrategy (): BeanCreationStrategy {
    return new this.Strategy(this)
  }

  getArguments (): AnyArgs {
    return this.args
  }

  getProperties (): AnyProps {
    return this.props
  }

  getClazz (): ClassConstructor {
    return this.Clazz
  }

  /**
   * Arguments that will be used to object creation. It accept also {@link izi#inject izi.inject()} values.
   *     izi.bakeBeans({
   *         bean: izi.instantiate(Class).withArgs("SomeValue", izi.inject("beanId"))
   *     });
   */
  withArgs (...args: AnyArgs): Config {
    if (args.length > 10) {
      throw new Error('Too many arguments passed. Ten arguments is maximum.')
    }

    this.args = args
    return this
  }

  /**
   * Properties that will be used to overwrite on created bean. It accept also {@link izi#inject izi.inject()} values.
   *     izi.bakeBeans({
   *         bean: izi.instantiate(Class).withProps({field1: "Value 1", field2: izi.inject("beanId")})
   *     });
   */
  withProps (props: AnyProps): Config {
    this.props = props
    return this
  }
}

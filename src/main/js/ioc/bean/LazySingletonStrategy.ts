import { Bean, BeanCreationStrategy, ClassConstructor } from '../types'
import { BeansContext } from '../BeansContext'
import { createInstance } from './createInstance'
import { Config } from '../Config'

export class LazySingletonStrategy implements BeanCreationStrategy {
  Clazz: ClassConstructor
  args: Array<any>
  props: Object
  instance: Bean

  constructor (config: Config) {
    this.Clazz = config.getClazz()
    this.args = config.getArguments()
    this.props = config.getProperties()
    this.instance = undefined
  }

  init (): Bean {
    return null
  }

  create (beansContext: BeansContext): Bean {
    if (!this.instance) {
      this.instance = createInstance(this.Clazz, this.args, this.props, beansContext)
    }

    return this.instance
  }

  matchesByType (type: Function): boolean {
    return type === this.Clazz
  }

  getArguments (): Array<any> {
    return this.args
  }
}

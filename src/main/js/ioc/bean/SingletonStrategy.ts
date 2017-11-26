import { createInstance } from './createInstance'
import { Bean, BeanCreationStrategy, ClassConstructor } from '../types'
import { BeansContext } from '../BeansContext'
import { Config } from '../Config'

export class SingletonStrategy implements BeanCreationStrategy {
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

  init (beansContext: BeansContext): Bean {
    return this.createInstance(beansContext)
  }

  create (beansContext: BeansContext): Bean {
    return this.createInstance(beansContext)
  }

  matchesByType (type: Function): boolean {
    return type === this.Clazz || this.instance instanceof type
  }

  getArguments (): Array<any> {
    return this.args
  }

  createInstance (beansContext: BeansContext): Bean {
    if (!this.instance) {
      this.instance = createInstance(this.Clazz, this.args, this.props, beansContext)
    }

    return this.instance
  }
}

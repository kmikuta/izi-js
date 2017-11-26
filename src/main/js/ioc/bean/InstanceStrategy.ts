import { Bean, BeanCreationStrategy } from '../types'

export class InstanceStrategy implements BeanCreationStrategy {
  instance: Object

  constructor (instance: Object) {
    this.instance = instance
  }

  init (): Bean {
    return this.instance as Bean
  }

  create (): Bean {
    return this.instance as Bean
  }

  matchesByType (type: Function) {
    return this.instance instanceof type
  }

  getArguments (): Array<any> {
    return []
  }
}

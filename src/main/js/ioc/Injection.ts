import { Bean, BeanIdentity } from './types'
import { BeansContext } from './BeansContext'
import { BeanBuilder } from './bean/BeanBuilder'
import { typeOf } from '../utils/typeOf'
import { getCallerLineProvider } from '../utils/getCallerLineProvider'
import { ClassNotFound } from '../utils/ClassNotFound'
import { NoBeanMatched } from './bean/NoBeanMatched'

export type Injector = (target: Object, prop: string, dependency: any) => void
export type DependencyConverter = (dependency: any) => any

/**
 * Injection marker for beans arguments and properties.
 */
export class Injection {
  isIziInjection: boolean = true
  beanIdOrType: BeanIdentity
  getCallerLine: Function
  injector: Injector
  dependencyConverter: DependencyConverter

  constructor (beanIdOrType: BeanIdentity) {
    this.beanIdOrType = beanIdOrType
    this.getCallerLine = getCallerLineProvider(2)
    this.injector = defaultInjector
    this.dependencyConverter = defaultDependencyConverter
  }

  getBeanNotFoundMessage (): string {
    let beanName: string = ''
    if (typeOf(this.beanIdOrType) === 'Function') {
      beanName = (this.beanIdOrType as any).name || this.beanIdOrType as string
    } else {
      beanName = this.beanIdOrType as string
    }
    return 'Bean: `' + beanName + '` couldn\'t be found from injection at line:\n' + this.getCallerLine()
  }

  /**
   * Delegates get bean
   */
  resolveBean (beansContext: BeansContext): Bean {
    let bean
    try {
      bean = beansContext.getBean(this.beanIdOrType)
    } catch (e) {
      if (e instanceof ClassNotFound || e instanceof NoBeanMatched) {
        throw new Error(this.getBeanNotFoundMessage())
      } else {
        throw e
      }
    }
    return this.dependencyConverter(bean)
  }

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
  by (injector: Injector): Injection {
    if (typeOf(injector) !== 'Function') {
      throw new Error('Injector should be a function with target, prop, dependency arguments')
    }
    this.injector = injector
    return this
  }

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
  through (dependencyConverter: DependencyConverter): Injection {
    if (typeOf(dependencyConverter) !== 'Function') {
      throw new Error('Dependency converter should be a function with dependency argument')
    }
    this.dependencyConverter = dependencyConverter
    return this
  }

  /**
   * Inject value of `dependency[property]` instead of `dependency`
   *
   *     firstName: izi.inject("userModel").property("firstName")
   *
   */
  property (property: string): Injection {
    return this.through(function (dependency) {
      return dependency[property]
    })
  }

  /**
   * Delegates find bean builder
   */
  findBeanBuilder (beansContext: BeansContext): BeanBuilder {
    const beanBuilder = beansContext.findBeanBuilder(this.beanIdOrType)
    if (beanBuilder === null) {
      throw new Error(this.getBeanNotFoundMessage())
    }
    return beanBuilder
  }
}

function defaultInjector (target: any, prop: string, dependency: Bean): void {
  target[prop] = dependency
}

function defaultDependencyConverter (dependency: Bean): any {
  return dependency
}

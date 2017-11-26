import { Bean, BeanCreationStrategy, BeanIdentity } from '../types'
import { BeansContext } from '../BeansContext'
import { forEach } from '../../utils/lodash/forEach'
import { some } from '../../utils/lodash/some'
import { typeOf } from '../../utils/typeOf'

export class BeanBuilder {
  id: string
  strategy: BeanCreationStrategy
  createdBeans: Bean[]

  constructor (id: string, strategy: BeanCreationStrategy) {
    this.id = id
    this.strategy = strategy
    this.createdBeans = []
  }

  /**
   * Delegates init on strategy
   */
  init (beansContext: BeansContext): Bean {
    return this.strategy.init(beansContext)
  }

  /**
   * Delegates create on strategy
   */
  create (beansContext: BeansContext): Bean {
    const bean = this.strategy.create(beansContext)

    if (bean.iziInjectingInProgress) {
      return bean
    }

    injectDependenciesOnProperties(beansContext, bean)

    if (bean.iziContext && !bean.iziContextCalled) {
      bean.iziContextCalled = true
      bean.iziContext(beansContext)
    }
    if (bean.iziInit && !bean.iziInitCalled) {
      bean.iziInitCalled = true
      bean.iziInit()
    }

    this.createdBeans.push(bean)

    return bean
  }

  destroyCreatedBeans (): void {
    forEach(this.createdBeans, function (createdBean: Bean) {
      if (createdBean.iziDestroy) {
        try {
          createdBean.iziDestroy()
        } catch (e) {
          // ignore
        }
      }
    })

    delete this.id
    delete this.strategy
    delete this.createdBeans
  }

  /**
   * Matches factory by id or class type
   */
  matches (idOrType: BeanIdentity): boolean {
    if (typeof idOrType === 'string') {
      return matchesById(this.id, idOrType)
    } else {
      return matchesByType(this.strategy, idOrType)
    }
  }

  /**
   * Matches whether bean has been created by this bean builder
   */
  matchesBeanInstance (bean: Bean): boolean {
    return some(this.createdBeans || [], function (createdBean: Bean): boolean {
      return createdBean === bean
    })
  }

  /**
   * Get bean factories that are set as argument dependencies
   */
  getArgumentsDependencies (context: BeansContext): Array<any> {
    function findArgumentsDependencies (args: Array<any>): Array<any> {
      const results: Array<any> = []
      forEach(args, function (arg) {
        if (arg && arg.isIziInjection) {
          results.push(arg.findBeanBuilder(context))
        }
      })
      return results
    }

    return findArgumentsDependencies(this.strategy.getArguments())
  }
}

function matchesById (selfId: string, otherId: string): boolean {
  return selfId === otherId
}

function matchesByType (strategy: BeanCreationStrategy, type: Function): boolean {
  return strategy.matchesByType(type)
}

function injectDependenciesOnProperties (beansContext: BeansContext, bean: Bean): void {
  if (typeOf(bean) !== 'Object') {
    return
  }
  bean.iziInjectingInProgress = true
  for (let prop in bean) {
    const injection = bean[prop]
    if (injection && injection.isIziInjection) {
      injection.injector(bean, prop, injection.resolveBean(beansContext))
    }
  }
  delete bean.iziInjectingInProgress
}

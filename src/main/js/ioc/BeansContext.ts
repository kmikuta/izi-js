import { typeOf } from '../utils/typeOf'
import { hasOwnProperty } from '../utils/hasOwnProperty'
import { forEach } from '../utils/lodash/forEach'
import { NoBeanMatched } from './bean/NoBeanMatched'
import { Config } from './Config'
import { BeanBuilder } from './bean/BeanBuilder'
import { SingletonStrategy } from './bean/SingletonStrategy'
import { InstanceStrategy } from './bean/InstanceStrategy'
import { Bean, BeanIdentity, BeansConfig } from './types'
import { Observable } from '../utils/Observable'
import { removeItem } from '../utils/removeItem'
import { find } from '../utils/lodash/find'

/**
 * BeansContext instance is returned by {@link Api#bakeBeans izi.bakeBeans()} function. It is also available
 * in <code>.iziContext(context)</code> function implemented on any bean, ie:
 *
 *     izi.bakeBeans({
 *
 *         bean: izi.instantiate(SomeDependency),
 *
 *         myBean: {
 *
 *             dependency: izi.inject(SomeDependency),
 *
 *             iziContext: function (context) {
 *                 // iziContext function is called when all dependencies are provided and ready to use
 *             }
 *
 *             iziInit: function () {
 *                 // iziInit() is called after iziContext()
 *             }
 *         }
 *     });
 *
 *  When you have BeansContext reference, you can:
 *
 *   * wire dependencies to object created outside the context: <code>context.wire(objectContainingIziInjects)</code>
 *   * create descendant context: <code>izi.bakeBeans({...}, parentContext);</code>
 *   * destroy context: <code>context.destroy()</code>
 *
 */
export class BeansContext {
  parentContext: BeansContext
  destroyDispatcher: Observable

  private beans: BeansConfig
  private beansBuilders: Array<BeanBuilder> = []

  constructor (beans: BeansConfig | BeansConfig[], parentContext?: BeansContext) {
    this.beans = normalizeBeans(beans)
    this.parentContext = parentContext
    this.destroyDispatcher = new Observable()

    handleDestroyFromParentContext(this)
    createBeansBuilders(this.beans, this.beansBuilders)
    initAllBeans(this, this.beansBuilders)
  }

  /**
   * Find bean by its id or class name
   */
  getBean (beanIdOrType: BeanIdentity) {
    const beanBuilder = this.findBeanBuilder(beanIdOrType)

    if (!beanBuilder) {
      throw new NoBeanMatched(beanIdOrType as string)
    }

    return beanBuilder.create(this)
  }

  /**
   * Injects needed dependencies from this context into passed object.
   */
  wire (objectContainingIziInjects: any): Bean {
    const strategy = new InstanceStrategy(objectContainingIziInjects)
    const beanBuilder = new BeanBuilder('', strategy)
    this.beansBuilders.push(beanBuilder)
    return beanBuilder.create(this)
  }

  /**
   * Detaches bean wired by context.wire() to prevent memory leaks.
   */
  detachBean (bean: Bean) {
    let beanBuilderToDestroy: BeanBuilder = find(this.beansBuilders, function (beanBuilder) {
      if (beanBuilder.matchesBeanInstance(bean)) {
        return true
      }
      return false
    })

    if (beanBuilderToDestroy) {
      beanBuilderToDestroy.destroyCreatedBeans()
      removeItem(this.beansBuilders, beanBuilderToDestroy)
    }
  }

  /**
   * Destroys beans context and all descendant contexts. First it calls <code>.iziPreDestroy()</code> method on every
   * created bean if implemented. Throwing an error inside <code>.iziPreDestroy()</code> stops destroying the context.
   * After calling <code>.iziPreDestroy()</code> izi calls <code>.iziDestroy()</code> methods on every created bean
   * if implemented. All thrown errors inside <code>.iziDestroy()</code> are caught and ignored.
   *
   * <code>.iziDestroy()</code> is a place where you should unregister all event listeners added within its class.
   *
   *     var context = izi.bakeBeans({
   *
   *         someBean: {
   *
   *             iziInit: function () {
   *                 var bind = this.bind = izi.bind();
   *
   *                 bind.valueOf(loginInput).to(model, "login");
   *                 bind.valueOf(passwordInput).to(model, "password");
   *
   *                 this.login = izi.perform(doLogin).when("click").on(loginButton);
   *             },
   *
   *             iziPreDestroy: function () {
   *                 // you can throw new Error() here if you don't want to destroy context for any reason
   *             }
   *
   *             iziDestroy: function () {
   *                 this.bind.unbindAll();
   *                 this.login.stopObserving();
   *             }
   *         }
   *     });
   *
   *     context.destroy();
   *
   */
  destroy () {
    let destroyDispatcher = this.destroyDispatcher
    destroyDispatcher.dispatchEvent('destroy')
    this.doDestroy()

    return true
  }

  doDestroy () {
    forEach(this.beansBuilders, function (beanBuilder) {
      beanBuilder.destroyCreatedBeans()
    })
    this.beansBuilders = []
    this.beans = undefined
    this.parentContext = undefined
    this.destroyDispatcher = undefined

    return true
  }

  /**
   * Find bean builder by its id or type
   * @private
   */
  findBeanBuilder (beanIdOrType: BeanIdentity): BeanBuilder {
    let foundBuilder: BeanBuilder = null

    forEach(this.beansBuilders, function (factory) {
      if (factory.matches(beanIdOrType)) {
        if (foundBuilder) {
          throw new Error('Ambiguous reference to bean by type. Please refer by id.')
        }
        foundBuilder = factory
      }
    })

    if (!foundBuilder && this.parentContext !== undefined) {
      foundBuilder = this.parentContext.findBeanBuilder(beanIdOrType)
    }

    return foundBuilder
  }
}

function normalizeBeans (beans: BeansConfig | BeansConfig[]): BeansConfig {
  if (Array.isArray(beans)) {
    return mergeBeans(beans)
  } else {
    return beans
  }
}

function mergeBeans (beansCollection: Array<BeansConfig>): BeansConfig {
  let result: any = {}
  forEach(beansCollection, function (beans) {
    iterateOwnProperties(beans, function (key: string, value: any) {
      if (result[key] === undefined) {
        result[key] = value
      } else {
        throw new Error('Found duplicated bean ID: "' + key + '" in multiple configurations')
      }
    })
  })
  return result
}

function iterateOwnProperties (object: any, callback: Function) {
  for (let key in object) {
    if (hasOwnProperty(object, key)) {
      callback(key, object[key])
    }
  }
}

function createBeansBuilders (beans: BeansConfig, beansBuilders: Array<BeanBuilder>) {
  let beanId
  let beanConfig
  let beanBuilder

  for (beanId in beans) {
    if (hasOwnProperty(beans, beanId)) {
      beanConfig = beans[beanId]

      if (beanConfig instanceof Config) {
        beanBuilder = new BeanBuilder(beanId, beanConfig.createStrategy())
      } else if (typeOf(beanConfig) === 'Function') {
        const config = new Config(beanConfig, SingletonStrategy)
        beanBuilder = new BeanBuilder(beanId, config.createStrategy())
      } else {
        beanBuilder = new BeanBuilder(beanId, new InstanceStrategy(beanConfig))
      }

      beansBuilders.push(beanBuilder)
    }
  }
}

function findCircularDependencies (beansContext: BeansContext, beanBuilder: BeanBuilder) {
  function visitDependencies (visitedBuilder: BeanBuilder) {
    let dependencies = visitedBuilder.getArgumentsDependencies(beansContext)

    forEach(dependencies, function (dependency) {
      if (dependency === beanBuilder) {
        throw new Error('Circular dependencies found. If it is possible try inject those dependencies by properties instead by arguments.')
      }
      visitDependencies(dependency)
    })
  }

  visitDependencies(beanBuilder)
}

function initBean (beansContext: BeansContext, beanBuilder: BeanBuilder) {
  findCircularDependencies(beansContext, beanBuilder)
  return beanBuilder.init(beansContext)
}

function initAllBeans (beansContext: BeansContext, beansBuilders: Array<BeanBuilder>) {
  let bean: Bean
  let beansToCreate: Array<BeanBuilder> = []

  forEach(beansBuilders, function (beanBuilder) {
    bean = initBean(beansContext, beanBuilder)
    if (bean) {
      beansToCreate.push(beanBuilder)
    }
  })

  forEach(beansToCreate, function (beanToCreate) {
    beanToCreate.create(beansContext)
  })
}

/**
 * @ignore
 */
function handleDestroyFromParentContext (beansContext: BeansContext) {
  let parentContext = beansContext.parentContext
  let childrenDispatcher = beansContext.destroyDispatcher
  let parentDispatcher = parentContext && parentContext.destroyDispatcher

  if (!parentDispatcher) {
    return
  }

  function handleDestroy () {
    parentDispatcher.removeListener('destroy', handleDestroy)

    childrenDispatcher.dispatchEvent('destroy')
    beansContext.doDestroy()
  }

  parentDispatcher.addListener('destroy', handleDestroy)
}

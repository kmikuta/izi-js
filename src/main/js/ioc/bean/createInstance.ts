import { hasOwnProperty } from '../../utils/hasOwnProperty'
import { AnyArgs, AnyProps, ClassConstructor } from '../types'
import { BeansContext } from '../BeansContext'

export function createInstance (Clazz: ClassConstructor, args: AnyArgs, props: AnyProps, beansContext: BeansContext): any {
  function resolveArguments (args: AnyArgs, beansContext: BeansContext): AnyArgs {
    const result = []
    let i
    let arg
    for (i = 0; i < args.length; i = i + 1) {
      arg = args[i]
      if (arg && arg.isIziInjection) {
        result.push(arg.resolveBean(beansContext))
      } else {
        result.push(arg)
      }
    }
    return result
  }

  function applyProps (instance: any, props: AnyProps) {
    if (props !== undefined) {
      for (const prop in props) {
        if (hasOwnProperty(props, prop)) {
          instance[prop] = props[prop]
        }
      }
    }
  }

  let instance: any = new Clazz(...resolveArguments(args, beansContext))
  applyProps(instance, props)
  return instance
}

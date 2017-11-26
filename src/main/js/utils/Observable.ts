import remove = require('lodash/remove')
import { forEach } from './lodash/forEach'

type Listener = {
  fn: Function,
  scope: any
}

export class Observable {

  private _listeners: { [key: string]: Array<Listener> } = {}

  addListener (type: string, fn: Function, scope?: any) {
    this._findListeners(type).push({
      fn: fn,
      scope: scope
    })
  }

  removeListener (type: string, fn: Function, scope?: any) {
    const listeners = this._findListeners(type)
    const filter: any = { fn: fn }
    if (scope) {
      filter.scope = scope
    }
    remove(listeners, filter)
  }

  dispatchEvent (type: string, ...args: any[]) {
    forEach(this._findListeners(type).slice(), (listener) => {
      listener.fn.apply(listener.scope || this, args)
    })
  }

  private _findListeners (type: string): Array<Listener> {
    if (!this._listeners[type]) {
      this._listeners[type] = []
    }
    return this._listeners[type]
  }
}

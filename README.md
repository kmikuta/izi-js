[![Build Status](https://travis-ci.org/gejgalis/izi-js.svg?branch=master)](https://travis-ci.org/gejgalis/izi-js)

What is izi?
============

* **izi** (as in '//easy//') is a simple Dependency Injection library for ES6 and TypeScript classes.

Features
========

* Class constructor argument injections
* Class property injections
* Injection by type (class constructor reference)
* Injection by bean id (string)
* Injection setup available by `inject(BeanType)` expression or by `@inject(BeanType)` decorator
* Hierarchical IoC containers
* Lifecycle hooks: `@init` and `@destroy`
* Wiring at runtime properties injections of instance created by `new` keyword
* Custom injectors

Getting started
===============

```js
import { createContainer, singleton } from 'izi'
import { FooView } from './view/FooView'
import { FooModel } from './model/FooModel'
import { DisplayHelloWorld } from './behaviors/DisplayHelloWorld'

const fooEl = document.querySelector('#foo')

createContainer({
  FooModel,
  FooView: singleton(FooView).withArgs(fooEl),
  DisplayHelloWorld
})
```

where:

**model/FooModel.js**
```js
export class FooModel {
  message = ''
}
```

**view/FooView.js**

```js
import { inject } from 'izi'
import { FooModel } from '../model/FooModel'

export class FooView {

  @inject(FooModel)
  model

  el = null
  
  constructor (el) {
    this.el = el
  }
  
  render () {
    this.el.innerHTML = `<span>Hello ${this.model.message}!</span>`
  }
}
```

**behaviors/DisplayHelloWorld.js**

```js
import { inject, init } from 'izi'
import { FooModel } from '../model/FooModel'
import { FooView } from '../view/FooView'

export class DisplayHelloWorld {

  @inject(FooModel)
  model
  
  @inject(FooView)
  view
  
  @init
  onInit () {
    this.model.message = 'World'
    this.view.render()
  }
}
```
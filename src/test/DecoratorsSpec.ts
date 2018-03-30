import * as izi from '../main/js/index'
import { expect } from 'chai'

const inject = izi.decorators.inject

describe('Decorators', () => {
  describe('init', () => {
    it('should register decorated method to call on iziInit', () => {
      // given
      const init = izi.decorators.init
      let initCalled = false

      class ClassA {
        @init
        onInit () {
          this.notifyInitialized()
        }

        notifyInitialized () {
          initCalled = true
        }
      }

      // when
      izi.createContainer({
        ClassA
      })

      // then
      expect(initCalled).to.be.true
    })
  })

  describe('destroy', () => {
    it('should register decorated method to call on iziDestroy', () => {
      // given
      const destroy = izi.decorators.destroy
      let destroyCalled = false

      class ClassA {
        @destroy
        onDestroy () {
          this.notifyDestroyed()
        }

        notifyDestroyed () {
          destroyCalled = true
        }
      }

      // when
      const context = izi.createContainer({
        ClassA
      })

      context.destroy()

      // then
      expect(destroyCalled).to.be.true
    })
  })

  describe('inject', () => {
    it('should inject with decorator', () => {
      // given
      let injected = null

      class ClassA {}

      class ClassB {
        @inject(ClassA)
        classA: ClassA

        iziInit () {
          injected = this.classA
        }
      }

      // when
      izi.createContainer({
        ClassA,
        ClassB
      })

      // then
      expect(injected instanceof ClassA).to.be.true
    })

    it('should inject property', () => {
      // given
      let injectedProperty = null

      class ClassA {
        name: string = 'I am Class A'
      }

      class ClassB {
        @inject(ClassA, { property: 'name' })
        injectedName: string

        iziInit () {
          injectedProperty = this.injectedName
        }
      }

      // when
      izi.createContainer({
        ClassA,
        ClassB
      })

      // then
      expect(injectedProperty).to.equal('I am Class A')
    })

    it('should inject property via convert function', () => {
      // given
      let injectedProperty = null

      function convertFunction (classA) {
        return classA.name
      }

      class ClassA {
        name: string = 'I am Class A'
      }

      class ClassB {
        @inject(ClassA, { through: convertFunction })
        injectedName: string

        iziInit () {
          injectedProperty = this.injectedName
        }
      }

      // when
      izi.createContainer({
        ClassA,
        ClassB
      })

      // then
      expect(injectedProperty).to.equal('I am Class A')
    })

    it('should inject property with custom injector', () => {
      // given
      let injectedProperty = null

      const customInjector = (target, property, dependency) => target.injectedName = dependency.name

      class ClassA {
        name: string = 'I am Class A'
      }

      class ClassB {
        @inject(ClassA, { by: customInjector })
        injectedName: string

        iziInit () {
          injectedProperty = this.injectedName
        }
      }

      // when
      izi.createContainer({
        ClassA,
        ClassB
      })

      // then
      expect(injectedProperty).to.equal('I am Class A')
    })
  })
})

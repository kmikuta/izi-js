import * as izi from '../main/js/index'
import { BeansContext } from '../main/js/ioc/BeansContext'
import { expect } from 'chai'
import { fail } from "assert";

describe('Beans Context', function () {
  it('Should create beans context', function () {
    // given
    const context = izi.createContainer({})

    // when/then
    expect(context).to.be.instanceOf(BeansContext)
  }) // -------------------------------------------------------------------------------------------------------------

  it('Should find bean by id', function () {
    // given
    const context = izi.createContainer({
      someId: {
        name: 'value'
      }
    })

    // when/then
    expect(context.getBean('someId').name).equals('value')
  }) // -------------------------------------------------------------------------------------------------------------

  it('Should load bean by type', function () {
    let context

    class Foo {
      private value: any;

      constructor (value: any) {
        this.value = value
      }
    }

    // given
    context = izi.createContainer({
      someId: new Foo('value')
    })

    // when/then
    expect(context.getBean(Foo).value).to.be.equal('value')
  }) // -------------------------------------------------------------------------------------------------------------

  it('Should instantiate singleton by type and arguments', function () {
    var context,
      bean

    // given
    class SomeClass {
      private arg1: any;
      private arg2: any;

      constructor (arg1: any, arg2: any) {
        this.arg1 = arg1
        this.arg2 = arg2
      }
    }

    context = izi.createContainer({
      someId: izi.singleton(SomeClass).withArgs('value1', 'value2')
    })

    // when
    bean = context.getBean('someId')

    // when/then
    expect(bean.arg1).equal('value1')
    expect(bean.arg2).equal('value2')
  }) // -------------------------------------------------------------------------------------------------------------

  it('Should instantiate singleton', function () {
    var SingletonClass,
      context,
      instantiated = 0

    // given
    SingletonClass = function () {
      instantiated = instantiated + 1
    }

    // when
    context = izi.createContainer({
      someId: izi.singleton(SingletonClass)
    })

    // then
    expect(instantiated).equal(1)
    context.getBean('someId')
    context.getBean('someId')
    expect(instantiated).equal(1)
  }) // -------------------------------------------------------------------------------------------------------------

  it('Should instantiate singleton when raw constructor is given', function () {
    var SingletonClass,
      context,
      instantiated = 0

    // given
    SingletonClass = function () {
      instantiated = instantiated + 1
    }

    // when
    context = izi.createContainer({
      someId: SingletonClass
    })

    // then
    expect(instantiated).equal(1)
    context.getBean('someId')
    context.getBean('someId')
    expect(instantiated).equal(1)
  }) // -------------------------------------------------------------------------------------------------------------

  it('Should not instantiate lazy singleton after context creation', function () {
    var context,
      instantiated = 0

    // given
    class LazySingletonClass {
      constructor () {
        instantiated = instantiated + 1
      }
    }

    // when
    context = izi.createContainer({
      someId: izi.lazy(LazySingletonClass)
    })

    // then
    expect(instantiated).equal(0)
    context.getBean(LazySingletonClass)
    context.getBean(LazySingletonClass)
    expect(instantiated).equal(1)
  }) // -------------------------------------------------------------------------------------------------------------

  it('Should call iziInit and iziContext methods for singleton', function () {
    var context,
      iziContextCalled = null,
      iziInitCalled = null,
      iziInitCounter = 0,
      iziContextCounter = 0

    // given
    class SomeClass {

      dependency: any = izi.inject('dependency')

      iziInit () {
        iziInitCalled = this.dependency
        iziInitCounter++
      }

      iziContext (context: BeansContext) {
        iziContextCalled = context
        iziContextCounter++
      }
    }

    // when
    context = izi.createContainer({
      someId: izi.singleton(SomeClass),
      dependency: 'dependency'
    })
    context.getBean('someId')
    context.getBean('someId')

    // then
    expect(iziContextCalled).equals(context)
    expect(iziInitCalled).equals('dependency')
    expect(iziInitCounter).equals(1)
    expect(iziContextCounter).equals(1)
  }) // -------------------------------------------------------------------------------------------------------------

  it('Should not call iziInit and iziContext methods for lazy singleton', function () {
    var SomeClass, context,
      iziContextCalled = null,
      iziInitCalled = null,
      iziInitCounter = 0,
      iziContextCounter = 0

    // given
    SomeClass = function () {
      this.dependency = izi.inject('dependency')

      this.iziInit = function () {
        iziInitCalled = this.dependency
        iziInitCounter++
      }

      this.iziContext = function (context: BeansContext) {
        iziContextCalled = context
        iziContextCounter++
      }
    }

    // when
    context = izi.createContainer({
      someId: izi.lazy(SomeClass),
      dependency: 'dependency'
    })

    // then
    expect(iziContextCalled).equals(null)
    expect(iziInitCalled).equals(null)

    context.getBean('someId')
    expect(iziContextCalled).equal(context)
    expect(iziInitCalled).equal('dependency')

    context.getBean('someId')
    context.getBean('someId')
    expect(iziInitCounter).equal(1)
    expect(iziContextCounter).equal(1)
  }) // -------------------------------------------------------------------------------------------------------------

  it('Should call iziInit and iziContext methods for instantiated beans', function () {
    var SomeClass, context,
      iziContextCalled = null,
      iziInitCalled = null,
      iziInitCounter = 0,
      iziContextCounter = 0

    // given
    SomeClass = function () {
      this.dependency = izi.inject('dependency')

      this.iziInit = function () {
        iziInitCalled = this.dependency
        iziInitCounter++
      }

      this.iziContext = function (context: BeansContext) {
        iziContextCalled = context
        iziContextCounter++
      }
    }

    // when
    context = izi.createContainer({
      someId: new SomeClass(),
      dependency: 'dependency'
    })
    context.getBean('someId')
    context.getBean('someId')

    // then
    expect(iziContextCalled).equal(context)
    expect(iziInitCalled).equal('dependency')
    expect(iziInitCounter).equal(1)
    expect(iziContextCounter).equal(1)
  }) // -------------------------------------------------------------------------------------------------------------

  it('Should merge multiple contexts', function () {
    var config1 = {
      bean1: 'Bean 1 value'
    }
    var config2 = {
      bean2: 'Bean 2 value'
    }

    var context = izi.createContainer([config1, config2])
    expect(context.getBean('bean1')).equal('Bean 1 value')
    expect(context.getBean('bean2')).equal('Bean 2 value')
  }) // -------------------------------------------------------------------------------------------------------------

  it('Should merge multiple contexts and create with parent context', function () {
    var parentContext = izi.createContainer({
      parentBean: 'Parent value'
    })
    var config1 = {
      bean1: 'Bean 1 value'
    }
    var config2 = {
      bean2: 'Bean 2 value'
    }

    var context = izi.createContainer([config1, config2], parentContext)
    expect(context.getBean('bean1')).equal('Bean 1 value')
    expect(context.getBean('bean2')).equal('Bean 2 value')
    expect(context.getBean('parentBean')).equal('Parent value')
  }) // -------------------------------------------------------------------------------------------------------------

  it('Should throw an error when beans are duplicated', function () {
    var config1 = {
      bean1: 'Bean 1 value'
    }
    var config2 = {
      bean1: 'Bean 1 value'
    }

    expect(function () {
      izi.createContainer([config1, config2])
    }).to.throw('Found duplicated bean ID: "bean1" in multiple configurations')
  }) // -------------------------------------------------------------------------------------------------------------

  it('Should wire dependencies in already instantiated object outside the context', function () {
    // given
    var wasDestroyed = false
    var context = izi.createContainer({
      bean: 'Bean value'
    })
    var externalObject = {
      dependency: izi.inject('bean'),
      iziDestroy: function () {
        wasDestroyed = true
      }
    }

    // when
    context.wire(externalObject)

    // then
    expect(externalObject.dependency).equal('Bean value')
    context.destroy()
    expect(wasDestroyed).equals(true)
  }) // -------------------------------------------------------------------------------------------------------------

  it('Should detach bean wired by context.wire() method', function () {
    // given
    var wasDestroyed = false
    var context = izi.createContainer({
      bean: 'Bean value'
    })
    var externalObject = {
      dependency: izi.inject('bean'),
      iziDestroy: function () {
        wasDestroyed = true
      }
    }
    context.wire(externalObject)

    // when
    context.detachBean(externalObject)

    // then
    expect(externalObject.dependency).equal('Bean value')

    expect(wasDestroyed).equals(true)
  }) // -------------------------------------------------------------------------------------------------------------

  it('Should destroy context and call iziDestroy() on each created bean', function () {
    // given
    var destroyedCounter = 0
    var context = izi.createContainer({
      bean1: {
        iziDestroy: function () {
          destroyedCounter++
          throw new Error('There might be thrown an error')
        }
      },
      bean2: {
        iziDestroy: function () {
          destroyedCounter++
        }
      },
      bean3: {}
    })

    // when
    var result = context.destroy()

    // then
    expect(destroyedCounter).equal(2)
    expect(result).equals(true)
    try {
      context.getBean('bean1')
      fail('Exception not thrown')
    } catch (e) {
      expect(e.message).equal('No bean matched: bean1')
    }
  }) // -------------------------------------------------------------------------------------------------------------

  it('Should destroy also all descendant contexts', function () {
    // given
    var destroyedBeansChain = ''
    var parentContext = izi.createContainer({
      parentBean: {
        iziDestroy: function () {
          destroyedBeansChain += '1'
        }
      }
    })
    var childContext1 = izi.createContainer({
      childBean1: {
        iziDestroy: function () {
          destroyedBeansChain += '2'
        }
      }
    }, parentContext)
    var childContext2 = izi.createContainer({
      childBean2: {
        iziDestroy: function () {
          destroyedBeansChain += '3'
        }
      }
    }, childContext1)

    // when
    var result = parentContext.destroy()

    // then
    expect(destroyedBeansChain).equal('321')
    expect(result).equals(true)

    try {
      parentContext.getBean('parentBean')
      fail('Exception not thrown')
    } catch (e) {
      expect(e.message).equal('No bean matched: parentBean')
    }

    try {
      childContext1.getBean('childBean1')
      fail('Exception not thrown')
    } catch (e) {
      expect(e.message).equal('No bean matched: childBean1')
    }

    try {
      childContext2.getBean('childBean2')
      fail('Exception not thrown')
    } catch (e) {
      expect(e.message).equal('No bean matched: childBean2')
    }
  }) // -------------------------------------------------------------------------------------------------------------

  it("Shouldn't use not own properties when creates context", function () {
    // given
    var ownBean = {}

    class ContextClass {
      [x: string]: {};
      private ownBean: {};

      constructor () {
        this.ownBean = ownBean
      }

    }

    ContextClass.prototype.beanOnPrototype = {}

    // when
    var context = izi.createContainer(new ContextClass())

    // then
    expect(context.getBean('ownBean')).equals(ownBean)

    try {
      context.getBean('beanOnPrototype')
      fail('Exception not thrown')
    } catch (e) {
      expect(e.message).equal('No bean matched: beanOnPrototype')
    }
  }) // -------------------------------------------------------------------------------------------------------------
})

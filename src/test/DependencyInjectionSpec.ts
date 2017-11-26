import * as izi from '../main/js/index'
import { expect } from 'chai'
import { fail } from 'assert'

describe('Dependency Injection', function () {

  it('Should inject dependencies by constructor args', function () {
    var ClassA, ClassB, a, b, context

    // given
    ClassA = function (classB) {
      this.classB = classB
    }
    ClassB = function () {
    }

    // when
    context = izi.createContainer({
      classA: izi.singleton(ClassA).withArgs(izi.inject(ClassB)),
      classB: izi.singleton(ClassB)
    })

    // then
    a = context.getBean(ClassA)
    b = context.getBean(ClassB)
    expect(a.classB).equals(b)
  }) // -------------------------------------------------------------------------------------------------------------

  it('Should inject dependencies on properties', function () {
    var ClassA, ClassB, a, b, context

    // given
    ClassA = function () {
      this.classB = izi.inject(ClassB)
    }
    ClassB = function () {
    }

    // when
    context = izi.createContainer({
      classA: new ClassA(),
      classB: new ClassB()
    })

    // then
    a = context.getBean(ClassA)
    b = context.getBean(ClassB)
    expect(a.classB).equals(b)
  }) // -------------------------------------------------------------------------------------------------------------

  it('Should inject cross dependencies on already created beans', function () {
    var ClassA, ClassB, a, b, context

    // given
    ClassA = function () {
      this.classB = izi.inject(ClassB)
    }
    ClassB = function () {
      this.classA = izi.inject(ClassA)
    }

    // when
    context = izi.createContainer({
      classA: new ClassA(),
      classB: new ClassB()
    })

    // then
    a = context.getBean(ClassA)
    b = context.getBean(ClassB)
    expect(a.classB).equals(b)
    expect(b.classA).equals(a)
  }) // -------------------------------------------------------------------------------------------------------------

  it('Should inject cross dependencies on singleton beans', function () {
    var ClassA, ClassB, a, b, context

    // given
    ClassA = function () {
      this.classB = izi.inject(ClassB)
    }
    ClassB = function () {
      this.classA = izi.inject(ClassA)
    }

    // when
    context = izi.createContainer({
      classA: izi.singleton(ClassA),
      classB: izi.singleton(ClassB)
    })

    // then
    a = context.getBean(ClassA)
    b = context.getBean(ClassB)
    expect(a.classB).equals(b)
    expect(b.classA).equals(a)
  }) // -------------------------------------------------------------------------------------------------------------

  it('Should inject cross dependencies on lazy singleton beans', function () {
    var ClassA, ClassB, a, b, context

    // given
    ClassA = function () {
      this.classB = izi.inject(ClassB)
    }
    ClassB = function () {
      this.classA = izi.inject(ClassA)
    }

    // when
    context = izi.createContainer({
      classA: izi.lazy(ClassA),
      classB: izi.lazy(ClassB)
    })

    // then
    a = context.getBean(ClassA)
    b = context.getBean(ClassB)
    expect(a.classB).equals(b)
    expect(b.classA).equals(a)
  }) // -------------------------------------------------------------------------------------------------------------

  it('Should inject mixed dependencies', function () {
    var ClassA, ClassB, ClassC, a, context

    // given
    ClassA = function (classB) {
      this.classB = classB
      this.classC = izi.inject(ClassC)
    }
    ClassB = function () {
    }
    ClassC = function () {
    }

    // when
    context = izi.createContainer({
      classA: izi.singleton(ClassA).withArgs(izi.inject(ClassB)),
      classB: new ClassB(),
      classC: new ClassC()
    })

    // then
    a = context.getBean(ClassA)
    expect(a.classB instanceof ClassB).equals(true)
    expect(a.classC instanceof ClassC).equals(true)
  }) // -------------------------------------------------------------------------------------------------------------

  it('Should throw exception when circular dependencies in constructors', function () {
    var ClassA, ClassB, ClassC

    // given
    ClassA = function (classB) {
    }
    ClassB = function (classC) {
    }
    ClassC = function (classA) {
    }

    // when/then
    try {
      izi.createContainer({
        a: izi.singleton(ClassA).withArgs(izi.inject('b')),
        b: izi.singleton(ClassB).withArgs(izi.inject(ClassC)),
        c: izi.singleton(ClassC).withArgs(izi.inject(ClassA))
      })
      fail('Exception not thrown')
    } catch (e) {
      expect(e.message).equals('Circular dependencies found. If it is possible try inject those dependencies by properties instead by arguments.')
    }
  }) // -------------------------------------------------------------------------------------------------------------

  it('Should throw smart error when injecting not existing bean (by constructor dependency)', function () {
    var Class, context

    // given
    Class = function () {
    }

    // when/then
    expect(function () {
      context = izi.createContainer({
        aClass: izi.singleton(Class).withArgs(izi.inject('not existing bean'))
      })
    }).to.throw('Bean: `not existing bean` couldn\'t be found from injection at line:')
  }) // -------------------------------------------------------------------------------------------------------------

  it('Should throw smart error when injecting not existing bean (by object property)', function () {
    var Class, context

    // given
    Class = function () {
      this.classX = izi.inject('not existing bean')
    }

    // when/then
    expect(function () {
      context = izi.createContainer({
        aClass: izi.singleton(Class)
      })
    }).to.throw('No bean matched: not existing bean')
  }) // -------------------------------------------------------------------------------------------------------------

  xit('Should throw smart error displaying constructor name when injecting not existing bean (by object property)', function () {
    var Class, context

    // given
    Class = function () {
      this.classX = izi.inject(function NotExistingClass () {
      })
    }

    // when/then
    expect(function () {
      context = izi.createContainer({
        aClass: izi.singleton(Class)
      })
    }).to.throw('No bean matched: function NotExistingClass() {\r\n' + '            }')
  }) // -------------------------------------------------------------------------------------------------------------

  it('Should call iziInit() and iziContext() in proper order on injected beans', function () {
    var ClassA, ClassB, ClassC, ClassD, calledIziInit = [], calledIziContext = []

    // given
    ClassA = function () {
      this.classB = izi.inject('classB')

      this.iziInit = function () {
        calledIziInit.push('ClassA')
      }

      this.iziContext = function () {
        calledIziContext.push('ClassA')
      }
    }
    ClassB = function () {
      this.classC = izi.inject('classC')

      this.iziInit = function () {
        calledIziInit.push('ClassB')
      }

      this.iziContext = function () {
        calledIziContext.push('ClassB')
      }
    }
    ClassC = function (classD) {
      this.iziInit = function () {
        calledIziInit.push('ClassC')
      }

      this.iziContext = function () {
        calledIziContext.push('ClassC')
      }
    }
    ClassD = function () {
      this.iziInit = function () {
        calledIziInit.push('ClassD')
      }

      this.iziContext = function () {
        calledIziContext.push('ClassD')
      }
    }

    // when
    izi.createContainer({
      classC: izi.singleton(ClassC).withArgs(izi.inject('classD')),
      classA: new ClassA(),
      classD: new ClassD(),
      classB: new ClassB()
    })

    // then
    expect(calledIziInit).to.deep.equal(['ClassD', 'ClassC', 'ClassB', 'ClassA'])
    expect(calledIziContext).to.deep.equal(['ClassD', 'ClassC', 'ClassB', 'ClassA'])
  }) // -------------------------------------------------------------------------------------------------------------

  it('Should overwrite properties on bean definition', function () {
    var ClassA, ClassB, ClassC, config, context, bean1, bean2, bean3, bean4

    // given
    ClassA = function () {
      this.field1 = 'Value 1'
      this.field2 = izi.inject('ClassB')
    }
    ClassB = function () {
    }
    ClassC = function () {
    }

    // when
    config = {
      bean1: new ClassC(),
      bean2: izi.singleton(ClassA).withProps({field1: 'Value 2', field2: izi.inject('bean1')}),
      bean3: izi.lazy(ClassA).withProps({field1: 'Value 4', field2: izi.inject('bean1')})
    }
    context = izi.createContainer(config)

    // then
    bean1 = context.getBean('bean1')
    bean2 = context.getBean('bean2')
    bean3 = context.getBean('bean3')

    expect(bean2.field1).equals('Value 2')
    expect(bean2.field2).equals(bean1)

    expect(bean3.field1).equals('Value 4')
    expect(bean3.field2).equals(bean1)
  }) // -------------------------------------------------------------------------------------------------------------

  it('Should throw an error when trying to inject invalid bean', function () {
    expect(function () {
      izi.inject(null)
    }).to.throw('Trying to inject invalid empty bean')

    expect(function () {
      izi.inject(undefined)
    }).to.throw('Trying to inject invalid empty bean')

    expect(function () {
      izi.inject('')
    }).to.throw('Trying to inject invalid empty bean')
  }) // -------------------------------------------------------------------------------------------------------------

  it('Should inject by custom dependency injector', function () {
    var ClassA, ClassB

    // given
    ClassA = function () {
      this.bValue = izi.inject('ClassB').by(function (target, prop, dependency) {
        target[prop] = dependency.value
      })
    }
    ClassB = function () {
      this.value = 'ClassB value'
    }

    // when
    var ctx = izi.createContainer({
      ClassA: izi.singleton(ClassA),
      ClassB: izi.singleton(ClassB)
    })

    // then
    expect(ctx.getBean('ClassA').bValue).equals('ClassB value')
  }) // -------------------------------------------------------------------------------------------------------------

  it('Should inject through dependency converter', function () {
    var ClassA, ClassB

    // given
    function takeValue (dependency) {
      return dependency.value
    }

    ClassA = function (argValue, argPropertyValue) {
      this.argValue = argValue
      this.argPropertyValue = argPropertyValue
      this.throughValue = izi.inject('ClassB').through(takeValue)
      this.propertyValue = izi.inject('ClassB').property('value')
    }
    ClassB = function () {
      this.value = 'ClassB value'
    }

    // when
    var ctx = izi.createContainer({
      ClassA: izi.singleton(ClassA).withArgs(
        izi.inject('ClassB').through(takeValue),
        izi.inject('ClassB').property('value')
      ),
      ClassB: izi.singleton(ClassB)
    })

    // then
    var beanA = ctx.getBean('ClassA')
    expect(beanA.argValue).equals('ClassB value')
    expect(beanA.argPropertyValue).equals('ClassB value')
    expect(beanA.propertyValue).equals('ClassB value')
    expect(beanA.throughValue).equals('ClassB value')
  }) // -------------------------------------------------------------------------------------------------------------

  it('Should inject using BaseClass', function () {
    // given
    class Base {

    }

    class ClassA extends Base {

    }

    class ClassB {
      a = izi.inject(Base)
    }

    // when
    const ctx = izi.createContainer({
      ClassA,
      ClassB
    })

    // then
    const beanA = ctx.getBean(ClassA)
    const beanB = ctx.getBean(ClassB)
    expect(beanB.a).equals(beanA)
  }) // -------------------------------------------------------------------------------------------------------------
})

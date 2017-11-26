import * as izi from '../main/js/index'
import { expect } from 'chai'
import { fail } from 'assert'

describe('Parent context support', function () {
  it('Child context should resolve beans from its context and all parent contexts', function () {
    var childContext, parentContext, grandChildContext,
      ClassParentA, ClassParentB,
      ClassChildA, ClassChildB,
      ClassGrandChildA, ClassGrandChildB,
      grandChildA, grandChildB,
      childA, childB,
      parentA, parentB

    // given
    ClassParentA = function () {
      this.parentB = izi.inject(ClassParentB)
    }

    ClassParentB = function () {
      this.parentA = izi.inject(ClassParentA)
    }

    ClassChildA = function () {
      this.childB = izi.inject(ClassChildB)

      this.parentA = izi.inject(ClassParentA)
      this.parentB = izi.inject(ClassParentB)
    }

    ClassChildB = function () {
      this.childA = izi.inject(ClassChildA)

      this.parentA = izi.inject(ClassParentA)
      this.parentB = izi.inject(ClassParentB)
    }

    ClassGrandChildA = function () {
      this.grandChildB = izi.inject(ClassGrandChildB)

      this.parentA = izi.inject(ClassParentA)
      this.parentB = izi.inject(ClassParentB)
    }

    ClassGrandChildB = function () {
      this.grandChildA = izi.inject(ClassGrandChildA)

      this.parentA = izi.inject(ClassParentA)
      this.parentB = izi.inject(ClassParentB)
    }

    parentContext = izi.createContainer(
      {
        parentA: new ClassParentA(),
        parentB: new ClassParentB()
      })

    childContext = izi.createContainer(
      {
        childA: new ClassChildA(),
        childB: new ClassChildB()
      }, parentContext)

    grandChildContext = izi.createContainer(
      {
        grandChildA: new ClassGrandChildA(),
        grandChildB: new ClassGrandChildB()
      }, childContext)

    // when/then
    grandChildA = grandChildContext.getBean(ClassGrandChildA)
    grandChildB = grandChildContext.getBean(ClassGrandChildB)
    childA = childContext.getBean(ClassChildA)
    childB = childContext.getBean(ClassChildB)
    parentA = childContext.getBean(ClassParentA)
    parentB = childContext.getBean(ClassParentB)

    expect(grandChildA instanceof ClassGrandChildA).equals(true)
    expect(grandChildB instanceof ClassGrandChildB).equals(true)
    expect(childA instanceof ClassChildA).equals(true)
    expect(childB instanceof ClassChildB).equals(true)
    expect(parentA instanceof ClassParentA).equals(true)
    expect(parentB instanceof ClassParentB).equals(true)

    expect(grandChildA.grandChildB === grandChildB).equals(true)
    expect(grandChildA.parentA === parentA).equals(true)
    expect(grandChildA.parentB === parentB).equals(true)

    expect(grandChildB.grandChildA === grandChildA).equals(true)
    expect(grandChildB.parentA === parentA).equals(true)
    expect(grandChildB.parentB === parentB).equals(true)

    expect(childA.childB === childB).equals(true)
    expect(childA.parentA === parentA).equals(true)
    expect(childA.parentB === parentB).equals(true)

    expect(childB.childA === childA).equals(true)
    expect(childB.parentA === parentA).equals(true)
    expect(childB.parentB === parentB).equals(true)

    expect(parentA.parentB === parentB).equals(true)
    expect(parentB.parentA === parentA).equals(true)

    try {
      childContext.getBean('notExistence')
      fail('Exception not thrown')
    } catch (e) {
      expect(e.message).equals('No bean matched: notExistence')
    }
  }) // -------------------------------------------------------------------------------------------------------------
})

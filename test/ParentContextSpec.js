describe("Parent context support", function () {

    it("Child context should resolve beans from its context and all parent contexts", function () {
        var childContext, parentContext, grandChildContext,
            ClassParentA, ClassParentB,
            ClassChildA, ClassChildB,
            ClassGrandChildA, ClassGrandChildB,
            grandChildA, grandChildB,
            childA, childB,
            parentA, parentB;

        // given
        ClassParentA = function () {
            this.parentB = izi.inject(ClassParentB);
        };

        ClassParentB = function () {
            this.parentA = izi.inject(ClassParentA);
        };

        ClassChildA = function () {
            this.childB = izi.inject(ClassChildB);

            this.parentA = izi.inject(ClassParentA);
            this.parentB = izi.inject(ClassParentB);
        };

        ClassChildB = function () {
            this.childA = izi.inject(ClassChildA);

            this.parentA = izi.inject(ClassParentA);
            this.parentB = izi.inject(ClassParentB);
        };

        ClassGrandChildA = function () {
            this.grandChildB = izi.inject(ClassGrandChildB);

            this.parentA = izi.inject(ClassParentA);
            this.parentB = izi.inject(ClassParentB);
        };

        ClassGrandChildB = function () {
            this.grandChildA = izi.inject(ClassGrandChildA);

            this.parentA = izi.inject(ClassParentA);
            this.parentB = izi.inject(ClassParentB);
        };

        parentContext = izi.bakeBeans(
            {
                parentA: new ClassParentA(),
                parentB: new ClassParentB()
            });

        childContext = izi.bakeBeans(
            {
                childA: new ClassChildA(),
                childB: new ClassChildB()
            }, parentContext);

        grandChildContext = izi.bakeBeans(
            {
                grandChildA: new ClassGrandChildA(),
                grandChildB: new ClassGrandChildB()
            }, childContext);

        // when/then
        grandChildA = grandChildContext.getBean(ClassGrandChildA);
        grandChildB = grandChildContext.getBean(ClassGrandChildB);
        childA = childContext.getBean(ClassChildA);
        childB = childContext.getBean(ClassChildB);
        parentA = childContext.getBean(ClassParentA);
        parentB = childContext.getBean(ClassParentB);

        expect(grandChildA instanceof ClassGrandChildA).toBeTruthy();
        expect(grandChildB instanceof ClassGrandChildB).toBeTruthy();
        expect(childA instanceof ClassChildA).toBeTruthy();
        expect(childB instanceof ClassChildB).toBeTruthy();
        expect(parentA instanceof ClassParentA).toBeTruthy();
        expect(parentB instanceof ClassParentB).toBeTruthy();

        expect(grandChildA.grandChildB === grandChildB).toBeTruthy();
        expect(grandChildA.parentA === parentA).toBeTruthy();
        expect(grandChildA.parentB === parentB).toBeTruthy();

        expect(grandChildB.grandChildA === grandChildA).toBeTruthy();
        expect(grandChildB.parentA === parentA).toBeTruthy();
        expect(grandChildB.parentB === parentB).toBeTruthy();

        expect(childA.childB === childB).toBeTruthy();
        expect(childA.parentA === parentA).toBeTruthy();
        expect(childA.parentB === parentB).toBeTruthy();

        expect(childB.childA === childA).toBeTruthy();
        expect(childB.parentA === parentA).toBeTruthy();
        expect(childB.parentB === parentB).toBeTruthy();

        expect(parentA.parentB === parentB).toBeTruthy();
        expect(parentB.parentA === parentA).toBeTruthy();

        try {
            childContext.getBean("notExistence");
            fail("Exception not thrown");
        } catch (e) {
            expect(e.message).toBe("No bean matched: notExistence");
        }
    }); // -------------------------------------------------------------------------------------------------------------

});
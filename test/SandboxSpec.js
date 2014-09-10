describe("Sandbox", function () {

    var iziS, myGlobals, bean;

    beforeEach(function () {
        myGlobals = {
            Nested: {}
        };
        iziS = izi.sandboxed(myGlobals);
    });//---------------------------------------------------------------------------------------------------------------

    it("Should resolve beans from custom globals", function () {
        // given
        myGlobals.Nested.Class = function () {
        };
        bean = {
            nested: iziS.inject("Nested.Class")
        };

        // when
        iziS.bakeBeans({
                           nested: new myGlobals.Nested.Class(),
                           bean: bean
                       });

        // then
        expect(bean.nested instanceof myGlobals.Nested.Class);

    });//---------------------------------------------------------------------------------------------------------------

    it("Should instantiate beans from custom globals", function () {
        // given
        myGlobals.Nested.Class1 = function () {
        };
        myGlobals.Nested.Class2 = function () {
        };
        myGlobals.Class3 = function () {
        };

        // when
        var ctx = iziS.bakeBeans({
                                     bean1: iziS.instantiate("Nested.Class1"),
                                     bean2: iziS.protoOf("Nested.Class2"),
                                     bean3: iziS.lazy("Class3")
                                 });

        // then
        expect(ctx.getBean("bean1") instanceof myGlobals.Nested.Class1).toBe(true);
        expect(ctx.getBean("bean2") instanceof myGlobals.Nested.Class2).toBe(true);
        expect(ctx.getBean("bean3") instanceof myGlobals.Class3).toBe(true);
        expect(ctx.getBean("Nested.Class1") instanceof myGlobals.Nested.Class1).toBe(true);
        expect(ctx.getBean("Nested.Class2") instanceof myGlobals.Nested.Class2).toBe(true);
        expect(ctx.getBean(myGlobals.Nested.Class1) instanceof myGlobals.Nested.Class1).toBe(true);
        expect(ctx.getBean(myGlobals.Nested.Class2) instanceof myGlobals.Nested.Class2).toBe(true);
        expect(ctx.getBean(myGlobals.Class3) instanceof myGlobals.Class3).toBe(true);

    });//---------------------------------------------------------------------------------------------------------------

});

describe("Dependency Injection", function () {

    beforeEach(function () {
        org = {};
    });

    it("Should inject dependencies by constructor args", function () {
        var ClassA, ClassB, a, b, context;

        // given
        ClassA = function (classB) {
            this.classB = classB;
        };
        ClassB = function () {
        };

        // when
        context = izi.bakeBeans({
                                    classA: izi.instantiate(ClassA).withArgs(izi.inject(ClassB)),
                                    classB: izi.instantiate(ClassB)
                                });

        // then
        a = context.getBean(ClassA);
        b = context.getBean(ClassB);
        expect(a.classB).toBe(b);
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should inject dependencies on properties", function () {
        var ClassA, ClassB, a, b, context;

        // given
        ClassA = function () {
            this.classB = izi.inject(ClassB);
        };
        ClassB = function () {
        };

        // when
        context = izi.bakeBeans({
                                    classA: new ClassA(),
                                    classB: new ClassB()
                                });

        // then
        a = context.getBean(ClassA);
        b = context.getBean(ClassB);
        expect(a.classB).toBe(b);
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should inject cross dependencies on already created beans", function () {
        var ClassA, ClassB, a, b, context;

        // given
        ClassA = function () {
            this.classB = izi.inject(ClassB);
        };
        ClassB = function () {
            this.classA = izi.inject(ClassA);
        };

        // when
        context = izi.bakeBeans({
                                    classA: new ClassA(),
                                    classB: new ClassB()
                                });

        // then
        a = context.getBean(ClassA);
        b = context.getBean(ClassB);
        expect(a.classB).toBe(b);
        expect(b.classA).toBe(a);
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should inject cross dependencies on singleton beans", function () {
        var ClassA, ClassB, a, b, context;

        // given
        ClassA = function () {
            this.classB = izi.inject(ClassB);
        };
        ClassB = function () {
            this.classA = izi.inject(ClassA);
        };

        // when
        context = izi.bakeBeans({
                                    classA: izi.instantiate(ClassA),
                                    classB: izi.instantiate(ClassB)
                                });

        // then
        a = context.getBean(ClassA);
        b = context.getBean(ClassB);
        expect(a.classB).toBe(b);
        expect(b.classA).toBe(a);
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should inject cross dependencies on lazy singleton beans", function () {
        var ClassA, ClassB, a, b, context;

        // given
        ClassA = function () {
            this.classB = izi.inject(ClassB);
        };
        ClassB = function () {
            this.classA = izi.inject(ClassA);
        };

        // when
        context = izi.bakeBeans({
                                    classA: izi.lazy(ClassA),
                                    classB: izi.lazy(ClassB)
                                });

        // then
        a = context.getBean(ClassA);
        b = context.getBean(ClassB);
        expect(a.classB).toBe(b);
        expect(b.classA).toBe(a);
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should inject mixed dependencies", function () {
        var ClassA, ClassB, ClassC, a, context;

        // given
        ClassA = function (classB) {
            this.classB = classB;
            this.classC = izi.inject(ClassC);
        };
        ClassB = function () {
        };
        ClassC = function () {
        };

        // when
        context = izi.bakeBeans({
                                    classA: izi.instantiate(ClassA).withArgs(izi.inject(ClassB)),
                                    classB: new ClassB(),
                                    classC: izi.protoOf(ClassC)
                                });

        // then
        a = context.getBean(ClassA);
        expect(a.classB instanceof ClassB).toBeTruthy();
        expect(a.classC instanceof ClassC).toBeTruthy();
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should throw exception when circular dependencies in constructors", function () {
        var ClassA, ClassB, ClassC;

        // given
        ClassA = function (classB) {
        };
        ClassB = function (classC) {
        };
        ClassC = function (classA) {
        };

        // when/then
        try {
            izi.bakeBeans({
                              a: izi.instantiate(ClassA).withArgs(izi.inject("b")),
                              b: izi.instantiate(ClassB).withArgs(izi.inject(ClassC)),
                              c: izi.instantiate(ClassC).withArgs(izi.inject(ClassA))
                          });
            fail("Exception not thrown");
        } catch (e) {
            expect(e.message).toBe("Circular dependencies found. If it is possible try inject those dependencies by properties instead by arguments.");
        }
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should inject dependency by dotted string class", function () {
        var a, b, context;

        // given
        org.ClassA = function () {
            this.classB = izi.inject("org.ClassB");
        };
        org.ClassB = function () {
        };

        // when
        context = izi.bakeBeans({
                                    classA: new org.ClassA(),
                                    classB: new org.ClassB()
                                });

        // then
        a = context.getBean("org.ClassA");
        b = context.getBean("org.ClassB");
        expect(a.classB).toBe(b);
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should throw smart error when injecting not existing bean (by constructor dependency)", function () {
        var Class, context;

        // given
        Class = function () {
        };

        // when/then
        expect(function () {
            context = izi.bakeBeans({
                                        aClass: izi.instantiate(Class).withArgs(izi.inject("not existing bean"))
                                    });
        }).toThrowContaining("Bean couldn't be found from injection at line:");

    }); // -------------------------------------------------------------------------------------------------------------

    it("Should throw smart error when injecting not existing bean (by object property)", function () {
        var Class, context;

        // given
        Class = function () {
            this.classX = izi.inject("not existing bean")
        };

        // when/then
        expect(function () {
            context = izi.bakeBeans({
                                        aClass: izi.instantiate(Class)
                                    });
        }).toThrowContaining("Bean couldn't be found from injection at line:");

        if (izi.debug && (
            window.navigator.userAgent.indexOf("Chrome") > -1 ||
            window.navigator.userAgent.indexOf("Firefox") > -1)
            ) {
            expect(function () {
                context = izi.bakeBeans({
                                            aClass: izi.instantiate(Class)
                                        });
            }).toThrowContaining("210");
        }

    }); // -------------------------------------------------------------------------------------------------------------

    it("Should call iziInit() and iziContext() in proper order on injected beans", function () {
        var ClassA, ClassB, ClassC, ClassD, calledIziInit = [], calledIziContext = [];

        // given
        ClassA = function () {
            this.classB = izi.inject("classB");

            this.iziInit = function () {
                calledIziInit.push("ClassA");
            };

            this.iziContext = function () {
                calledIziContext.push("ClassA");
            }
        };
        ClassB = function () {
            this.classC = izi.inject("classC");

            this.iziInit = function () {
                calledIziInit.push("ClassB");
            };

            this.iziContext = function () {
                calledIziContext.push("ClassB");
            }
        };
        ClassC = function (classD) {
            this.iziInit = function () {
                calledIziInit.push("ClassC");
            };

            this.iziContext = function () {
                calledIziContext.push("ClassC");
            }
        };
        ClassD = function () {

            this.iziInit = function () {
                calledIziInit.push("ClassD");
            };

            this.iziContext = function () {
                calledIziContext.push("ClassD");
            }
        };

        // when
        izi.bakeBeans({
                          classC: izi.instantiate(ClassC).withArgs(izi.inject('classD')),
                          classA: new ClassA(),
                          classD: new ClassD(),
                          classB: new ClassB()
                      });

        // then
        expect(calledIziInit).toEqual(["ClassD", "ClassC", "ClassB", "ClassA"]);
        expect(calledIziContext).toEqual(["ClassD", "ClassC", "ClassB", "ClassA"]);

    }); // -------------------------------------------------------------------------------------------------------------

    it("Should overwrite properties on bean definition", function () {
        var ClassA, ClassB, ClassC, config, context, bean1, bean2, bean3, bean4;

        // given
        ClassA = function () {
            this.field1 = "Value 1";
            this.field2 = izi.inject("ClassB");
        };
        ClassB = function () {
        };
        ClassC = function () {
        };

        // when
        config = {
            bean1: new ClassC(),
            bean2: izi.instantiate(ClassA).withProps({field1: "Value 2", field2: izi.inject("bean1")}),
            bean3: izi.protoOf(ClassA).withProps({field1: "Value 3", field2: izi.inject("bean1")}),
            bean4: izi.lazy(ClassA).withProps({field1: "Value 4", field2: izi.inject("bean1")})
        };
        context = izi.bakeBeans(config);

        // then
        bean1 = context.getBean('bean1');
        bean2 = context.getBean('bean2');
        bean3 = context.getBean('bean3');
        bean4 = context.getBean('bean4');

        expect(bean2.field1).toBe("Value 2");
        expect(bean2.field2).toBe(bean1);

        expect(bean3.field1).toBe("Value 3");
        expect(bean3.field2).toBe(bean1);

        expect(bean4.field1).toBe("Value 4");
        expect(bean4.field2).toBe(bean1);

    }); // -------------------------------------------------------------------------------------------------------------

    it("Should instantiate global accessible classes by string", function () {
        var context, config, bean1, bean2, bean3;

        // given
        GlobalClass = function () {
            this.field = "Value";
        };

        // when
        config = {
            bean1: izi.instantiate("GlobalClass"),
            bean2: izi.protoOf("GlobalClass"),
            bean3: izi.lazy("GlobalClass")
        };
        context = izi.bakeBeans(config);

        // then
        expect(context.getBean('bean1') instanceof GlobalClass).toBeTruthy();
        expect(context.getBean('bean2') instanceof GlobalClass).toBeTruthy();
        expect(context.getBean('bean3') instanceof GlobalClass).toBeTruthy();

    }); // -------------------------------------------------------------------------------------------------------------
});
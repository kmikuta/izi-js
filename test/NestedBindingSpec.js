describe("Nested Binding", function () {

    var level1, level2, level3, target, source,
        Izi = izi.module,
        bindingImpl = {
            changeObservers: [
            ],
            valueReaders: [
                Izi.binding.impl.readByCapitalizedGetter,
                Izi.binding.impl.readByGet,
                Izi.binding.impl.readFromOwnedProperty,
                Izi.binding.impl.readFromProperty
            ],
            valueWriters: [
                Izi.binding.impl.writeByFunction,
                Izi.binding.impl.writeBySet,
                Izi.binding.impl.writeToProperty
            ]
        },
        SourceModel = izi.modelOf({
                                      fields: [
                                          {name: "value", initialValue: "sourceDefault"}
                                      ]
                                  }),
        ChildModel = izi.modelOf({
                                     fields: [
                                         {name: "childField", initialValue: "default"}
                                     ]
                                 }),
        ParentModel = izi.modelOf({
                                     fields: [
                                         {name: "childModel"}
                                     ]
                                 });

    izi.registerBindingImpl(bindingImpl);

    beforeEach(function () {

        level1 = new ParentModel();
        level2 = new ParentModel();
        level3 = new ChildModel();
        source = new SourceModel();
        target = {};

        level1.set("childModel", level2);
        level2.set("childModel", level3);
    });

    it("Should bind more than one level nested models", function () {

        // given
        izi.bind().valueOf(level1, "childModel.childModel.childField").to().valueOf(target);
        expect(target.value).toBe("default");

        // when
        level3.set("childField", "changedValue");

        // then
        expect(target.value).toBe("changedValue");
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should bind two way", function () {

        // given
        target = new ChildModel();
        izi.bind().valueOf(level1, "childModel.childModel.childField").to(target, "childField").twoWay();
        expect(target.childField()).toBe("default");

        // when
        target.childField("two way test");

        // then
        expect(level1.childModel().childModel().childField()).toBe("two way test");
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should trigger binding when changed model in the middle of chain", function () {

        // given
        izi.bind().valueOf(level1, "childModel.childModel.childField").to().valueOf(target);

        // when
        var joe = new ChildModel();
        joe.childField("Joe");
        level2.set("childModel", joe);

        // then
        expect(target.value).toBe("Joe");
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should trigger binding when model in the middle is missing", function () {

        // given
        izi.bind().valueOf(level1, "childModel.childModel.childField").to().valueOf(target);
        expect(target.value).toBe("default");

        // when
        level2.set("childModel", null);

        // then
        expect(target.value).toBeUndefined();
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should trigger binding when top model is missing", function () {

        // given
        izi.bind().valueOf(level1, "childModel.childModel.childField").to().valueOf(target);
        expect(target.value).toBe("default");

        // when
        level1.set("childModel", null);

        // then
        expect(target.value).toBeUndefined();
    }); // -------------------------------------------------------------------------------------------------------------

    it("Shouldn't bind after unbind()", function () {

        // given
        var binding = izi.bind().valueOf(level1, "childModel.childModel.childField").to().valueOf(target);
        expect(target.value).toBe("default");
        binding.unbind();

        // when
        level3.set("childField", "changedValue");

        // then
        expect(target.value).toBe("default");
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should be possible to manual steering", function () {

        // given
        var options = {executeAtStartup: false, auto: false, debug: true},
            binding = izi.bind(options).valueOf(level1, "childModel.childModel.childField").to().valueOf(target);
        expect(target.value).toBeUndefined();

        // when
        level3.set("childField", "changedValue");
        expect(target.value).toBeUndefined();
        binding.execute();

        // then
        expect(target.value).toBe("changedValue");

    }); // -------------------------------------------------------------------------------------------------------------

    it("Should bind value to nested model", function () {

        // given
        izi.bind().valueOf(source).to(level1, "childModel.childModel.childField");
        expect(level3.get("childField")).toBe("sourceDefault");

        // when
        source.set("value", "Joe");

        // then
        expect(level3.get("childField")).toBe("Joe");
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should bind value to nested plain object", function () {

        // given
        var nestedPlainObject = {
            level1: {
                level2: {
                    value: undefined
                }
            }
        };
        izi.bind().valueOf(source).to(nestedPlainObject, "level1.level2.value");
        expect(nestedPlainObject.level1.level2.value).toBe("sourceDefault");

        // when
        source.set("value", "Joe");

        // then
        expect(nestedPlainObject.level1.level2.value).toBe("Joe");
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should bind value to nested plain object using function", function () {

        // given
        var nestedPlainObject = {
            level1: {
                level2: {
                    value: undefined
                }
            }
        };
        izi.bind().valueOf(source).to(function (value) {nestedPlainObject.level1.level2.value = value});
        expect(nestedPlainObject.level1.level2.value).toBe("sourceDefault");

        // when
        source.set("value", "Joe");

        // then
        expect(nestedPlainObject.level1.level2.value).toBe("Joe");
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should bind value to replaced nested object in the middle", function () {

        // given
        var nestedPlainObject = {
            level1: {
                level2: undefined
            }
        };
        izi.bind().valueOf(source).to(nestedPlainObject, "level1.level2.value");
        nestedPlainObject.level1.level2 = {};

        // when
        source.set("value", "Joe");

        // then
        expect(nestedPlainObject.level1.level2.value).toBe("Joe");
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should bind value from chain where first item is not watchable", function () {

        // given
        var notWatchableSource = {
            childModel: level3
        };
        izi.bind().valueOf(notWatchableSource, "childModel.childField").to().valueOf(target);
        expect(target.value).toBe("default");

        // when
        level3.set("childField", "Joe");

        // then
        expect(target.value).toBe("Joe");
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should bind value from chain where last item is not watchable", function () {

        // given
        level3.set("childField", ["Init"]);
        izi.bind().valueOf(level1, "childModel.childModel.childField.0").to().valueOf(target);
        expect(target.value).toBe("Init");

        // when
        level3.set("childField", ["First array element"]);

        // then
        expect(target.value).toBe("First array element");
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should bind more than once", function () {

        // given
        izi.bind().valueOf(level1, "childModel.childModel.childField.0").to(target, "first");
        izi.bind().valueOf(level1, "childModel.childModel.childField").to(target, "second");

        // when
        var newChildField = ["First array element"];
        level3.set("childField", newChildField);

        // then
        expect(target.first).toBe("First array element");
        expect(target.second).toBe(newChildField);
    }); // -------------------------------------------------------------------------------------------------------------

});
describe("Binding", function () {

    var Izi = izi.module,
        bindingImpl = {
            changeObservers: [
            ],
            valueReaders: [
                Izi.binding.impl.readByCapitalizedGetter,
                Izi.binding.impl.readByGet,
                Izi.binding.impl.readFromProperty,
            ],
            valueWriters: [
                Izi.binding.impl.writeByFunction,
                Izi.binding.impl.writeToProperty
            ]
        },
        Model = izi.modelOf({
                                fields: [
                                    {name: "firstName"},
                                    {name: "lastName"},
                                    {name: "title"}
                                ]
                            });

    izi.registerBindingImpl(bindingImpl);

    it("Should log debug information while binding is executing", function () {
        // given
        var source = new Model(),
            target = {},
            bind = izi.bind({debug: true});

        source.firstName("John").lastName("Doe");

        // when
        bind.valueOf(source, "firstName").to(target, "firstName");
        bind.valueOf(source, "lastName").to(target, "lastName");

        // then
        // WATCH ON CONSOLE...
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should bind two models", function () {

        // given
        var source = new Model();
        var target = {};

        izi.bind().valueOf(source, "firstName").to(target, "firstName");

        // when
        source.firstName("Joe");

        // then
        expect(target.firstName).toEqual("Joe");

    }); // -------------------------------------------------------------------------------------------------------------

    it("Should bind two ways", function () {

        // given
        var source = new Model().setFirstName("source init first name");
        var target = new Model().setFirstName("target init first name");
        izi.bind().valueOf(source, "firstName").to(target, "firstName").twoWay();
        expect(target.firstName()).toBe("source init first name");

        // when
        source.firstName("Joe");
        // then
        expect(target.firstName()).toBe("Joe");

        // when
        target.firstName("Alex");
        // then
        expect(source.firstName()).toBe("Alex");

    }); // -------------------------------------------------------------------------------------------------------------

    it("Should unbind two ways binding", function () {

        // given
        var source = new Model();
        var target = new Model();
        var tw = izi.bind().valueOf(source, "firstName").to(target, "firstName").twoWay();
        source.firstName("XXX");

        // when
        tw.unbind();

        // then
        source.firstName("YYY");
        expect(target.firstName()).toBe("XXX");

        // then
        target.firstName("ZZZ");
        expect(source.firstName()).toBe("YYY");

        // when
        tw.bind();
        source.firstName("Joe");
        expect(target.firstName()).toBe("Joe");

        target.firstName("Alex");
        expect(source.firstName()).toBe("Alex");

    }); // -------------------------------------------------------------------------------------------------------------

    it("Shouldn't bind two way when through function is defined", function () {

        // given
        var source = new Model();
        var target = new Model();
        var formatter = function () {};

        // when
        expect(function () {
            izi.bind().valueOf(source, "firstName").through(formatter).to(target, "firstName").twoWay();
        }).toThrowError("Two way binding doesn't allow to use .through(fn) function");

    }); // -------------------------------------------------------------------------------------------------------------

    it("Shouldn't bind two way when target is a function", function () {

        // given
        var source = new Model();
        var target = function () {};


        // when
        expect(function () {
            izi.bind().valueOf(source, "firstName").to(target).twoWay();
        }).toThrowError("Two way binding doesn't allow to use function as a target");

    }); // -------------------------------------------------------------------------------------------------------------

    it("Should trigger binding on change of given properties", function () {

        // given
        var target = {};
        var source = new Model();
        source.getFullName = function () {
            return this.firstName() + " " + this.lastName();
        };

        izi.bind().valueOf(source, "fullName")
            .onChangeOf("firstName")
            .onChangeOf("lastName")
            .to(target, "fullName");

        // when/then
        source.firstName("Joe");
        expect(target.fullName).toEqual("Joe undefined");

        // when/then
        source.lastName("Tribiani");
        expect(target.fullName).toEqual("Joe Tribiani");

    }); // -------------------------------------------------------------------------------------------------------------

    it("Should not bind", function () {

        // given
        var source = new Model();
        var target = {};

        izi.bind().valueOf(source, "firstName").to(target, "firstName").stopObserving();

        // when
        source.firstName("Joe");

        // then
        expect(target.firstName).not.toBeDefined();

    }); // -------------------------------------------------------------------------------------------------------------

    it("Should read value by capitalized getter first", function () {

        // given
        var source = new Model();
        source.getFirstName = function () {
            return "Mike";
        };
        var target = {};

        // when
        izi.bind().valueOf(source, "firstName").to(target, "firstName");

        // then
        expect(target.firstName).toEqual("Mike");

    }); // -------------------------------------------------------------------------------------------------------------

    it("Should trigger binding at the beginning", function () {

        // given
        var source = new Model();
        source.firstName("Joe");
        var target = {};

        // when
        izi.bind().valueOf(source, "firstName").to(target, "firstName");

        // then
        expect(target.firstName).toEqual("Joe");

    }); // -------------------------------------------------------------------------------------------------------------

    it("Should bind through formatter", function () {

        //given
        var upperCaseFormatter = function (value) {
            return value ? value.toUpperCase() : "";
        };

        var source = new Model();
        var target = {};

        izi.bind().valueOf(source, "title").through(upperCaseFormatter).to(target, "title");

        //when
        source.title("Doctor");

        //then
        expect(target.title).toEqual("DOCTOR");

    }); // -------------------------------------------------------------------------------------------------------------

    it("Should bind many source properties", function () {

        //given
        function fullNameFormatter(firstName, lastName) {
            return firstName + " " + lastName;
        }

        var source = new Model();
        var target = {};
        izi.bind().valueOf(source, "firstName", "lastName").through(fullNameFormatter).to(target, "fullName");

        //when
        source.set("firstName", "John");
        source.set("lastName", "Smith");

        //then
        expect(target.fullName).toEqual("John Smith");

    }); // -------------------------------------------------------------------------------------------------------------

    it("Should throw exception when many properties given and no formatter was passed", function () {

        //given
        var source = new Model();
        var target = {};

        // when
        expect(function () {
            izi.bind().valueOf(source, "firstName", "lastName").to(target, "fullName");

            // then
        }).toThrowError("You must use formatter if you want to bind more properties than one. Ex: izi.bind().valueOf(model, 'firstName', 'lastName').through(concatFormatter)...");

    }); // -------------------------------------------------------------------------------------------------------------

    it("Should bind to function", function () {

        //given
        var source = new Model();
        source.set("firstName", "John");
        var targetValue;
        var targetFunction = function (value) {
            targetValue = value;
        };

        // when
        izi.bind().valueOf(source, "firstName").to(targetFunction);
        expect(targetValue).toBe("John");

    }); // -------------------------------------------------------------------------------------------------------------

    it("Should bind to function with given scope", function () {

        //given
        var source = new Model();
        source.set("firstName", "John");
        var targetScope;
        var scope = {};
        var targetFunction = function (value) {
            targetScope = this;
        };

        // when
        izi.bind().valueOf(source, "firstName").to(targetFunction, scope);
        expect(targetScope).toBe(scope);

    }); // -------------------------------------------------------------------------------------------------------------

    it("Should unbind all bindings", function () {

        //given
        var source = new Model(),
            bind = izi.bind(),
            target = {};
        bind.valueOf(source, "firstName").to(target, "firstName");
        bind.valueOf(source, "lastName").to(target, "lastName");

        // when
        bind.unbindAll();
        source.set("firstName", "John");
        source.set("lastName", "Doe");

        // then
        expect(target.firstName).toBeUndefined();
        expect(target.lastName).toBeUndefined();

    }); // -------------------------------------------------------------------------------------------------------------

    it("Shouldn't execute binding when {auto: false} is set in config", function () {

        //given
        var source = new Model(),
            bind = izi.bind({auto: false}),
            target = {};
        source.set("firstName", "John");

        // when
        bind.valueOf(source, "firstName").to(target, "firstName");

        // then
        expect(target.firstName).toBeUndefined();

    }); // -------------------------------------------------------------------------------------------------------------

    it("Should execute binding manually when {auto: false} is set in config", function () {

        //given
        var source = new Model(),
            target = {},
            binding = izi.bind({auto: false}).valueOf(source, "firstName").to(target, "firstName");
        source.set("firstName", "John");
        expect(target.firstName).toBeUndefined();

        // when
        binding.execute();

        // then
        expect(target.firstName).toBe("John");

    }); // -------------------------------------------------------------------------------------------------------------

    it("Should execute all bindings manually when {auto: false} is set in config", function () {

        //given
        var source = new Model(),
            target = {},
            bind = izi.bind({auto: false, executeAtStartup: false});

        bind.valueOf(source, "firstName").to(target, "firstName");
        bind.valueOf(source, "lastName").to(target, "lastName");

        source.firstName("John").lastName("Smith");

        expect(target.firstName).toBeUndefined();
        expect(target.lastName).toBeUndefined();

        // when
        bind.executeAll();

        // then
        expect(target.firstName).toBe("John");
        expect(target.lastName).toBe("Smith");

    }); // -------------------------------------------------------------------------------------------------------------

    it("Shouldn't execute binding at startup when {executeAtStartup: false} is set in config", function () {

        //given
        var source = new Model(),
            target = {};
        source.set("firstName", "John");

        // when
        izi.bind({executeAtStartup: false}).valueOf(source, "firstName").to(target, "firstName");
        expect(target.firstName).toBeUndefined();

        // then
        source.set("firstName", "Alex");
        expect(target.firstName).toBe("Alex");

    }); // -------------------------------------------------------------------------------------------------------------

    it("Should be able to bind from source with custom property change registration", function () {

        //given
        var source = {

                firstName: "John",

                iziObserveProperty: function (property, propertyChangeCallback) {
                    var me = this;
                    me.propertyChangeCallback = propertyChangeCallback;
                    return function () {
                        me.propertyChangeCallback = undefined;
                    }
                },

                triggerChange: function () {
                    if (this.propertyChangeCallback) {
                        this.propertyChangeCallback();
                    }
                }
            },
            target = {},
            binding = izi.bind().valueOf(source, "firstName").to(target, "firstName");

        expect(target.firstName).toBe("John");

        // when
        source.firstName = "Alex";
        source.triggerChange();

        // then
        expect(target.firstName).toBe("Alex");

        // when (should unbind)
        binding.unbind();
        source.firstName = "Peter";
        source.triggerChange();

        // then
        expect(target.firstName).toBe("Alex");

    }); // -------------------------------------------------------------------------------------------------------------

});
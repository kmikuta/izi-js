describe("Model", function () {
    var model, User;

    beforeEach(function () {
        User = izi.modelOf({
                               fields: [
                                   'firstName',
                                   {name: 'lastName'},
                                   {name: 'title'}
                               ],

                               getFullName: function () {
                                   return this.get('firstName') + " " + this.get('lastName');
                               },

                               setTitle: function (value) {
                                   return this.set("title", value + "##");
                               },

                               getTitle: function () {
                                   return "##" + this.get("title");
                               }
                           });

        model = new User();
    });//---------------------------------------------------------------------------------------------------------------

    it("Should be able by setting property by set method and read by get method", function () {

        // when
        model.set("firstName", "John").set("lastName", "Doe");

        // then
        expect(model.get("firstName")).toBe("John");
        expect(model.get("lastName")).toBe("Doe");
    });//---------------------------------------------------------------------------------------------------------------

    it("Should be able to access by setters and getters", function () {

        // when
        model.setFirstName("John").setLastName("Doe");

        // then
        expect(model.getFirstName()).toBe("John");
        expect(model.getLastName()).toBe("Doe");
    });//---------------------------------------------------------------------------------------------------------------

    it("Should be able to overwrite setter", function () {

        // when
        model.setTitle("Dr");

        // then
        expect(model.get("title")).toBe("Dr##");

        // when
        model.title("Mgr");

        // then
        expect(model.get("title")).toBe("Mgr##");
    });//---------------------------------------------------------------------------------------------------------------

    it("Should be able to overwrite getter", function () {

        // when
        model.set("title", "Dr");

        // then
        expect(model.title()).toBe("##Dr");
        expect(model.getTitle()).toBe("##Dr");
    });//---------------------------------------------------------------------------------------------------------------

    it("Should be able setting property by its function name", function () {

        // when
        model.firstName("John").lastName("Doe");

        // then
        expect(model.firstName()).toBe("John");
        expect(model.lastName()).toBe("Doe");
    });//---------------------------------------------------------------------------------------------------------------

    it("Should be able setting map of properties", function () {

        // when
        model.set({
                      firstName: "John",
                      lastName: "Doe"
                  });

        // then
        expect(model.firstName()).toBe("John");
        expect(model.lastName()).toBe("Doe");
    });//---------------------------------------------------------------------------------------------------------------

    it("Should set initial value at the beginning", function () {

        // given
        var User = izi.modelOf({
                                   fields: [
                                       {name: "firstName", initialValue: "John"},
                                       {name: "lastName", defaultValue: "Smith", initialValue: "Kowalski"}
                                   ]
                               });

        // when
        var model = new User();

        // then
        expect(model.firstName()).toBe("John");
        expect(model.lastName()).toBe("Smith");
    });//---------------------------------------------------------------------------------------------------------------

    it("Should dispatch event only once when property has been changed", function () {

        // given
        var dispatched = 0;

        function listener() {
            dispatched++;
        }

        model.addListener("change", listener);

        // when
        model.firstName("John");
        model.firstName("John");

        // then
        expect(dispatched).toBe(1);
    });//---------------------------------------------------------------------------------------------------------------

    it("Should dispatch property event only once when property has been changed", function () {

        // given
        var dispatched = 0;

        function listener() {
            dispatched++;
        }

        model.addListener("firstNameChange", listener);

        // when
        model.firstName("John");
        model.firstName("John");

        // then
        expect(dispatched).toBe(1);
    });//---------------------------------------------------------------------------------------------------------------

    it("Should not dispatch event when property hasn't been changed", function () {

        // given
        var dispatched = 0;

        function listener() {
            dispatched++;
        }

        model.addListener("change", listener);
        model.removeListener("change", listener);

        // when
        model.firstName("John");

        // then
        expect(dispatched).toBe(0);
    });//---------------------------------------------------------------------------------------------------------------

    it("Should remove only one listener", function () {

        // given
        var dispatched = 0;

        function listener() {
            dispatched++;
        }

        model.addListener("change", listener);
        model.addListener("change", listener);
        model.addListener("change", listener);
        model.addListener("change", listener);
        model.removeListener("change", listener);

        // when
        model.firstName("John");

        // then
        expect(dispatched).toBe(3);
    });//---------------------------------------------------------------------------------------------------------------

    it("Should not dispatch property event when property hasn't been changed", function () {

        // given
        var dispatched = 0;

        function listener() {
            dispatched++;
        }

        model.addListener("firstNameChange", listener);
        model.removeListener("firstNameChange", listener);

        // when
        model.firstName("John");

        // then
        expect(dispatched).toBe(0);
    });//---------------------------------------------------------------------------------------------------------------

    it("Should be able to call getFullName on model", function () {

        // given
        model.firstName("John");
        model.lastName("Doe");

        // when
        var fullName = model.getFullName();

        // then
        expect(fullName).toBe("John Doe");
    });//---------------------------------------------------------------------------------------------------------------

    it("Should not overlap data between models", function () {

        // given
        var user1 = new User();
        var user2 = new User();

        // when
        user1.firstName("Joe");

        // then
        expect(user2.firstName()).toBe(undefined);
    });//---------------------------------------------------------------------------------------------------------------

    it("Should not share functions between defined classes", function () {

        // given
        var User1 = izi.modelOf({
                                    fields: [
                                        {name: "firstName"}
                                    ]
                                });
        var User2 = izi.modelOf({
                                    fields: [
                                        {name: "lastName"}
                                    ]
                                });

        // when
        var user1 = new User1();
        var user2 = new User2();

        // then
        expect(typeof user1.firstName).toBe("function");
        expect(user1.lastName).toBeUndefined();

        expect(typeof user2.lastName).toBe("function");
        expect(user1.lastName).toBeUndefined();
    });//---------------------------------------------------------------------------------------------------------------

    it("Should convert to plain object", function () {

        // given
        var user = new User().firstName("John").lastName("Smith").title("dr.");

        // when
        var plainObject = user.toPlainObject();

        // then
        expect(plainObject).toEqual({firstName: "John", lastName: "Smith", title: "##dr.##"});
    });//---------------------------------------------------------------------------------------------------------------

    it("Should convert nested model and collection to plain object", function () {

        // given
        var Root = izi.modelOf({
                                   fields: [
                                       {name: "user"},
                                       {name: "users"}
                                   ]
                               });
        var root = new Root();
        root.user(new User().firstName("John").lastName("Smith").title("dr."));
        root.users([
                       new User().firstName("John").lastName("Smith").title("dr."),
                       new User().firstName("James").lastName("Bond").title("007")
                   ]);

        // when
        var plainObject = root.toPlainObject();

        // then
        expect(plainObject).toEqual({
                                        user: {firstName: "John", lastName: "Smith", title: "##dr.##"},
                                        users: [
                                            {firstName: "John", lastName: "Smith", title: "##dr.##"},
                                            {firstName: "James", lastName: "Bond", title: "##007##"}
                                        ]
                                    });
    });//---------------------------------------------------------------------------------------------------------------

    it("Should convert items with .forEach method to plain object", function () {

        // given
        var Root = izi.modelOf({
                                   fields: ["wrappedCollection"]
                               });
        var wrapped = {
            items: [
                new User().firstName("John").lastName("Smith").title("dr."),
                new User().firstName("James").lastName("Bond").title("007")
            ],

            forEach: function (callback) {
                for (var i=0; i<this.items.length; i++) {
                    callback.call(this, this.items[i]);
                }
            }
        };
        var root = new Root().wrappedCollection(wrapped);

        // when
        var plainObject = root.toPlainObject();

        // then
        expect(plainObject).toEqual({
                                        wrappedCollection: [
                                            {firstName: "John", lastName: "Smith", title: "##dr.##"},
                                            {firstName: "James", lastName: "Bond", title: "##007##"}
                                        ]
                                    });
    });//---------------------------------------------------------------------------------------------------------------

    it("Should convert circular references to plain object", function () {

        // given
        var TreeItem = izi.modelOf({
                                   fields: ["parent", "children"]
                               });
        var root = new TreeItem();
        var child = new TreeItem().parent(root);
        root.children([child]);

        // when
        var rootPlainObject = root.toPlainObject();
        var childPlainObject = rootPlainObject.children[0];

        // then
        expect(childPlainObject.parent).toBe(rootPlainObject);
        expect(root.__iziCircularCopy__).toBeUndefined();  // verify circular dependencies check is cleaned up
        expect(child.__iziCircularCopy__).toBeUndefined(); // verify circular dependencies check is cleaned up
    });//---------------------------------------------------------------------------------------------------------------

    it("Should convert custom getter by overriding toPlainObject() method", function () {

        // given
        var User = izi.modelOf({
                               fields: ['firstName', 'lastName'],

                               getFullName: function () {
                                   return this.get('firstName') + " " + this.get('lastName');
                               },

                               toPlainObject: function () {
                                   var plainObject = User.upper.toPlainObject.call(this);
                                   plainObject.fullName = this.getFullName();
                                   return plainObject;
                               }
                           });
        // when
        var plainObject = new User().firstName("John").lastName("Smith").toPlainObject();

        // then
        expect(plainObject).toEqual({firstName: "John", lastName:"Smith", fullName: "John Smith"});

    });//---------------------------------------------------------------------------------------------------------------
});

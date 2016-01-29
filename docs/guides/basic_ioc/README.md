<h1>IoC &amp; DI</h1>

<h2>Creating beans container</h2>
Just use {@link izi#bakeBeans izi.bakeBeans()} method:

    izi.bakeBeans({
        model: new Demo.model.SearchModel(),
        search: new Demo.behavior.Search(),
        service: new Demo.service.SearchService(),
        view: new Demo.view.SearchView()
    });

<h2>Beans definitions examples</h2>
<h3>Singleton</h3>
This kind of bean is initiated only once at the beginning of beans containers lifecycle. There are 3 ways for defining
singletons in container:

    izi.bakeBeans({
        model: izi.instantiate(Demo.model.SearchModel),
        search: Demo.behavior.Search,                     // Since 1.7.0
        view: new Demo.view.SearchView()
    });

<h3>Lazy Singleton</h3>
Similar to Singleton but the instance will be created when it is needed as a dependency:

    izi.bakeBeans({
        model: izi.lazyOf(Demo.model.SearchModel),
        search: izi.lazyOf("Demo.behavior.Search")
    });

<h3>Prototype</h3>
Every time a new instance is created when this bean is needed as a dependency:

    izi.bakeBeans({
        model: izi.protoOf(Demo.model.SearchModel),
        search: izi.protoOf("Demo.behavior.Search")
    });

<h2>Injecting beans inside container</h2>
After instantiating all beans <strong>izi</strong> scans each bean property and if there is value of {@link izi#inject izi.inject(...)} -
replaces this value with corresponding bean. After that <strong>izi</strong> tries to call function <strong>iziInit()</strong> if exists on
bean. This is the best place where you should put code which needs correctly injected dependencies.
{@link izi#inject izi.inject()} is able to find bean by its id or type.

In examples below classes are built using [MooTools framework][1]

<h3>By bean type:</h3>
    Demo.behavior.Search = new Class({
        model: izi.inject(Demo.model.SearchModel),
        service: izi.inject(Demo.service.SearchService),

        iziInit: function () {
            // this.model and this.service are available now
        }
    });

<h3>By bean type using dotted string notation:</h3>

    Demo.behavior.Search = new Class({
        model: izi.inject("Demo.model.SearchModel"),
        service: izi.inject("Demo.service.SearchService"),

        iziInit: function () {
            // this.model and this.service are available now
        }
    });

<h3>By bean id:</h3>

    Demo.behavior.Search = new Class({
        model: izi.inject("model"),
        service: izi.inject("service"),

        iziInit: function () {
            // this.model and this.service are available now
        }
    });

<h3>Through convert function:</h3>

Since: 1.7.0

    Demo.behavior.Login = new Class({
        user: izi.inject("Demo.model.BigModel").trough(function (bigModel) {
            return bigModel.user;
        }),

        iziInit: function () {
            // this.user is ready to use
        }
    });

<h3>Inject property of dependency:</h3>

Since: 1.7.0

    Demo.behavior.Login = new Class({
        user: izi.inject("Demo.model.BigModel").property("user"),

        iziInit: function () {
            // this.user is ready to use
        }
    });

<h3>By custom injector (it doesn't work in constructor arguments injections):</h3>

Since: 1.7.0

    Demo.behavior.Search = new Class({
        model: izi.inject("Demo.model.SearchModel").by(function (target, prop, dependency) {

            // target - instance of Demo.behavior.Search
            // prop = "model"
            // dependency - instance of Demo.model.SearchModel

            target.setModel(dependency);
        });

        setModel: function (searchModel) {
            this.model = searchModel;
            // you may do something else with searchModel here, but keep in mind that other dependencies are not ready yet!
        }
    });

<h2>Injecting dependencies as constructor arguments</h2>
If your javascript class needs some values passed as arguments of constructor - you can use {@link Izi.ioc.Config#withArgs withArgs}
function after {@link izi#instantiate izi.instantiate(...)}, {@link izi#lazy izi.lazy(...)} or {@link izi#protoOf izi.protoOf(...)}
functions. You can also pass as arguments dependencies from beans container using {@link izi#inject izi.inject()} function.

    izi.bakeBeans({
        model: new Demo.model.SearchModel(),
        search: new Demo.behavior.Search(),
        view: izi.instantiate(Demo.view.SearchView).withArgs(izi.inject("model"),
                                                             izi.inject(Demo.behavior.Search))
    });

<h2>Injecting dependencies on properties in beans definition</h2>
Sometimes you don't want to use {@link izi#inject izi.inject()} inside your class definition, because your bean can
be reused many times in the same beans context. You can configure and inject dependencies to its properties using
**withProps()** method, like in example below:

    izi.bakeBeans({

        view1: new Demo.view.View1(),
        view2: new Demo.view.View2(),

        behavior1: izi.instantiate(Demo.behavior.KeyNavigator).withProps({
            view: izi.inject('view1'),
            key: 'ENTER'
        },

        behavior2: izi.instantiate(Demo.behavior.KeyNavigator).withProps({
            view: izi.inject('view2'),
            key: 'SPACE'
        })
    });

<h2>Manually wiring dependencies</h2>
When for any reasons you can't put objects creation to the context and you need to wire dependencies into objects
 created outside of the context - then you may want to use {@link Izi.ioc.BeansContext#wire context.wire()}
 method of BeansContext.

    ClassWithDependencies = new Class({
        model: izi.inject(Demo.model.SearchModel),
    });

    ClassInsideContext = new Class({

        iziContext: function (context) {
            var objectCreatedOutsideOfContext = new ClassWithDependencies();

            context.wire(objectCreatedOutsideOfContext);

            console.log(objectCreatedOutsideOfContext.model);
        }
    });

    izi.bakeBeans({
        model: new Demo.model.SearchModel(),
        someBean: new ClassInsideContext()

        // There is no ClassWithDependencies here
    });

<h2>Destroying context</h2>
There are situations when you may need to dynamically create and destroy parts of your application. Imagine the GUI
which has unknown number of closable tabs created dynamically. In order to prevent memory leaks you should care
about releasing all listeners and callbacks that were created during tab creation.

If you want to destroy context with all beans inside and all descendant contexts - use
{@link Izi.ioc.BeansContext#destroy context.destroy()}.

<h3>What it does?</h3>
1. izi tries to call <code>.iziPreDestroy()</code> function on each bean created within beeing destroyed context. If
<code>.iziPreDestroy()</code> throws any exception - then destroying process is interrupted.
2. If none of <code>.iziPreDestroy()</code> methods thrown exception, then izi calls <code>.iziDestroy()</code>
on each bean. Any error thrown inside <code>.iziDestroy()</code> is caught and ignored.

If context has descendant contexts - all of them will be destroyed too. Destroying process begins from the deepest
assigned context.

<b></b>

    DynamicTabView = new Class(

        personModel: izi.inject(PersonModel);
        parentView: izi.inject(TabNavigator);
        savePerson: izi.inject(SavePersonBehavior);

        iziInit: function () {
            var bind = this.bind = izi.bind(),
                perform = this.perform = izi.perform(),
                personModel = this.personModel,
                savePerson = this.savePerson;

            // Create GUI
            this.firstName = new TextInput();
            this.lastName = new TextInput();
            this.saveButton = new SaveButton();

            this.parentView.addChildren(this.firstName, this.lastName, this.saveButton);

            // Bindings
            bind.valueOf(this.firstName).to(personModel, "firstName");
            bind.valueOf(this.lastName).to(personModel, "lastName");

            // Behaviors
            perform(savePerson).when("click").on(this.saveButton);
        },

        iziDestroy: function () {
            // remove all defined bindings
            this.bind.unbindAll();

            // remove all defined behaviors
            this.perform.stopObserving();
        }
    );

    var context = izi.bakeBeans({
        personModel: new PersonModel(),
        savePerson: new SavePersonBehavior(),
        personView: new DynamicTabView()
    });

    // ... somewhere on close button click:
    context.destroy();


[1]: http://mootools.net/docs/core/Class/Class
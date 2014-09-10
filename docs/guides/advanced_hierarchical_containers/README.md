<h1>Hierarchical IoC Containers</h1>

For more complex GUI it is naturally to divide the code to smaller parts - modules. Inside those modules there is
sometimes needed to use dependency from another module. <strong>izi</strong> supports hierarchical dependencies resolving.
There is no implemented <i>parallel</i> dependency resolving.

<h2>iziContext() method</h2>

After context creation there is executed <strong>iziContext(beansContext)</strong> method on each bean if exists.
This is a place where you can define descendant context.

<h2>1. Define Child classes</h2>

    // In classes from child module you can inject dependencies both from Child and Parent contexts:
    org.demo.child.ChildView = new Class({

        model: izi.inject("org.demo.child.ChildModel"),
        service: izi.inject("org.demo.child.ChildService"),

        parentView: izi.inject("org.demo.parent.ParentView"),

        iziInit: function () {
          // this.model, this.service and this.parentView are available now
          this.parentView.addChild(this);
        }
    });

    org.demo.child.ChildModel = new Class({}); //...
    org.demo.child.ChildService = new Class({}); //...

<h2>2. Define Child context config</h2>

    org.demo.child.ChildConfig = {
        childView: new org.demo.child.ChildView(),
        childModel: new org.demo.child.ChildModel(),
        childService: new org.demo.child.ChildService()
    };

<h2>3. Define Parent classes and put into one of them Child context initiating using iziContext() method</h2>

    // Parent view has iziContext method which creates Child context
    org.demo.parent.ParentView = new Class({

        model: izi.inject("org.demo.parent.ParentModel"),
        service: izi.inject("org.demo.child.ParentService"),

        iziContext: function (parentBeansContext) {

            // Initiate Child context
            izi.bakeBeans(org.demo.child.ChildConfig, parentBeansContext);
        }
    });

    org.demo.parent.ParentModel = new Class({}); //...
    org.demo.parent.ParentService = new Class({}); //...

<h2>4. Define Parent context and initiate it</h2>

    // Parent context configuration
    org.demo.child.ParentConfig = {
        parentView: new org.demo.parent.ParentView(),
        parentModel: new org.demo.parent.ParentModel(),
        parentService: new org.demo.parent.ParentService()
    };

    // Initiate Parent context
    izi.bakeBeans(org.demo.child.ParentConfig);

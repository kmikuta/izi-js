==What is izi-js?==
* A JavaScript port of **[[http://bitbucket.org/loomis/izi|izi for Flex]]**
* **izi** (as in '//easy//') is an MVVM-framework (Model View - View Model).
* **izi** promotes expressive and event driven programming.
* **izi** allows easy code navigation and refactoring.

It has been created to eliminate need for any - so called - MVC framework in JavaScript applications. Instead **izi** provides classes that help you implementing some of the best practices, concepts 
and conventions.

==What is inside?==

In the heart of **izi** there is a **dependency injection**. Without it the source is cluttered with a boilerplate code.
**izi** has a very simple but powerful bean container implementation that allows building container hierarchies. 

----

The spirit of **izi** is comes from **events architecture and composition**. The observer pattern is a base of all the behaviors you should have in your application.
Instead of extending components and adding behavior to them **izi** promotes non intrusive extension with use of events and composition of different behaviors to shape the final result. 

----

**izi** offers also very easy way to define **data bindings** between UI widgets and view model.

----

==JavaScript frameworks support==
**izi** relies on **event-dispatcher** paradigm, but in JavaScript there isn't one common implementation. Each framework (like jQuery UI, ExtJS, Dojo UI) has own interface to manage events. That's why **izi** is easily extendable for new implementations. For now it supports **only MooTools** framework. 

==Documentation==
[[http://iziest.bitbucket.org/izi-js/docs/1.5.2/index.html|izi-js 1.5.2 API]]

==Installation==
{{{
#!html
<!-- izi core-->
<script type="text/javascript" src="izi-js-1.5.2-debug.js"></script>
<!-- izi framework implementation-->
<script type="text/javascript" src="izi-js-mootools-1.5.2-debug.js"></script>
}}}

==[[http://iziest.bitbucket.org/izi-js/docs/1.5.2/index.html#!/guide/basic_ioc|IoC & DI]]==
{{{
#!javascript
izi.bakeBeans({
    model: new Demo.model.SearchModel(),
    search: new Demo.behavior.Search(),
    service: new Demo.service.SearchService(),
    view: izi.instantiate(Demo.view.SearchView).withArgs(izi.inject("model"),
                                                         izi.inject(Demo.behavior.Search))
});
}}}
[[http://iziest.bitbucket.org/izi-js/docs/1.5.2/index.html#!/guide/basic_ioc|more about IoC & DI...]]

==[[http://iziest.bitbucket.org/izi-js/docs/1.5.2/index.html#!/guide/basic_behavior|Behaviors]]==
{{{
#!javascript
izi.perform(search).when('click').on(searchButton);
}}}

[[http://iziest.bitbucket.org/izi-js/docs/1.5.2/index.html#!/guide/basic_behavior|more about Behaviors...]]

==[[http://iziest.bitbucket.org/izi-js/docs/1.5.2/index.html#!/guide/basic_binding|Data Binding]]==
{{{
#!javascript
izi.bind().valueOf(textField).to(model, "query");
}}}

[[http://iziest.bitbucket.org/izi-js/docs/1.5.2/index.html#!/guide/basic_binding|more about Data Binding...]]

==[[http://iziest.bitbucket.org/izi-js/docs/1.5.2/index.html#!/guide/basic_queue|Queue]]==
{{{
#!javascript
izi.queue().execute(task1,task2);
}}}

[[http://iziest.bitbucket.org/izi-js/docs/1.5.2/index.html#!/guide/basic_queue|more about Queue...]]

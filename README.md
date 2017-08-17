[![Build Status](https://travis-ci.org/gejgalis/izi-js.svg?branch=master)](https://travis-ci.org/gejgalis/izi-js)

What is izi-js?
===============

* A JavaScript port of [izi for Flex](http://bitbucket.org/loomis/izi)
* **izi** (as in '//easy//') is an MVVM-framework (Model View - View Model).
* **izi** promotes expressive and event driven programming.
* **izi** allows easy code navigation and refactoring.

It has been created to eliminate need for any - so called - MVC framework in JavaScript applications. Instead **izi** 
provides classes that help you implementing some of the best practices, concepts and conventions.

What is inside?
===============

In the heart of **izi** there is a **dependency injection**. Without it the source is cluttered with a boilerplate code.
**izi** has a very simple but powerful bean container implementation that allows building container hierarchies. 

The spirit of **izi** is comes from **events architecture and composition**. The observer pattern is a base of all the 
behaviors you should have in your application. Instead of extending components and adding behavior to them **izi** 
promotes non intrusive extension with use of events and composition of different behaviors to shape the final result. 

**izi** offers also very easy way to define **data bindings** between UI widgets and view model.

JavaScript frameworks support
=============================

**izi** relies on **event-dispatcher** paradigm, but in JavaScript there isn't one common implementation. Each framework
(like jQuery UI, ExtJS, Dojo UI, Mootools) has own interface to manage events. That's why **izi** is easily extendable 
for new implementations. 

Documentation
=============
[izi-js 1.7.2 API](http://iziest.bitbucket.io/izi-js/docs/1.7.2/index.html)

Installation
============

    <!-- izi core-->
    <script type="text/javascript" src="izi-js.js"></script>
    <!-- izi framework implementation-->
    <script type="text/javascript" src="izi-js-jquery.js"></script>

[IoC & DI](http://iziest.bitbucket.io/izi-js/docs/1.7.2/index.html#!/guide/basic_ioc)
=======================================================================================

    izi.bakeBeans({
        model: new Demo.model.SearchModel(),
        search: new Demo.behavior.Search(),
        service: new Demo.service.SearchService(),
        view: izi.instantiate(Demo.view.SearchView).withArgs(izi.inject("model"),
                                                             izi.inject(Demo.behavior.Search))

[more about IoC & DI...](http://iziest.bitbucket.io/izi-js/docs/1.7.2/index.html#!/guide/basic_ioc)

[Behaviors](http://iziest.bitbucket.io/izi-js/docs/1.7.2/index.html#!/guide/basic_behavior)
=============================================================================================

    izi.perform(search).when('click').on(searchButton);

[more about Behaviors...](http://iziest.bitbucket.io/izi-js/docs/1.7.2/index.html#!/guide/basic_behavior)

[Data Binding](http://iziest.bitbucket.io/izi-js/docs/1.7.2/index.html#!/guide/basic_binding)
==============================================================================================

    izi.bind().valueOf(textField).to(model, "query");

[more about Data Binding...](http://iziest.bitbucket.io/izi-js/docs/1.7.2/index.html#!/guide/basic_binding)

[Queue](http://iziest.bitbucket.io/izi-js/docs/1.7.2/index.html#!/guide/basic_queue)
=====================================================================================

    izi.queue().execute(task1,task2);

[more about Queue...](http://iziest.bitbucket.io/izi-js/docs/1.7.2/index.html#!/guide/basic_queue)

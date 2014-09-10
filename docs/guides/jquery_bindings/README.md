Using data binding with jQuery
==============================

Basically **izi** allows you to setup data bindings from widget to model and from model to widget.
In this page we want to present which elements in jQuery implementation are **bindable** and how to use
specific jQuery bindings `izi.bind().valueOf(model, "property").to$(...)...`

HTML form controls
------------------

Following form controls are ready to use as a binding source using jQuery:

### Text input
Value type: `String`

    // HTML
    <input class="firstName" type="text" value="John"/>

    // Widget > Model
    izi.bind().valueOf($(".firstName")).to(model, "firstName");

    console.log(model.getFirstName()); // "John"

    // Model > Widget
    izi.bind().valueOf(model, "firstName").to().valueOf($(".firstName));

### TextArea
Value type: `String`

    // HTML
    <textarea class="description">Lorem ipsum...</textarea>

    // Widget > Model
    izi.bind().valueOf($(".description")).to(model, "description");

    console.log(model.getDescription()); // "Lorem ipsum..."

    // Model > Widget
    izi.bind().valueOf(model, "description").to().valueOf($(".description));

### Checkbox
Value type: `Boolean`

    // HTML
    <input class="agreement" type="checkbox" value="agreement" checked="checked"/>

    // Widget > Model
    izi.bind().valueOf($(".agreement")).to(model, "agreement");

    console.log(model.getAgreement()); // true

    // Model > Widget
    izi.bind().valueOf(model, "agreement").to().valueOf($(".agreement));

### Multiple checkboxes
Value type: `Array` of `String`

Notice: selector should match all checkboxes.

    // HTML
    <input class="hobbies" type="checkbox" value="cars" checked/>
    <input class="hobbies" type="checkbox" value="movies" checked/>

    // Widget > Model
    izi.bind().valueOf($(".hobbies")).to(model, "hobbies");

    console.log(model.getHobbies()); // ["cars", "movies"]

    // Model > Widget
    izi.bind().valueOf(model, "hobbies").to().valueOf($(".hobbies));

### Select
Value type: `String`

    // HTML
    <select class="gender">
        <option value="male" selected>Male</option>
        <option value="female">Female</option>
    </select>

    // Widget > Model
    izi.bind().valueOf($(".gender")).to(model, "gender");

    console.log(model.getGender()); // "female"

    // Model > Widget
    izi.bind().valueOf(model, "gender").to().valueOf($(".gender));

### Multiple select
Value type: `Array` of `String`

    // HTML
    <select class="hobbies" multiple>
        <option value="cars" selected>Cars</option>
        <option value="movies" selected>Movies</option>
    </select>

    // Widget > Model
    izi.bind().valueOf($(".hobbies")).to(model, "hobbies");

    console.log(model.getHobbies()); // ["cars", "movies"]

    // Model > Widget
    izi.bind().valueOf(model, "hobbies").to().valueOf($(".hobbies));

### Radio group
Value type: `String`

    // HTML
    <input class="gender" type="radio" name="gender" value="male" checked/>
    <input class="gender" type="radio" name="gender" value="female"/>

    // Widget > Model
    izi.bind().valueOf($(".gender")).to(model, "gender");

    console.log(model.getGender()); // "female"

    // Model > Widget
    izi.bind().valueOf(model, "gender").to().valueOf($(".gender));

Bindings to jQuery methods through .to$()
-----------------------------------------

Regular izi binding sets only one argument on target property setter and it makes more complicated to bind some value
to jQuery function that needs at least 2 arguments. Normally you should use a function as a target of binding:

    izi.bind().valueOf(model, "color").to(function (color) {$("selector").css("color", color)});

To simplify this notation we prepared extra API which allows you to code above example in more readable format:

    izi.bind().valueOf(model, "color").to$("selector").css("color");
    // or
    izi.bind().valueOf(model, "color").to$($("selector")).css("color");
    // or
    izi.bind().valueOf(model, "color").to$(domElement).css("color");

izi supports following jQuery methods:

    izi.bind().valueOf(model, "property").to$($target).val();          // $target.val(value);
    izi.bind().valueOf(model, "property").to$($target).html();         // $target.html(value);
    izi.bind().valueOf(model, "property").to$($target).text();         // $target.text(value);
    
    izi.bind().valueOf(model, "property").to$($target).attr();         // $target.attr(value);
    izi.bind().valueOf(model, "property").to$($target).attr("id");     // $target.attr("id", value);
    
    izi.bind().valueOf(model, "property").to$($target).css();          // $target.css(value);
    izi.bind().valueOf(model, "property").to$($target).css("color");   // $target.css("color", value");

    izi.bind().valueOf(model, "property").to$($target).prop();         // $target.prop(value);
    izi.bind().valueOf(model, "property").to$($target).prop("checked");// $target.prop("checked", value);

    izi.bind().valueOf(model, "property").to$($target).data();         // $target.data(value);
    izi.bind().valueOf(model, "property").to$($target).data("id");     // $target.data("id", value);

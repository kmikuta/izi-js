/**
 * @ignore
 * @requires createWriter.js
 * @requires ../../utils/capitalize.js
 * @requires ../../utils/typeOf.js
 * @requires ../../utils/hasOwnProperty.js
 */
!function(module){

    module.binding.impl.writeBySet = function () {

        function matcher(object, property) {
            return (typeof object.set) === "function";
        }

        function writer(object, property, value) {
            object.set(property, value);
        }

        return module.binding.impl.createWriter(matcher, writer);
    }();

    module.binding.impl.writeByCapitalizedSetter = function () {

        var capitalize = module.utils.capitalize;

        function matcher(object, property) {
            return module.utils.typeOf(property) === "String" &&  (typeof object["set" + capitalize(property)]) === "function";
        }

        function writer(object, property, value) {
            object["set" + capitalize(property)](value);
        }

        return module.binding.impl.createWriter(matcher, writer);
    }();

    module.binding.impl.writeToProperty = function () {

        function matcher(object, property) {
            return true;
        }

        function writer(object, property, value) {
            object[property] = value;
        }

        return module.binding.impl.createWriter(matcher, writer);
    }();

    module.binding.impl.writeToOwnedProperty = function () {

        function matcher(object, property) {
            return module.utils.hasOwnProperty(object, property);
        }

        function writer(object, property, value) {
            object[property] = value;
        }

        return module.binding.impl.createWriter(matcher, writer);
    }();

    module.binding.impl.writeByFunction = function () {

        function matcher(object, property) {
            return module.utils.typeOf(object) === 'Function';
        }

        function writer(fn, scope, value) {
            try {
                fn.call(scope, value);
            } catch (e) {
            }
        }

        return module.binding.impl.createWriter(matcher, writer);
    }();

    module.binding.impl.writeToFunction = function () {

        function matcher(object, property) {
            return module.utils.typeOf(object[property]) === 'Function';
        }

        function writer(object, property, value) {
            object[property](value);
        }

        return module.binding.impl.createWriter(matcher, writer);
    }();

}(Izi);
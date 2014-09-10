/**
 * @requires createReader.js
 * @requires ../../utils/getterOf.js
 * @requires ../../utils/typeOf.js
 * @requires ../../utils/hasOwnProperty.js
 */
!function (module) {

    module.binding.impl.readByGet = function () {

        function matcher(object, property) {
            return (typeof object.get) === "function";
        }

        function reader(object, property) {
            return object.get(property);
        }

        return module.binding.impl.createReader(matcher, reader);
    }();

    module.binding.impl.readByCapitalizedGetter = function () {

        function reader(object, property) {
            return object[module.utils.getterOf(property)]();
        }

        function matcher(object, property) {
            return module.utils.typeOf(property) === "String" &&  (typeof object[module.utils.getterOf(property)]) === "function";
        }

        return module.binding.impl.createReader(matcher, reader);
    }();

    module.binding.impl.readByFunction = function () {

        function reader(object, property) {
            return object[property]();
        }

        function matcher(object, property) {
            return (typeof object[property] === 'function');
        }

        return module.binding.impl.createReader(matcher, reader);
    }();

    module.binding.impl.readFromProperty = function () {

        function reader(object, property) {
            return object[property];
        }

        function matcher(object, property) {
            return true;
        }

        return module.binding.impl.createReader(matcher, reader);
    }();

    module.binding.impl.readFromOwnedProperty = function () {

        function reader(object, property) {
            return object[property];
        }

        function matcher(object, property) {
            return module.utils.hasOwnProperty(object, property);
        }

        return module.binding.impl.createReader(matcher, reader);
    }();
    
}(Izi);
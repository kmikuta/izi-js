/**
 * @requires ../../../utils/typeOf.js
 */
!function (module) {

    module.binding.impl.nested.isNestedProperty = function Izi_binding_impl_nested_isNestedProperty(property) {
        return module.utils.typeOf(property) === "String" && property.indexOf(".") > -1
    }
}(Izi);

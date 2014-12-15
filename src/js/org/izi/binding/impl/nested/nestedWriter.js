/**
 * @ignore
 * @requires isNestedProperty.js
 * @requires TargetFinder.js
 * @requires TargetWriter.js
 * @requires ../../../utils/log.js
 */
!function (module) {

    module.binding.impl.nested.nestedWriter = function () {
        var impl = this.impl, targetFinder, targetWriter;

        function matcher(object, property) {
            var result = module.binding.impl.nested.isNestedProperty(property);
            if (result) {
                targetFinder = new module.binding.impl.nested.TargetFinder(property, impl.valueReaders);
                targetWriter = new module.binding.impl.nested.TargetWriter(property, impl.valueWriters);

                if (module.isDebug && property.split(".").length > 3) {
                    module.utils.log("[BINDING]" + this.getCallerLine() + " Binding target path \"" + property +"\" has more than 3 parts. Consider using .to(function(value) { target.x.y.x = value; }) instead.");
                }
            }
            return result;
        }

        function writer(object, property, value) {
            var target = targetFinder.findFor(object);

            if (target) {
                targetWriter.writeValue(target, value);
            }
        }

        return matcher.apply(this, arguments) ? writer : null;
    }

}(Izi);
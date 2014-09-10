/**
 * @requires ../../../utils/findClosure.js
 */
!function (module) {

    var TargetFinder = function Izi_binding_impl_nested_TargetFinder(path, readers) {
        this.path = path.split(".");
        this.path.pop();
        this.readers = readers;
    };

    TargetFinder.prototype.findFor = function (object) {
        var currentObject = object;
        for (var i = 0; i < this.path.length; i++) {
            var property = this.path[i];

            try {
                var reader = module.utils.findClosure(this.readers, [currentObject, property, "targetReader"]);
                currentObject = reader(currentObject, property);
                if (!currentObject) {
                    break;
                }
            } catch (e) {
                break;
            }
        }

        if (i === this.path.length) {
            return currentObject;
        } else {
            return undefined;
        }
    };

    module.binding.impl.nested.TargetFinder = TargetFinder;
}(Izi);
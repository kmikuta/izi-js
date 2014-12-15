/**
 * @ignore
 * @requires ../../../utils/findClosure
 */
!function (module){

    var TargetWriter = function Izi_binding_impl_nested_TargetWriter(path, writers) {
        this.property = path.split(".").pop();
        this.writers = writers;
    };

    TargetWriter.prototype.writeValue = function (object, value) {
        try {
            var writer = module.utils.findClosure(this.writers, [object, this.property, value]);
            writer(object, this.property, value);
        } catch (e) {
        }
    };

    module.binding.impl.nested.TargetWriter = TargetWriter;
}(Izi);
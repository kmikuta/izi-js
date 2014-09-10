/**
 * @requires Bind.js
 * @requires Config.js
 *
 * @requires impl/customPropertyObserver.js
 * @requires impl/genericValueReaders.js
 * @requires impl/genericValueWriters.js
 *
 * @requires impl/nested/nestedObserver.js
 * @requires impl/nested/nestedWriter.js
 * @requires impl/nested/nestedReader.js
 */
!function (module) {
    /**
     * @member Izi.binding
     * @method
     * @private
     * @param {Object} impl
     */
    module.binding.register = function (impl) {
        var nestedImpl = {};
        nestedImpl.changeObservers = [module.binding.impl.nested.nestedObserver,
                                      module.binding.impl.customPropertyObserver].concat(impl.changeObservers);
        nestedImpl.valueWriters = [module.binding.impl.nested.nestedWriter].concat(impl.valueWriters);
        nestedImpl.valueReaders = [module.binding.impl.nested.nestedReader(nestedImpl)].concat(impl.valueReaders);

        return function (options) {
            return new module.binding.Bind(new module.binding.Config(nestedImpl).withOptions(options || {}));
        };
    };
}(Izi);
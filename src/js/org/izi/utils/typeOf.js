!function (module) {
    /**
     * @member Izi.utils
     * @private
     * @param value
     * @return {String}
     */
    module.utils.typeOf = function (value) {
        if (value === undefined) {
            return 'undefined';
        } else if (value === null) {
            return 'null';
        }

        switch (typeof value)  {
            case 'string':
                return 'String';
            case 'number':
                return 'Number';
            case 'boolean':
                return 'Boolean';
            case 'function':
                return 'Function';
        }

        switch (Object.prototype.toString.call(value)) {
            case '[object Array]':
                return 'Array';
            case '[object Date]':
                return 'Date';
            case '[object RegExp]':
                return 'RegExp';
            case '[object Boolean]':
                return 'Boolean';
            case '[object Number]':
                return 'Number';
        }

        if (typeof value === 'object') {
            return 'Object';
        } else {
            throw new Error("Couldn't find type of given value");
        }
    };
}(Izi);
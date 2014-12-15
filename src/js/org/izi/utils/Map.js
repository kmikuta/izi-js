/**
 * @ignore
 * @requires forEach.js
 * @requires some.js
 * @requires removeItem.js
 */
!function (module) {

    var Map = function org_izi_utils_Map() {
        this.items = [];
    };

    Map.prototype.set = function (key, value) {
        this.getItemOrCreate(key).value = value;
    };

    Map.prototype.get = function (key) {
        var item = this.getItem(key);
        return item ? item.value : undefined;
    };

    Map.prototype.remove = function (key) {
        var item = this.getItem(key);
        if (item) {
            module.utils.removeItem(this.items, item);
        }
    };

    Map.prototype.getKeys = function () {
        var keys = [];
        module.utils.forEach(this.items, function (item) {
            keys.push(item.key);
        });
        return keys;
    };

    Map.prototype.getKeysOf = function (value) {
        var keys = [];
        module.utils.forEach(this.items, function (item) {
            if (item.value === value) {
                keys.push(value);
            }
        });
        return keys;
    };

    Map.prototype.getValues = function () {
        var values = [];
        module.utils.forEach(this.items, function (item) {
            values.push(item.value);
        });
        return values;
    };

    Map.prototype.count = function () {
        return this.items.length;
    };

    Map.prototype.countValues = function (value) {
        var count = 0;
        module.utils.forEach(this.items, function (item) {
            if (item.value === value) {
                count++;
            }
        });
        return count;
    };

    Map.prototype.getItemOrCreate = function (key) {
        return this.getItem(key) || this.createItem(key);
    };

    Map.prototype.createItem = function (key) {
        var item = {
            key: key
        };
        this.items.push(item);
        return item;
    };

    Map.prototype.getItem = function (key) {
        var foundItem = undefined;
        module.utils.some(this.items, function (item) {
            if (item.key === key) {
                foundItem = item;
                return true;
            }
            return false;
        });
        return foundItem;
    };

    module.utils.Map = Map;

}(Izi);
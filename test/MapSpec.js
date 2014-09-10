describe("Map", function () {

    var map, key1, key2, value1, value2;

    beforeEach(function () {
        map = new izi.module.utils.Map();
        key1 = {};
        key2 = {};
        value1 = {};
        value2 = {};
    });

    it("Should set and get values by key", function () {
        // when
        map.set(key1, value1);
        map.set(key2, value2);

        // then
        expect(map.get(key1)).toBe(value1);
        expect(map.get(key2)).toBe(value2);
    });

    it("Should get all keys", function () {
        // given
        map.set(key1, value1);
        map.set(key2, value2);

        // then
        expect(map.getKeys()).toEqual([key1, key2]);
    });

    it("Should get keys of value", function () {
        // given
        map.set(key1, value1);
        map.set(key2, value1);

        // then
        expect(map.getKeysOf(value1)).toEqual([key1, key2]);
        expect(map.getKeysOf(value2)).toEqual([]);
    });

    it("Should get all values", function () {
        // given
        map.set(key1, value1);
        map.set(key2, value2);

        // then
        expect(map.getValues()).toEqual([value1, value2]);
    });

    it("Should delete key", function () {
        // given
        map.set(key1, value1);
        map.set(key2, value2);

        // when
        map.remove(key1);
        map.remove(key2);

        // then
        expect(map.getKeys()).toEqual([]);
        expect(map.getValues()).toEqual([]);
    });

    it("Should count all items", function () {
        // given
        map.set(key1, value1);
        map.set(key2, value2);

        // when
        var count = map.count();

        // then
        expect(count).toEqual(2);
    });

    it("Should count values", function () {
        // given
        map.set(key1, value1);
        map.set(key2, value2);
        map.set({}, value2);

        // when
        var count = map.countValues(value2);

        // then
        expect(count).toEqual(2);
    });

});
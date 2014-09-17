        return izi;
    }
    if (typeof define === "function" && typeof define.amd === "object" && define.amd.vendor !== "dojotoolkit.org") {
        define([], amdFactory);
    } else if (typeof exports === 'object') {
        module.exports = amdFactory();
    } else {
        global.izi = amdFactory();
    }
})(this);
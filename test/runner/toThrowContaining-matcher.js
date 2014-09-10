beforeEach(function () {

    function toThrowContaining(actual, expected, isNot) {
        var result = {},
            exception;

        if (typeof actual !== 'function') {
            throw new Error('Actual is not a function');
        }
        try {
            actual();
        } catch (e) {
            exception = e;
        }
        if (exception) {
            result.pass = (expected === jasmine.undefined || (exception.message || exception).indexOf(expected.message || expected)) > -1;
        }

        var not = isNot ? "not " : "";

        if (exception && (expected === jasmine.undefined || ((exception.message || exception).indexOf(expected.message || expected)) === -1)) {
            result.message = ["Expected function " + not + "to throw", expected ? expected.message || expected : "an exception", ", but it threw", exception.message || exception].join(' ');
        } else {
            result.message = "Expected function to throw an exception.";
        }

        return result;
    }

    jasmine.addMatchers(
        {
            toThrowContaining: function (util, customEqualityTesters) {

                return {
                    compare: function (actual, expected) {
                        return toThrowContaining(actual, expected, false);
                    },

                    negativeCompare: function (actual, expected) {
                        return toThrowContaining(actual, expected, true);
                    }
                }
            }
        }
    );
});

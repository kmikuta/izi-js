/**
 * @requires ../../utils/hasOwnProperty.js
 * @requires ../../utils/getClassByName.js
 */
!function(module) {
    module.ioc.bean.createInstance = function (Clazz, args, props, beansContext) {

        function resolveArguments(args, beansContext) {
            var i, arg, result = [];
            for (i = 0; i < args.length; i = i + 1) {
                arg = args[i];
                if (arg && arg.isIziInjection) {
                    result.push(arg.resolveBean(beansContext));
                } else {
                    result.push(arg);
                }
            }
            return result;
        }

        function applyProps(instance, props) {
            if (props !== undefined) {
                for (var prop in props) {
                    if (module.utils.hasOwnProperty(props, prop)) {
                        instance[prop] = props[prop];
                    }
                }
            }
        }

        if (module.utils.typeOf(Clazz) === "String") {
            Clazz = module.utils.getClassByName(Clazz, beansContext.globals);
        }

        var a = resolveArguments(args, beansContext),
            argsCount = a.length,
            instance;

        if (argsCount === 0) {
            instance = new Clazz();
        } else if (argsCount === 1) {
            instance = new Clazz(a[0]);
        } else if (argsCount === 2) {
            instance = new Clazz(a[0], a[1]);
        } else if (argsCount === 3) {
            instance = new Clazz(a[0], a[1], a[2]);
        } else if (argsCount === 4) {
            instance = new Clazz(a[0], a[1], a[2], a[3]);
        } else if (argsCount === 5) {
            instance = new Clazz(a[0], a[1], a[2], a[3], a[4]);
        } else if (argsCount === 6) {
            instance = new Clazz(a[0], a[1], a[2], a[3], a[4], a[5]);
        } else if (argsCount === 7) {
            instance = new Clazz(a[0], a[1], a[2], a[3], a[4], a[5], a[6]);
        } else if (argsCount === 8) {
            instance = new Clazz(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7]);
        } else if (argsCount === 9) {
            instance = new Clazz(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8]);
        } else if (argsCount === 10) {
            instance = new Clazz(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9]);
        } else {
            throw new Error("Too many arguments given");
        }

        applyProps(instance, props);

        return instance;
    };
}(Izi);
/**
 * @requires ../utils/forEach.js
 * @requires ../utils/every.js
 * @requires ../utils/removeItem.js
 */
!function (module) {

    var forEach = module.utils.forEach,
        every = module.utils.every;

    var Observable = function Izi_model_Observable() {
        this.listeners = {};
    };

    Observable.prototype = {

        constructor: Observable,

        /**
         * @member Izi.model.Observable
         * @noSanity
         * @param {String} type
         * @return {Object[]} array of objects containing fields: 'fn' and 'scope'
         */
        findListeners: function (type) {

            if (this.listeners[type] === undefined) {
                this.listeners[type] = [];
            }

            return this.listeners[type];
        },

        /**
         * @member Izi.model.Observable
         * @noSanity
         * @param {String} type
         * @param {Array|Arguments} [args]
         */
        dispatchEvent: function (type, args) {
            var me = this;
            forEach(this.findListeners(type), function (listener) {
                listener.fn.apply(listener.scope || me, args || []);
            })
        },

        /**
         * @member Izi.model.Observable
         * @noSanity
         * @param {String} type
         * @param {Function} fn
         * @param {Object} [scope]
         */
        addListener: function (type, fn, scope) {
            this.findListeners(type).push({fn: fn, scope: scope});
        },

        /**
         * @member Izi.model.Observable
         * @noSanity
         * @param {String} type
         * @param {Function} fn
         */
        removeListener: function (type, fn) {
            var listeners = this.findListeners(type),
                listenerToRemove;


            every(listeners, function (listener) {
                if (listener.fn === fn) {
                    listenerToRemove = listener;
                    return false;
                }
                return true;
            });

            if (listenerToRemove) {
                module.utils.removeItem(listeners, listenerToRemove);
            }
        }
    };

    module.model.Observable = Observable;
}(Izi);
/**
 * @ignore
 * @requires Queue.js
 */
!function (module) {
    /**
     * @member Izi.binding
     * @method
     * @private
     * @param {Object} impl
     * @param {izi} iziApi
     */
    module.queue.register = function (impl, iziApi) {

        return function (config) {
            return new module.queue.Queue(impl, config, iziApi);
        };
    };
}(Izi);
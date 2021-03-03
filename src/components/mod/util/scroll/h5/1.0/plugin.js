import ScrollFn from './index.js';

/**
 * @name [创建ScorllFn单例]
 * @author [yosezheng]
 * @returns ScorllFn
 */
export default {
    install (Vue) {
        Vue.prototype.$scrollFn = (function () {
            let instance;
            return function () {
                if (!instance) {
                    instance = new ScrollFn();
                    window.addEventListener('scroll', instance.throttling.bind(instance));
                }

                return instance;
            };
        })();
    }
};

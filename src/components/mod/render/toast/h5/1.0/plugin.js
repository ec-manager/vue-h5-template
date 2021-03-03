import Toast from './index.vue';

/**
 * @description [创建Toast实例]
 * @author [beginning]
 * @param {Object} {Vue, message, options, onClose}
 * @returns {Toast}  
 */
function createToast ({Vue, message, options, onClose}) {
    let Constructor = Vue.extend(Toast);
    let toast = new Constructor({
        propsData: {
            message: message,
            delay: options.delay,
            autoClose: options.autoClose,
            position: options.position,
            isScale: options.isScale
        }
    });

    toast.$mount();
    toast.$on('close', onClose);
    document.body.appendChild(toast.$el);
    return toast;
}

export default {
    install (Vue) {
        // 当前的toast
        let currentToast = null;
        // 挂载到Vue的原型上
        Vue.prototype.$toast = function (message, options) {
            // 默认配置
            const defaultOptions = {
                delay: 2000,
                autoClose: true,
                position: 'middle',
                isScale: false
            };
            // 合并配置
            options = typeof options === 'undefined' ? defaultOptions : Object.assign({}, defaultOptions, options);

            if (currentToast) {
                // 当前存在toast，则关闭
                currentToast.close();
            }

            currentToast = createToast({
                Vue,
                message,
                options,
                onClose: () => {
                    currentToast = null;
                }
            });
        };
    }
};

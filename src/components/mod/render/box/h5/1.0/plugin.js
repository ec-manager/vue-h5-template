import Box from './index.vue';

/**
 * @description [创建Box实例]
 * @author [beginning]
 * @param {Object} {Vue, message, options, onClose}
 * @returns {Box}
 */
function createBox ({Vue, message, options, onClose}) {
    let Constructor = Vue.extend(Box);
    let box = new Constructor({
        propsData: {
            message: message,
            button: options.button
        }
    });

    box.$mount();
    box.$on('close', onClose);
    document.body.appendChild(box.$el);
    return box;
}

export default {
    install (Vue) {
        // 当前的box
        let currentBox = null;
        // 挂载到Vue的原型上
        Vue.prototype.$box = function (message, options) {
            // 默认配置
            const defaultOptions = {
                button: [
                    {
                        id: 'ok',
                        value: '确定',
                        handler: (box) => {
                            box.close();
                        }
                    }
                ]
            };
            // 合并配置
            options = typeof options === 'undefined' ? defaultOptions : Object.assign({}, defaultOptions, options);

            if (currentBox) {
                // 当前存在toast，则关闭
                currentBox.close();
            }

            currentBox = createBox({
                Vue,
                message,
                options,
                onClose: () => {
                    currentBox = null;
                }
            });
        };
    }
};

import Shade from './index.vue';

/**
 * @description [创建Shade实例]
 * @author [beginning]
 * @param {Object} {Vue, message, options}
 * @returns {Shade}
 */
function createShade ({Vue, message, options}) {
    let Constructor = Vue.extend(Shade);
    let shade = new Constructor({
        propsData: {
            message: message,
            text: options.text,
            link: options.link
        }
    });

    shade.$mount();
    document.body.appendChild(shade.$el);
    return shade;
}

export default {
    install (Vue) {
        Vue.prototype.$shade = function (message, options) {
            // 默认配置
            const defaultOptions = {text: '', link: ''};
            // 合并配置
            options = typeof options === 'undefined' ? defaultOptions : Object.assign({}, defaultOptions, options);

            createShade({
                Vue,
                message,
                options
            });
        };
    }
};

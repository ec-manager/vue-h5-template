import Url from '@/mod/util/url/h5/1.0/url.js';
import App from '@/mod/util/app/h5/1.0/app.js';

export default {
    install (Vue) {
        // 挂载到Vue的原型上
        /**
         *
         * @param {string} src 要跳转的链接
         * @param {boolean} isSkip 是否跳转到新的链接 默认为true
         * @param {number} isLoadOnCurPage 是否在当前页打开新页面，默认为0
         */
        Vue.prototype.$href = function (src, isSkip = true, isLoadOnCurPage) {
            if (src === '' || src === 'javascript:;' || src === 'javascript:void(0);') {
                return;
            }
            // 获取页面上的agent
            const urlAgent = Url.get('agent', location.href) || '';
            let newSrc = src;

            // 判断跳转链接是否携带agent,若存在则用新的agent
            if (urlAgent && !Url.has('agent', src)) {
                newSrc = Url.set('agent', urlAgent, src);
            }

            if (isSkip) {
                // 跳转到新的链接
                App.locationHref(newSrc.replace(/&amp;/gi, '&'), isLoadOnCurPage);
            } else {
                // 返回新的链接
                return newSrc;
            }
        };

 		/**
         * 如果在app中直接使用openUrl打开新页面
         * @param {string} src 要跳转的链接
         * @param {boolean} isSkip 是否跳转到新的链接 默认为true
         * @param {number} isLoadOnCurPage 是否在当前页打开新页面，默认为0
         */
        Vue.prototype.$open = function (src, isLoadOnCurPage) {
            // 获取页面上的agent
            const urlAgent = Url.get('agent', location.href) || '';
            let newSrc = src;

            // 判断跳转链接是否携带agent,若存在则用新的agent
            if (urlAgent && !Url.has('agent', src)) {
                newSrc = Url.set('agent', urlAgent, src);
            }
            // 跳转到新的链接
            App.locationNewPage(newSrc.replace(/&amp;/gi, '&'), isLoadOnCurPage);
        }
      
        Vue.directive('href', {
            bind: (el, binding) => {
                let data = binding.value;
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    Vue.prototype.$href(data);
                });
            }
        });

        Vue.directive('replace', {
            bind: (el, binding) => {
                let data = binding.value;
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    Vue.prototype.$href(data, true, 1);
                });
            }
        });
    }
};

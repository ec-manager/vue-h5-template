import '@/inc/sales/style/h5/1.0/style.less';
// 图片懒加载
import VueLazyload from 'vue-lazyload';
// Agent码处理
import Href from '@/mod/util/href/h5/1.0/href.js';
// 弹窗
import Toast from '@/mod/render/toast/h5/1.0/plugin.js';
// 模态框
import Box from '@/mod/render/box/h5/1.0/plugin.js';
// 过期弹窗遮罩
import Shade from '@/mod/render/shade/h5/1.0/plugin.js';
// 登录
import Login from '@/mod/util/login/h5/1.0/index.js';
// 曝光
import Expose from '@/mod/system/expose/h5/1.0/index.js';

// 兼容lazyComponent
Vue.use({
    install () {
        Vue.prototype.destroy = Vue.prototype.$destroy;
    }
});
// 懒加载
Vue.use(VueLazyload, {
    preLoad: 1.3,
    lazyComponent: true,
    observer: false,
    observerOptions: {
        rootMargin: '0px',
        threshold: 0.1
    },
    error: '//cres2.fenqile.cn/sale/img/core/h5/default.png',
    loading: '//cres2.fenqile.cn/sale/img/core/h5/default.png'
});
Vue.use(Href);
Vue.use(Toast);
Vue.use(Box);
Vue.use(Shade);
Vue.use(Login);
Vue.use(Expose);

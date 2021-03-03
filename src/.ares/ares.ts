// @ts-nocheck

// 仅仅使用稳定的 ES 功能
import "core-js/es/array";
import "core-js/es/object";
import "core-js/es/promise";
import "core-js/es/string";
import "core-js/es/regexp";
import "core-js/es/math";
import "core-js/es/json";
import "core-js/es/number";
import "core-js/web";
import 'regenerator-runtime/runtime';

import '@/mod/util/flexible.js';
import '@@/core/devScripts';
import Vue from 'vue';
// vue common
window.Vue = Vue;

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
// 曝光（全面接入boss后需要下掉）
import Expose from '@/mod/system/expose/h5/1.0/index.js';
// 加载请求类
import Http from '@/mod/util/http/h5/1.0/http.js';

Vue.prototype.$http = Http;

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




// 路由待定
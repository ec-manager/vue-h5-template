import Vue from 'vue';
import 'url-search-params-polyfill';
import './flexible.js';
// 加载请求类
import Http from '@/mod/util/http/h5/1.0/http.js';
Vue.prototype.$http = Http;
window.Vue = Vue;

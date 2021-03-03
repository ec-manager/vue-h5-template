export default {
    install (Vue) {
        // 挂载到Vue的原型上
        Vue.prototype.$login = function (href = document.location.href) {
            this.$href('//passport.fenqile.com/?url=' + encodeURIComponent(href));
            return false;
        };
    }
};

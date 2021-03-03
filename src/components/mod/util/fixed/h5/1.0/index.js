/**
 * @name [fixed指令]
 * @author [yosezheng]
 * ---
 * 不传值，则默认吸顶状态添加common-bar类名
 * 否则吸顶状态添加传入类名
 */

import { G_SCROLL_FIXED, G_SCROLL_IN_SECTION } from '@/mod/util/scroll/h5/1.0/type.js';

Vue.directive('fixed', {
    bind: function (elm, binding, vnode) {
        let className = binding.value || 'common-bar';
        let tagFlag = false;

        Vue.prototype.$nextTick().then(() => {
            // 存在scroll-tap子组件，则吸顶判断为区间类型
            tagFlag = vnode.children.some(item => {
                let tag = item.componentOptions ? item.componentOptions.tag : false;
                if (tag && tag === 'scroll-tap') return true;
            });

            let instance = Vue.prototype.$scrollFn();
            let fn = (signal) => {
                signal ? elm.classList.add(className) : elm.classList.remove(className);
            };

            // 是否存在scroll-tap子组件 ？ 区间滚动类型 ： 交替类型
            tagFlag ? inSectionTypeFn(instance, elm, fn) : instance.addSubscribes(elm, G_SCROLL_FIXED, fn);
        });
    }
});

/**
 * @mtehods inSectionTypeFn
 * @param {Object} instance
 * @param {HtmlElement} elm 绑定指令的元素，这里指的是吸顶导航条的包裹层
 * @param {Function} fn
 * @description 根据 elm ,找到swiper-wrapper的最后一个子元素, 通过其 href 获取到对应的 htmlElement，创建成 {elm, lastFloor}
 */
function inSectionTypeFn (instance, elm, fn) {
    let lastChild = elm.querySelector('.swiper-wrapper').lastElementChild;
    let lastFloor = document.querySelector(lastChild.getAttribute('href'));
    let hash = instance.createHash();

    instance.addSubscribes({ elm, lastFloor }, `${G_SCROLL_IN_SECTION}_${hash}`, fn);
}

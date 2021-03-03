/**
 * @author [begining]
 * @description [元素拖拽类]
 * @class Drag
 */
class Drag {
    constructor (el) {
        // 被拖拽的元素节点
        this.dragElement = el;
        // 点击点到盒子左边距的距离
        this.disX = 0;
        // 点击点到盒子上边距的距离
        this.disY = 0;
        // 拖拽元素当前的左边距
        this.offsetLeft = 0;
        // 拖拽元素当前的上边距
        this.offsetTop = 0;
        // 是否在移动
        this.isTouchMove = false;
        // 是否接触
        this.isTouch = false;
    }

    init () {
        // 监听拖拽元素的touchstart事件
        this.dragElement.addEventListener('touchstart', ev => {
            this.isTouchMove = true;
            // 开始拖拽
            this.onTouchStart(ev);
        }, {
            passive: false
        });
    }

    onTouchStart (ev) {
        this.isTouch = true;
        // 被拖拽元素的宽度
        this.dragElementWidth = this.dragElement.offsetWidth;
        // 被拖拽元素的高度
        this.dragElementHeight = this.dragElement.offsetHeight;
        // 点击点到盒子左边距的距离
        this.disX = ev.targetTouches[0].pageX - this.dragElement.offsetLeft;
        // 点击点到盒子上边距的距离
        this.disY = ev.targetTouches[0].pageY - this.dragElement.offsetTop;
        this.onTouchDown();
    }

    onTouchDown () {
        // 监听元素移动事件
        this.dragElement.addEventListener('touchmove', e => {
            if (this.isTouchMove) {
                this.onTouchMove(e);
            }
        }, {
            passive: false
        });

        // 监听元素移动结束事件
        this.dragElement.addEventListener('touchend', () => {
            this.isTouchMove = false;
            this.isTouch = false;
            this.onTouchEnd();
        }, false);
    }

    onTouchMove (ev) {
        if (this.isTouch) {
            // 阻止默认事件
            ev.preventDefault();
            // 阻止冒泡事件
            ev.stopPropagation();
            // 拖拽时盒子当前的左边距
            this.offsetLeft = ev.targetTouches[0].pageX - this.disX;
            // 拖拽时盒子当前的上边距
            this.offsetTop = ev.targetTouches[0].pageY - this.disY;
            // 盒子在当前窗口里的最大左边距
            let maxOffsetLeft = document.documentElement.clientWidth - this.dragElementWidth;
            // 盒子在当前窗口里的最大上边距
            let maxOffsetHeight = document.documentElement.clientHeight - this.dragElementHeight;
            // 边界检测
            if (this.offsetLeft <= 0) {
                this.offsetLeft = 0;
            }

            if (this.offsetLeft >= maxOffsetLeft) {
                this.offsetLeft = maxOffsetLeft;
            }

            if (this.offsetTop <= 0) {
                this.offsetTop = 0;
            }

            if (this.offsetTop >= maxOffsetHeight) {
                this.offsetTop = maxOffsetHeight;
            }

            this.dragElement.style.left = this.offsetLeft + 'px';
            this.dragElement.style.top = this.offsetTop + 'px';
            this.dragElement.style.right = 'auto';
            this.dragElement.style.bottom = 'auto';
            this.dragElement.style.transform = 'translate(0,0)';
        }
    }

    onTouchEnd () {
        let _this = this;
        this.dragElement.removeEventListener('touchmove', _this.onTouchMove, false);
        this.dragElement.removeEventListener('touchend', _this.onTouchEnd, false);
    }
}

export default Drag;

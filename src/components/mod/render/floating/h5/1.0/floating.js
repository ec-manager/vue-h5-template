import Drag from '@/mod/util/drag/h5/1.0/drag.js';

/**
 * @author [beginning]
 * @description [Floating组件]
 * @class Floating
 * @extends {Drag}
 */
class Floating extends Drag {
    constructor (el) {
        super(el);
        // 计时器
        this.timer = 0;
        this.createAnimationFrame();
    }

    easeOut (t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    }

    // 兼容requestAnimationFrame
    createAnimationFrame () {
        const vendors = ['webkit', 'moz', 'ms', 'o'];
        for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame) {
            let lastTime = 0;
            window.requestAnimationFrame = function (callback) {
                let currentTime = new Date().getTime();
                let timeToCall = Math.max(0, 16 - (currentTime - lastTime));
                let id = window.setTimeout(function () {
                    let time = currentTime + timeToCall;
                    callback(time);
                }, timeToCall);
                lastTime = currentTime + timeToCall;
                return id;
            };
        }

        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
        }
    }

    // 重写父类拖拽结束事件
    onTouchEnd () {
        let _this = this;
        this.dragElement.removeEventListener('touchmove', _this.onTouchMove, false);
        this.dragElement.removeEventListener('touchend', _this.onTouchEnd, false);

        if (this.offsetLeft > 0) {
            // 盒子在当前窗口里的最大左边距
            let maxOffsetLeft = document.documentElement.clientWidth - this.dragElementWidth;
            // 是否超过最大左边距的一般
            let hasHalfWidth = this.offsetLeft >= maxOffsetLeft / 2;
            // 剩余移动距离
            let otherLeftWidth = maxOffsetLeft - this.offsetLeft;
            // 返回边界需要移动的距离
            let moveWidth = !hasHalfWidth ? this.offsetLeft : otherLeftWidth;
            // times 计数器 speed 初始速度 sumTime 整个运动运行时间
            let [times, speed, sumTime] = [0, 0, 16];

            let run = function () {
                let [leftWidth, endLeft] = [0, 0];
                // 没超过屏的一半时，向左吸附
                if (!hasHalfWidth) {
                    // 左边距不断减小,直到为0
                    leftWidth = moveWidth - Math.ceil(_this.easeOut(times, speed, moveWidth, sumTime));
                    // 最终的left值为0
                    endLeft = 0;
                } else {
                    // 左边距不断增大，直到值为最大左边距
                    leftWidth = _this.offsetLeft + Math.ceil(_this.easeOut(times, speed, moveWidth, sumTime));
                    // 最终的left值为最大左边距
                    endLeft = maxOffsetLeft;
                }

                // 判断当前次数是否小于总次数
                if (times < sumTime) {
                    times++;
                    // 修改left的值
                    _this.dragElement.style.left = leftWidth + 'px';
                    // 继续执行run函数
                    _this.timer = requestAnimationFrame(run);
                } else {
                    // 修改left的值
                    _this.dragElement.style.left = endLeft + 'px';
                    // 取消动画执行
                    _this.timer && cancelAnimationFrame(_this.timer);
                    _this.offsetLeft = 0;
                }
            };

            run();
        }
    }
}

export default Floating;

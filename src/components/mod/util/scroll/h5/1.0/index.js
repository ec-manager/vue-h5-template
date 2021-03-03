import { G_SCROLL_FIXED, G_SCROLL_LIGHTHEIGHT, G_SCROLL_IN_SECTION } from './type.js';
/**
 * @name [ScorllFn单例]
 * @class ScrollFn
 * @author [yosezheng]
 */
class ScrollFn {
    constructor () {
        this.scrollTop = 0; // 当前滚动高度
        this.isTicking = false; // 节流锁
        this.subscribes = {}; // 所有订阅类型存储对象
        this._itemFlag = {}; // 根据类型，均分配一个对象来缓存上一次高亮节点
        this.htmlHeight = 0; // 浏览器滚动高度
        this.documentHeight = document.documentElement.clientHeight; // 可见区域高度
        this._oldHtmlHgt = 0; // 浏览器滚动高度标记，用于判断文档是否发生回流
    }

    /**
     * @methods addSubscribes
     * @param {HtmlElement/Object} elm
     * @param {String} type
     * @param {Function} fn
     * @memberof ScrollFn
     * @description 添加订阅者
     */
    addSubscribes (elm, type, fn) {
        let obj = this._createObj(elm, fn);

        if (this.subscribes[type]) {
            this.subscribes[type].push(obj);
        } else {
            this.subscribes[type] = [obj];
            this._itemFlag[type] = {};
        }

        /* 将订阅者根据其 offsetTop 值进行从小到大排序 */
        this.subscribes[type].sort((a, b) => a.offsetTop - b.offsetTop);
    }

    /**
     * @methods _createObj
     * @param {HtmlElement/Object} element
     * @param {Function} fn
     * @memberof ScrollFn
     * @description 完善订阅者对象内容，根据不同订阅类型返回完善后的对象
     */
    _createObj (element, fn) {
        let obj = {};

        /* 传入的是object类型
         * 必须带有 elm 和 lastFloor 属性
         * {HtmlElement} elm 用于获取offsetTop值的节点
         * {HtmlElement} lastFloor 用于获取height的节点
         * 两个节点形成一个滑动距离响应区间，进入与离开区间内都会更改signal信号
         */
        if (element.constructor === Object) {
            let elm = element.elm;
            let lastFloor = element.lastFloor;

            obj = {
                elm,
                signal: 0,
                offsetTop: ~~elm.offsetTop - 2,
                lastFloor,
                lastFloorOffsetTop: lastFloor.offsetTop >> 0,
                lastFloorHeight: lastFloor.clientHeight >> 0,
                fn
            };
        } else {
            /* 单纯elm对象
             * 只需要获取 offsetTop 值
             * 根据 offsetTop 值进行替换，超过其 offsetTop 值的signal置1，其余为0
             */

            obj = {
                elm: element,
                signal: 0,
                offsetTop: ~~element.offsetTop - 2,
                fn
            };
        }

        return obj;
    }

    /**
     * @methods getSubscribesType
     * @param {String} type
     * @memberof ScrollFn
     * @description 获取订阅者类型，由于部分类型采用哈希值分组，这个方法用于去除哈希得到正确的滚动类型
     */
    getSubscribesType (type) {
        let result = type.replace(/(_*\d*)$/g, '');
        return result;
    }

    /**
     * @methods unsubscribe
     * @param {Object} observer
     * @memberof ScrollFn
     * @description 取消订阅，传入完善后的订阅者对象，暂时没有使用场景，暂留该函数待后续需要的时候再完善
     */
    // unSubscribes (observer) {
    //
    // }

    /**
     * @methods _notice
     * @param {String} type
     * @memberof ScrollFn
     * @description 发送通知，当某一类型的订阅者数组中有信号置换会执行该方法
     */
    _notice (type) {
        this.subscribes[type].forEach(item => {
            item.fn(item.signal);
        });
    }

    /**
     * @methods hashCode
     * @param {String} str
     * @returns
     * @memberof ScrollFn
     * @description 产生一个hash值，只有数字，规则和java的hashcode规则相同
     */
    hashCode (str) {
        let h = 0;
        let len = str.length;
        let t = 2147483648;

        for (let i = 0; i < len; i++) {
            h = 31 * h + str.charCodeAt(i);
            if (h > 2147483647) h %= t; // java 整型溢出则取模
        }

        return h;
    }

    /**
     * @methods randomWord
     * @param {Number} min 任意长度最小位(固定位数)
     * @param {Number} max 任意长度最大位
     * @memberof ScrollFn
     * @returns 产生任意长度随机字母数字组合
     */
    randomWord (min, max) {
        let str = '';
        let range = min;
        let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        range = Math.round(Math.random() * (max - min)) + min;
        for (let i = 0; i < range; i++) {
            let pos = Math.round(Math.random() * (arr.length - 1));
            str += arr[pos];
        }

        return str;
    }

    /**
     * @methods createHash
     * @returns {Number} hashcode
     * @memberof ScrollFn
     * @description 生成唯一Number类型哈希值，当订阅者属于区间类型时需要带上 _hash 的形式，比如 G_SCROLL_LIGHTHEIGHT_2059310118
     */
    createHash () {
        let timestamp = (new Date()).valueOf();
        let myRandom = this.randomWord(6, 10);

        return this.hashCode(myRandom + timestamp.toString());
    }

    /**
     * @methods isSubscribeActive
     * @memberof ScrollFn
     * @description 滑动事件主逻辑，根据不同订阅者执行不同滚动类型函数，判断订阅者是否发生信号置换
     */
    isSubscribeActive () {
        let groups = Object.keys(this.subscribes);

        groups.forEach((type) => {
            this.subscribes[type].forEach((item, index, arr) => {
                let scrollType = this.getSubscribesType(type); // 滚动类型
                let nextItemOST = arr[index + 1] ? arr[index + 1].offsetTop : 0; // 下一个订阅者的 offsetTop
                let itemOST = item.offsetTop; // 当前订阅者的 offsetTop
                let scrollTop = this.scrollTop; // 当前滚动高度值
                let isLastItem = (index === arr.length - 1); // 是否为最后一个订阅者

                switch (scrollType) {
                case G_SCROLL_FIXED:
                    this._replaceType(item, itemOST, nextItemOST, isLastItem, scrollTop, type, index);
                    break;
                case G_SCROLL_LIGHTHEIGHT:
                    this._replaceType(item, itemOST, nextItemOST, isLastItem, scrollTop, type, index);
                    this._setLastItemActive(type, item, isLastItem);
                    break;
                case G_SCROLL_IN_SECTION:
                    this._inSectionType(item, itemOST, item.lastFloorOffsetTop + item.lastFloorHeight, scrollTop, type);
                    break;
                default:
                    break;
                }
            });
        });
    }

    /**
     * @methods _setLastItemActive
     * @memberof ScrollFn
     * @param {String} type 订阅者类型
     * @param {Object} item 订阅者对象
     * @param {Boolean} isLastItem 是否为最后一个订阅者
     * @description 页面置底，高亮类型订阅者最后一个置为高亮信号（无需关注是否处于视觉层内）
     */
    _setLastItemActive (type, item, isLastItem) {
        let isArriveBtm = (this.scrollTop >= (this.htmlHeight - this.documentHeight) >> 0);
        if (!isArriveBtm || !isLastItem) return;

        item.signal = 1;
        this._itemFlag[type] = item;
        this._notice(type);
    }

    /**
     * @methods _replaceType
     * @memberof ScrollFn
     * @param {Object} item 订阅者对象
     * @param {Number} itemOST 订阅者对象的offsetTop
     * @param {Object} nextItemOST 下一个订阅者对象，用于是否仍处于激活状态判断
     * @param {Boolean} isLastItem  是否为最后一个订阅者
     * @param {Number} scrollTop  当前窗口滚动的 scrollTop 值
     * @param {String} type  订阅者类型
     * @param {Number} index  该订阅者在其数组中的索引值
     * @description 订阅者属于替换类型执行该事件，根据订阅者的 offsetTop 进行交替信号
     * 这里隐藏一个问题，会把吸顶的楼层做个标记，不会重新获取该订阅者的offsetTop值，也就是进入页面时处于吸顶的订阅者 offsetTop 不会更新
     * 但暂时想不出能触发此bug的场景，所以暂时认为是安全的
     */
    _replaceType (item, itemOST, nextItemOST, isLastItem, scrollTop, type, index) {
        // 超过HtmlElement的offsetTop
        if (scrollTop >= itemOST && (scrollTop < nextItemOST || isLastItem) && this._itemFlag[type] !== item) {
            this._itemFlag[type].signal = 0;
            this._itemFlag[type] = item;
            item.signal = 1;
            this._notice(type);
        }

        // 低于HtmlElement的offsetTop
        if (scrollTop < itemOST && item.signal === 1) {
            item.signal = 0;
            this._notice(type);
            if (!index) this._itemFlag[type] = {};
        }
    }

    /**
     * @methods _inSectionType
     * @memberof ScrollFn
     * @param {Object} item 订阅者对象
     * @param {Number} itemOST 订阅者对象的offsetTop
     * @param {Number} lastFloorHeight 订阅者最后一个HtmlElement楼层对象的高度，也可以非最后一个，形成滚动区间即可
     * @param {Number} scrollTop  当前窗口滚动的 scrollTop 值
     * @param {String} type  订阅者类型
     * @param {Number} index  该订阅者在其数组中的索引值
     * @description 订阅者属于滚动区间类型执行该事件，进入与离开区间内都会更改signal信号
     */
    _inSectionType (item, itemOST, lastFloorHeight, scrollTop, type, index) {
        // 处于滚动区间
        if (scrollTop >= itemOST && scrollTop < lastFloorHeight && this._itemFlag[type] !== item) {
            this._itemFlag[type].signal = 0;
            this._itemFlag[type] = item;
            item.signal = 1;
            this._notice(type);
        }

        // 离开滚动区间
        if ((scrollTop < itemOST || scrollTop > lastFloorHeight) && item.signal === 1) {
            item.signal = 0;
            this._notice(type);
            if (!index) this._itemFlag[type] = {};
        }
    }

    /**
     * @methods _inSectionType
     * @memberof ScrollFn
     * @description 文档高度是否发生发生变化
     */
    _isHtmlReflow () {
        this.htmlHeight = document.documentElement.scrollHeight;

        if (this.htmlHeight !== this._oldHtmlHgt) {
            this._oldHtmlHgt = this.htmlHeight;
            this._resetSubscribes();
        }
    }

    /**
     * @methods _resetSubscribes
     * @memberof ScrollFn
     * @description 重置所有监听者数据
     */
    _resetSubscribes () {
        let types = Object.keys(this.subscribes);
        let subscribes = this.subscribes;

        types.forEach(type => {
            subscribes[type].forEach(item => {
                // 有吸顶信号不去重写offsetTop，否则此时为0，将导致永远无法取消吸顶
                if (!item.signal) item['offsetTop'] = (item.elm.offsetTop >> 0) - 2;

                // 如果类型区域监听，重新获取最后楼层高度
                if (this.getSubscribesType(type) === G_SCROLL_IN_SECTION) {
                    item.lastFloorOffsetTop = item.lastFloor.offsetTop >> 0;
                    item.lastFloorHeight = (item.lastFloor.clientHeight - 10) >> 0;
                }
            });
        });
    }

    /**
     * @methods windowScrollFun
     * @memberof ScrollFn
     * @description 滚动事件
     */
    windowScrollFun () {
        this.scrollTop = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
        this._isHtmlReflow();
        this.isSubscribeActive();
        this.isTicking = false;
    }

    /**
     * @methods throttling
     * @memberof ScrollFn
     * @description 节流，提供外部调用，来执行滚动函数
     */
    throttling () {
        if (!this.isTicking) {
            requestAnimationFrame(this.windowScrollFun.bind(this));
            this.isTicking = true;
        }
    }
}

export default ScrollFn;

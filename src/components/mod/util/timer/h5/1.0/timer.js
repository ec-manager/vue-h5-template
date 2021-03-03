let getTime = function (s) {
    if (s && typeof s === 'string') {
        return (new Date(s)).getTime();
    } else {
        return (new Date()).getTime();
    }
};

/**
 * @module base/Timer/1^0
 * @param {Object} options - 配置选项[必选]
 * @param {boolean} options.showDay - 是否展示天数 默认不展示[可选]
 * @param {date} options.end - 倒计时结束时间[必选]
 * @param {date} options.begin - 倒计时开始时间[必选]
 * @param {boolean} options.showHour - 是否展示小时数 默认展示[可选]
 * @param {boolean} options.showMin - 是否展示分钟数 默认展示[可选]
 * @param {number} options.speed - 倒计时的单位市场 默认1000毫秒[可选]
 * @param {function} options.calCallBack - 倒计时完成后回调[可选]
 * @param {function} options.callback - 每完成一次计算后的回调[可选]
 * @description [Timer 倒计时组件]
 * @version 1.0
 * @instance
 * @example
 * Timer({showDay: true});
 */
function Timer (options) {
    this.defaults = {
        showDay: false,
        end: '',
        begin: getTime(),
        showHour: true,
        showMin: true,
        speed: 1000,
        calCallBack: function () {},
        callback: function () {}
    };

    if (options instanceof Object) {
        Object.assign(this.defaults, options);
    }

    let defaults = this.defaults;
    this.now = getTime(defaults.begin);
    this.end = getTime(defaults.end);
    this._timer = null;
    this._msecTimer = null; // 秒后面的十分之一秒的计时器
}

/**
 * 原型方法扩展
 * @type {Object}
 */
Timer.prototype = {
    // 天数
    day: 0,
    // 小时
    hour: 0,
    // 分种
    min: 0,
    // 秒
    sec: 0,
    msec: 0,
    /**
     * @function format
     * @param {string} str - 需要格式化的数据[必选]
     * @description  格式化的数据，进行十位数补0操作
     * @version 1.0
     * @instance
     * @returns {string}
     * @example
     * Timer.format(1); //return '01'
     */
    format: function (str) {
        let ret = ((str.toString()).length > 1) ? str : ('0' + str);
        return ret;
    },
    /***
     * @function  calc
     * @description  倒计时核心计算方法，建议
     * @version 1.0
     * @instance
     * @example
     * Timer.calc();
     */
    calc: function () {
        let now = this.now;
        let end = this.end;
        let diff = 0;
        let defaults = this.defaults;
        let day = 0;
        let hour = 0;
        let min = 0;
        let sec = 0;
        // alert(now <= end)
        if (now <= end) {
            diff = (end - now) / 1000;

            // 计算天
            if (defaults.showDay) {
                day = Math.floor(diff / (24 * 60 * 60));
                diff -= day * 24 * 60 * 60;
            }

            // 计算时
            if (defaults.showHour) {
                hour = Math.floor(diff / (60 * 60));
                diff -= hour * 60 * 60;
            }

            // 计算分
            if (defaults.showMin) {
                min = Math.floor(diff / 60);
                diff = Math.floor(diff - min * 60);
            }

            sec = diff;

            this.day = this.format(day);
            this.hour = this.format(hour);
            this.min = this.format(min);
            this.sec = this.format(sec);
        } else {
            if (typeof defaults.calCallBack === 'function') {
                defaults.calCallBack.apply(this, []);
            }
        }
    },
    /**
     * @function  stop
     * @description  停止倒计时
     * @version 1.0
     * @instance
     * @example
     * Timer.stop();
     */
    stop: function () {
        clearTimeout(this._timer);
        clearTimeout(this._msecTimer);
        this._timer = null;
        this._msecTimer = null;
    },
    /***
     * @function  nextTick
     * @description   TODO
     * @version 1.0
     * @instance
     * @example
     * Timer.nextTick();
     */
    nextTick: function () {
        let that = this;
        let speed = that.defaults.speed;
        let callback = that.defaults.callback;
        let _run = function () {
            return setTimeout(function () {
                that.nextTick();
                if (typeof callback === 'function') {
                    callback(that);
                }
            }, speed);
        };

        this.calc();
        this.now = (new Date(this.now + 1000)).getTime();

        this._timer = _run();
    },
    /**
     * @function  start
     * @description  开始倒计时，先展示当前时间
     * @version 1.0
     * @instance
     * @example
     * Timer.start();
     */
    start: function () {
        let that = this;
        let callback = that.defaults.callback;

        this.calc();
        callback(that);
        this.nextTick();
    }
};

// 对外提供接口
export default Timer;

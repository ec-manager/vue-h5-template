let _zid = 1;
const Tool = {
    // 是否在微信环境
    isInWeiXin () {
        const ua = navigator.userAgent.toLowerCase();
        const reg = /MicroMessenger/i;
        return reg.test(ua);
    },

    // 是否在App环境
    isInApp () {
        const ua = navigator.userAgent.toLowerCase();
        const reg = /fenqile_(ios|android)_(\d{1,}\.\d{1,}\.\d{1,})/i;
        return reg.test(ua);
    },

    getTypeString (val) {
        return Object.prototype.toString.call(val);
    },

    isWindow (obj) {
        return obj !== null && obj === obj.window;
    },

    zid (element) {
        return element._zid || (element._zid = _zid++);
    },

    // 是否是类数组
    isArraylike (obj) {
        let length = obj.length;
        let type = typeof (obj);

        if (this.isWindow(obj)) {
            return false;
        }

        if (obj.nodeType === 1 && length) {
            return true;
        }

        return type === 'array' || (type !== 'function' && (length === 0 || (typeof length === 'number' && length > 0 && (length - 1) in obj)));
    },

    // 是否是对象
    isObject (val) {
        return this.getTypeString(val).indexOf('Object') > -1;
    },

    // 是否是数组
    isArray (val) {
        return Array.isArray(val) || val instanceof Array;
    },

    // 是否是函数
    isFunction (val) {
        return typeof (val) === 'function';
    },

    // 是否是一个纯粹的对象
    isPlainObject (obj) {
        return this.isObject(obj) && !this.isWindow(obj) && Object.getPrototypeOf(obj) === Object.prototype;
    },

    // 对象代理
    proxy (fn, context) {
        let args = (2 in arguments) && Array.prototype.slice.call(arguments, 2);
        if (Tool.isFunction(fn)) {
            let proxyFn = function () {
                return fn.apply(context, args ? args.concat(Array.prototype.slice.call(arguments)) : arguments);
            };
            proxyFn._zid = Tool.zid(fn);
            return proxyFn;
        } else if (typeof context === 'string') {
            if (args) {
                args.unshift(fn[context], fn);
                return Tool.proxy.apply(null, args);
            } else {
                return Tool.proxy(fn[context], fn);
            }
        } else {
            throw new TypeError('expected function');
        }
    },

    each (elements, callback) {
        let i, key;
        if (this.likeArray(elements)) {
            for (i = 0; i < elements.length; i++) {
                if (callback.call(elements[i], i, elements[i]) === false) {
                    return elements;
                }
            }
        } else {
            for (key in elements) {
                if (callback.call(elements[key], key, elements[key]) === false) {
                    return elements;
                }
            }
        }
        return elements;
    },

    // 规范化Url,在url为相对路径时规范化为绝对路径
    normalizeUrl (url) {
        if (!/^https?:\/\//im.test(url)) {
            // 以//开头，没有带协议的链接
            if (/^\/\//.test(url)) {
                url = location.protocol + url;
            } else {
                let origin = (location.origin || (location.protocol + '//' + location.host)); // location.origin 仅在新浏览器支持
                url = origin + (url[0] === '/' ? '' : '/') + url;
            }
        }

        return url;
    },

    // 比较版本号 '3.5' > '3.4.0'
    // 返回1时，表示a>b；返回0时，表示a==b；返回-1时，表示a<b
    compareVersion (verA, verB) {
        let arrA = verA.split('.');
        let arrB = verB.split('.');
        for (let i = 0, len = Math.max(arrA.length, arrB.length); i < len; i++) {
            let diff = parseInt((arrA[i] || 0), 10) - parseInt((arrB[i] || 0), 10);
            if (diff > 0) {
                return 1;
            } else if (diff < 0) {
                return -1;
            }
        }
        return 0;
    },

    // 是否为空对象
    isEmptyObject (obj) {
        return JSON.stringify(obj) === '{}';
    },

    // 格式化配置日期为 年/月/日 时:分:秒后的时间戳
    printfTime (date = 0) {
        let printfDate = date.replace(/-/g, '/');
        return new Date(printfDate).getTime();
    },

    // 是否为活动日期（激活状态），传入对象start_time 和 end_time 格式为'年-月-日 时:分:秒'，'-'会自动替换为'/'
    isActiveDate (target) {
        let timestamp = new Date().getTime();
        let { start_time: startTime, end_time: endTime } = target;

        startTime = this.printfTime(startTime);
        endTime = this.printfTime(endTime);

        if (timestamp < startTime) return 0; // 未开始
        if (timestamp >= startTime && timestamp < endTime) return 1; // 进行中
        if (timestamp >= endTime) return 2; // 已结束
    },

    // 根据服务器时间来控制是否为活动日期，传入对象start_time 和 end_time 格式为'年-月-日 时:分:秒'，'-'会自动替换为'/'
    isActiveDateByService (target, serviceTime) {
        let timestamp = serviceTime ? serviceTime : new Date().getTime();
        let { start_time: startTime, end_time: endTime } = target;

        startTime = this.printfTime(startTime);
        endTime = this.printfTime(endTime);

        if (timestamp < startTime) return 0; // 未开始
        if (timestamp >= startTime && timestamp < endTime) return 1; // 进行中
        if (timestamp >= endTime) return 2; // 已结束
    },

    // 是否为活动时间（激活状态），传入对象start_time 和 end_time 格式为'时:分:秒'
    isActiveTime (target) {
        let date = new Date();
        let timestamp = date.getTime();
        let [year, Month, day] = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
        let startTime = new Date(`${year}/${Month}/${day} ${target.start_time}`).getTime();
        let endTime = new Date(`${year}/${Month}/${day} ${target.end_time}`).getTime();

        if (timestamp < startTime) return 0; // 未开始
        if (timestamp > startTime && timestamp < endTime) return 1; // 进行中
        if (timestamp > endTime) return 2; // 已结束
    },

    // 数值转换为rem
    toRem (val = 0) {
        return val / 75 + 'rem';
    },

    // 图片增加域名
    // 说明：当前只对cimg1.fenqile.com的域名做了判断
    addDomain (str = '') {
        if (typeof str === 'string' && str.length > 0) {
            // let isNeedAddDomain = str.indexOf('//cimg1.fenqile.com') > -1;
            // 对 cimg1 cimgs1 img1 等常用域名进行判断
            let isNotNeedAddDomain = /\/\/c?imgs?\d\.fenqile\.com/.test(str);
            return isNotNeedAddDomain ? str : `https://cimg1.fenqile.com${str}`;
        }
        return '';
    },

    /**
     * @param {String} date new Date()，可不传，直接拿当前时间进行格式化
     * @param {String} str 日期格式化形式 "YYYY-MM-DD hh:mm:ss.S"，月/日/时/分/秒 均可以用1-2个占位符，年是1-4个占位符
     * @returns {String} str 格式化后的日期
     * @description 日期时间格式化，主要用于配合倒计时组件仅有结束时间的时候使用
     */
    dateFormat (str, date = new Date()) {
        var o = {
            'M+': date.getMonth() + 1, // 月
            'D+': date.getDate(), // 日
            'h+': date.getHours(), // 小时
            'm+': date.getMinutes(), // 分
            's+': date.getSeconds(), // 秒
            'S': date.getMilliseconds() // 毫秒，只能一个占位符
        };

        if (/(Y+)/.test(str)) str = str.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        for (var k in o) {
            if (new RegExp('(' + k + ')').test(str)) str = str.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
        return str;
    },
    // 将个位数的前+0
    formatNumber (n) {
        let num = n.toString();
        return num[1] ? num : '0' + num;
    },
    // 获取指定日期的字符串格式，tag为start，为当天的0点，tag为end，为当天的23点59分59秒
    getTimeString (val, tag) {
        if (val) {
            let date = new Date(val);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            let hour, minute, second;
            if (tag && tag === 'start') {
                hour = 0;
                minute = 0;
                second = 0;
            } else if (tag && tag === 'end') {
                hour = 23;
                minute = 59;
                second = 59;
            } else {
                hour = date.getHours();
                minute = date.getMinutes();
                second = date.getSeconds();
            }

            return [year, month, day].map(this.formatNumber).join('-') + ' ' + [hour, minute, second].map(this.formatNumber).join(':');
        }
    },
    /* 判断是否iPhoneX系列手机 */
    isIphoneX () {
        if (typeof window !== 'undefined' && window) {
            return /iphone/gi.test(window.navigator.userAgent) && window.screen.height >= 812;
        }
        return false;
    },
    /* 判断是否是Android */
    isAndroid: function () {
        var ua = window.navigator.userAgent.toLowerCase();
        return /android/i.test(ua);
    },
    /* 判断是否是Ios */
    isIos: function () {
        var ua = window.navigator.userAgent.toLowerCase();
        return /iphone|ipad/i.test(ua);
    },
    /* 判断当前的app设备是否是Android */
    isAppAndroid: function () {
        let ua = navigator.userAgent;
        let patt = /fenqile_android_(\d{1,}\.\d{1,}\.\d{1,})/i;
        let res = patt.exec(ua);
        return !!res;
    },
    /* 判断当前的app设备是否是Ios */
    isAppIos: function () {
        let ua = navigator.userAgent;
        let patt = /fenqile_ios_(\d{1,}\.\d{1,}\.\d{1,})/i;
        let res = patt.exec(ua);
        return !!res;
    }
};

export default Tool;

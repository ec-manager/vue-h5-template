/* eslint-disable no-eval */
import Tool from '../../../tool/1.0/tool.js';

const app = {
    diff: 100,
    delay: 800,
    isInstall: true,
    defaults: null,
    later: function (fn, t, context) {
        setTimeout(Tool.proxy(fn, context || window), t);
    },
    goInstall: function () {
        if (!this.isInstall) {
            if (Tool.isFunction(this.defaults.guide)) {
                this.defaults.guide();
            }
        }
    },
    detect: function (t1) {
        let t2 = Date.now();
        if (!t1 || (t2 - t1) < (this.delay + this.diff)) {
            this.isInstall = false;
        }
    },
    tryOpen: function () {
        let cmd = this.defaults.cmd;
        let ifr = document.createElement('iframe');
        ifr.setAttribute('style', 'display:none');
        ifr.setAttribute('src', cmd);
        document.body.appendChild(ifr);
    },
    guide: function (options) {
        let _defaults = {
            cmd: '', // 安装了app的操作
            guide: function () { // 未安装app的默认操作
                window.location.href = '/app.html';
            }
        };

        if (Tool.isPlainObject(options)) {
            this.defaults = Object.assign({}, _defaults, options);
        }

        this.later(this.goInstall, this.delay + this.diff * 3, this);
        let t1 = Date.now();
        this.later(function () {
            this.tryOpen();
        }, 0, this);
        this.later(function () {
            this.detect(t1);
        }, this.delay, this);
    },

    /**
      * @method 跳转处理
      * @param {string} url 跳转链接
      * @param {boolean} isLoadOnCurPage （1：直接在当前页面加载新的页面, 0:打开新的页面）
      * @returns {boolean} || {void}
      */
    locationHandle (url, isLoadOnCurPage) {
        if (!url) {
            return false;
        }
        if (isLoadOnCurPage) {
            location.replace(url);
        } else {
            location.href = url;
        }
    }
};

const jsBridge = {
    cbPrefix: 'FQL_JSBridge_Cb_',
    retPrefix: 'FQL_JSBridge_Rt_',
    /**
     * [调用APP接口]
     * @param {[String]} method 调用的接口名[必选]
     * @param  {[Object]} options  调用接口传入的参数[可选]
     * @returns {object}
     */
    invoke: function (method, options) {
        const ua = navigator.userAgent.toLowerCase();
        const reg = /fenqile_(ios|android)_(\d{1,}\.\d{1,}\.\d{1,})/i;
        let matchAry = ua.match(reg);
        if (Tool.compareVersion(matchAry[2], '5.5.0')) {
            options = {
                methodName: method,
                parameter: options
            };
            method = 'invokeJSAPI';
        }
        let ret;

        if (this.isIosV2Invok()) { // 分期乐ios app中调用JSAPI接口
            if (!Tool.isPlainObject(options)) { // 如果options是参数对象，则转成JSON字符串
                options = {};
            }

            try {
                options = JSON.stringify(options);
                top.webkit.messageHandlers.FQL_JSBridge.postMessage({
                    funcName: method,
                    parameter: options
                });
            } catch (e) {
                console.error(e.message);
            }
        } else { // 分期乐android app中调用JSAPI接口
            if (typeof top.FQL_JSBridge !== 'undefined' && typeof top.FQL_JSBridge[method] !== 'undefined') {
                // if (typeof options == 'undefined' || (Tool.isPlainObject(options) && options.async == 1)) { // options为空，或是同步改异步调用的方法
                if (typeof options === 'undefined') { // kayluo todo 逻辑待明确
                    ret = top.FQL_JSBridge[method]();
                } else {
                    if (Tool.isPlainObject(options)) { // 如果options是参数对象，则转成JSON字符串
                        options = JSON.stringify(options);
                    }
                    ret = top.FQL_JSBridge[method](options);
                }
            }
        }
        return ret;
    },
    /**
     * [获取注册到window的返回字段名]
     * @method getReturnName
     * @param {[Object]} methodName 方法名称[必选]
     * @returns {object}
     * @example
     */
    getReturnName: function (methodName) {
        return this.retPrefix + methodName;
    },
   
    /**
     * [获取注册到window的方法名]
     * @method getCallbackName
     * @param {string} methodName 
     * @param {string} bridgeName 
     * @returns {string}
     */
    getCallbackName: function (methodName, bridgeName) {
        bridgeName = bridgeName || '';
        bridgeName = bridgeName && (bridgeName + '_');
        return this.cbPrefix + bridgeName + methodName;
    },
    /**
     * [将回调函数注册到window]
     * @method setCallback
     * @param {[String]} methodName 函数名[必选]
     * @param  {[Function]} callback  回调函数
     * @param  {[Function]} beforeCallback  回调函数执行前执行的回调，用于封装app返回的数据
     */
    setCallback: function (methodName, callback, beforeCallback) {
        if (Tool.isFunction(beforeCallback)) {
            top[methodName] = beforeCallback;
        } else {
            top[methodName] = callback;
        }
    },
    isReady: function () {
        if (this.isAndroid()) { // 非ios，直接返回true
            return true;
        }
        let isReady = false;
        if (this.isIosV2Invok()) { // ios v2 webview
            try {
                isReady = typeof top.webkit.messageHandlers.FQL_JSBridge.postMessage === 'function';
            } catch (e) {
                isReady = false;
            }
        } else { // ios v1 webview
            isReady = typeof top.FQL_JSBridge !== 'undefined';
        }
        return isReady;
    },
    /**
     * [jsBridge初始化完成事件回调]
     * @method ready
     * @param  {[Function]} callback  回调函数
     * @returns {boolean} || {void}
     */
    ready: function (callback) {
        // 如果不是函数则直接返回
        if (!Tool.isFunction(callback)) {
            return false;
        }
        if (this.isReady()) { // 已经ready
            // 在app中才触发回调
            if (this.isApp()) {
                callback();
            }
        } else { // 还没有ready
            // 如果jsBridge还没注入，则监听FQL_JSBridgeReady事件
            top.document.addEventListener('FQL_JSBridgeReady', function () {
                setTimeout(function () {
                    callback();
                }, 0);
            }, false); // 绑定监听器
        }
    },
    checkNotInApp: function (options) {
        // 如果不在app中
        if (!this.isApp()) {
            // 是否要覆盖默认的引导操作
            if (Tool.isFunction(options['onNotInApp'])) {
                options['onNotInApp']();
            } else {
                // 不在app中时，如果有安装则跳转到对应页面，如果没有安装则跳转去H5的app下载页
                AppBridge.outsideAppGuid({
                    cmd: 'fenqile://app/webview?url=' + encodeURIComponent(location.href) // 2.6.0之前的方式，安装了app的操作
                });
            }
            return true;
        }
    },
    setAsyncCall: function (method, options) {
        // 获取传给接口的回调函数名
        let callbackName = this.getCallbackName('onReturn', method);
        // 如果有传回调函数，则将其扩展到window，给客户端调用
        if (typeof options !== 'undefined' && Tool.isFunction(options.onReturn)) {
            this.setCallback(callbackName, options.onReturn, function (res) {
                if (typeof res === 'object') { // ios会返回json对象
                    options.onReturn(res);
                } else { // android返回返回字符串，但是要针对低版本的app返回不标准的字符串做转换
                    res = res || '';
                    res = res.replace(/:"\{/g, ':{').replace(/\}",/g, '},');
                    let json = eval('(' + res + ')');
                    options.onReturn(json);
                }
            });
        }
        let params = {
            callBackName: callbackName,
            async: 1
        };

        // 如果还需要传data值
        if (options.data !== 'undefined') {
            params.data = options.data;
        }
        if (options.controller !== 'undefined') {
            params.controller = options.controller;
        }
        if (options.action !== 'undefined') {
            params.action = options.action;
        }

        let ret = this.invoke(method, params);
        if (ret) { // 如果是andorid或ios同步返回时，则直接调用回调函数
            top[callbackName](ret);
        }
        return ret;
    },
    /**
     * [获取当前设备的平台、操作系统、手机型号、机器码]
     * @method getDeviceInfo
     * @param {object} options
     * @returns {object}
     * @example
     AppBridge.invokeJsBridge('getDeviceInfo', {
                onReturn: function(data){}
            });
     */
    getDeviceInfo: function (options) {
        return this.setAsyncCall('getDeviceInfo', options);
    },
    /**
     * [复制文本到剪切板]
     * @method setClipBoard
     * @param {object} options
     * @returns {object}
     * @example
     AppBridge.invokeJsBridge('setClipBoard', {
                text: 'xxxxx',
                onReturn: function(){}  // ios下成功时才触发，没有入参，失败时不会触发，一般都不会失败
            });
     */
    setClipBoard: function (options) {
        // 获取传给接口的回调函数名
        let callbackName = this.getCallbackName('onReturn');
        // 如果有传回调函数，则将其扩展到window，给客户端调用
        if (Tool.isFunction(options.onReturn)) {
            this.setCallback(callbackName, options.onReturn, function (res) {
                if (typeof res === 'object') { // ios会返回json对象
                    options.onReturn(res);
                } else { // android返回返回字符串，但是要针对低版本的app返回不标准的字符串做转换
                    res = res || '{}';
                    let json = eval('(' + res + ')');
                    options.onReturn(json);
                }
            });
        } else {
            top.callbackName = function () {};
        }
        // 默认为text类型
        const params = {
            text: options.text,
            callBackName: callbackName
        };
        return this.invoke('setClipBoard', params);
    },
    /**
     * [打开摄像头并开始扫码，扫码结果若是fenqile的url，直接跳转至该url]
     * @method captureQR
     * @param {[Object]} options 选项[可选]
     * @param  {[Function]} options.onNotInApp  非app中打开时执行的操作[可选]
     * @returns {boolean}
     * @example
     var ret = AppBridge.invokeJsBridge('captureQR');
     */
    captureQR: function (options) {
        // 如果不在app中，则设置默认行为
        if (this.checkNotInApp(options)) {
            // 不在app中
            return false;
        }
        let ret = this.invoke('captureQR');
        return ret;
    },
    /**
     * [获取本机号码并显示]
     * @method getPhoneNum
     * @param {object} options
     * @returns {object}
     * @example
     AppBridge.invokeJsBridge('getPhoneNum', {
                onReturn: function(data){}
            });
     */
    getPhoneNum: function (options) {
        return this.setAsyncCall('getPhoneNum', options);
    },
    /**
     * [获得联网状态]
     * @method getNetInfo
     * @param {object} options
     * @returns {object}
     * @example
     AppBridge.invokeJsBridge('getNetInfo', {
                onReturn: function(data){}
            });
     */
    getNetInfo: function (options) {
        return this.setAsyncCall('getNetInfo', options);
    },
    /**
     * [判断当前用户的地理坐标（经度，纬度，地址的详细内容）]
     * @method getLBS
     * @param {[Object]} options 选项[必选]
     *    @param  {[Function]} options.onLBSReceive  回调函数
     * @returns {object}
     * @example
     AppBridge.invokeJsBridge('getLBS', {
                onLBSReceive: function(str){
                    log(str);
                }
            });
     */
    getLBS: function (options) {
        // 获取传给接口的回调函数名
        let callbackName = this.getCallbackName('onLBSReceive');
        // 如果有传回调函数，则将其扩展到window，给客户端调用
        if (Tool.isFunction(options.onLBSReceive)) {
            this.setCallback(callbackName, options.onLBSReceive, function (res) {
                if (typeof res === 'object') { // ios会返回json对象
                    options.onLBSReceive(res);
                } else { // android返回返回字符串，但是要针对低版本的app返回不标准的字符串做转换
                    res = res || '';
                    res = res.replace(/:"\{/g, ':{').replace(/\}",/g, '},');
                    let json = eval('(' + res + ')');
                    // 兼容处理
                    if (json.data && json.data.mDLongitude) {
                        json.data.longitude = json.data.mDLongitude;
                        json.data.latitude = json.data.mDLatitude;
                    }
                    options.onLBSReceive(json);
                }
            });
        }
        const params = {
            callBackName: callbackName
        };
        let ret = this.invoke('getLBS', params);
        return ret;
    },

    /**
     * [ 打开相机、相册选择并返回图片]
     * @method choosePhoto
     * @param {Object} options 选项[必选]
     *    @param  {String}   options.allowEditing  是否需要裁剪框，1或0，默认0
     *    @param  {Function} options.onChoosePhotoReturn  回调函数
     * @return {Object}
     * {
     *      retmsg: 'success',
     *      retcode: 0,
     *      data: {
     *          img: src,  // img为经base64转换返回的图片源(不带前缀data:image/png;base64,)
     *          img_url:src, // base64编码的图片
     *          souce:1    // souce为来源(1 为相机，2为相册)
     *      }
     * }
     * @example
     AppBridge.invokeJsBridge('choosePhoto', {
                  onChooseReturn: function(str){
                       log(str);
                  }
             });
     */
    choosePhoto: function (options) {
        // 获取传给接口的回调函数名
        let callbackName = this.getCallbackName('onChoosePhotoReturn', 'choosePhoto');
        // 如果有传回调函数，则将其扩展到window，给客户端调用
        if (Tool.isFunction(options.onChoosePhotoReturn)) {
            this.setCallback(callbackName, options.onChoosePhotoReturn, function (res) {
                if (typeof res === 'object') { // ios会返回json对象
                    res['img_url'] = 'data:image/png;base64,' + res.data.img; // 将图片源添加进对象中
                    options.onChoosePhotoReturn(res);
                } else { // android返回返回字符串
                    res = res || '';
                    let obj = JSON.parse(res);
                    obj['img_url'] = 'data:image/png;base64,' + obj.data.img; // 将图片源添加进对象中
                    options.onChoosePhotoReturn(obj);
                }
            });
        }
        const params = {
            allowEditing: typeof options.allowEditing === 'undefined' ? '0' : options.allowEditing,
            callBackName: callbackName
        };

        const ret = this.invoke('choosePhoto', params);
        return ret;
    },

    /**
     * [打开联系人界面并选择单个联系人]
     * @method chooseContacts
     * @param {[Object]} options 选项[必选]
     *    @param  {[Function]} options.onChooseContactsReturn  回调函数
     * @return {[Object]}
     * {
     *      retmsg: 'success',
     *      retcode: 0,
     *      data: {
     *          contactName: name,  //contactName为联系人姓名
     *          contactNum: num     //contactNum为联系人的电话号码
     *      }
     * }
     * @example
     AppBridge.invokeJsBridge('chooseContacts', {
                  onChooseReturn: function(str){
                       log(str);
                  }
             });
     */
    chooseContacts: function (options) {
        // 获取传给接口的回调函数名
        let callbackName = this.getCallbackName('onChooseContactsReturn', 'chooseContacts');
        // 如果有传回调函数，则将其扩展到window，给客户端调用
        if (Tool.isFunction(options.onChooseContactsReturn)) {
            this.setCallback(callbackName, options.onChooseContactsReturn, function (res) {
                if (typeof res === 'object') { // ios会返回json对象
                    res.data.contactNum = res.data.contactNum.replace(/-/g, ''); // 去除ios联系人中的'-'
                    options.onChooseContactsReturn(res);
                } else { // android返回返回字符串
                    res = res || '';
                    let obj = JSON.parse(res);
                    options.onChooseContactsReturn(obj);
                }
            });
        }
        let params = {
            callBackName: callbackName
        };

        let ret = this.invoke('chooseContacts', params);
        return ret;
    },

    /**
     * [获取用户在sd卡中的qq号码]  // ios不支持此方法
     * @method getUserQQNum
     * @param {[Object]} options 选项[必选]
     *    @param  {[Function]} options.onReturn  回调函数
     * @return {[Object]}
     * {
     *      retmsg: 'success',
     *      retcode: 0,
     *      data: {[qqNum:'12345678'],[qqNum:'22334455']...}   // qq号码数组
     * }
     * @example
     AppBridge.invokeJsBridge('getUserQQNum', {
                  onReturn: function(str){
                       log(str);
                  }
             });
     */
    getUserQQNum: function (options) {
        // 获取传给接口的回调函数名
        let callbackName = this.getCallbackName('onReturn', 'getUserQQNum');
        // 如果有传回调函数，则将其扩展到window，给客户端调用
        if (Tool.isFunction(options.onReturn)) {
            this.setCallback(callbackName, options.onReturn, function (res) {
                if (typeof res === 'object') { // ios会返回json对象
                    options.onReturn(res);
                } else { // android返回返回字符串
                    res = res || '';
                    let obj = JSON.parse(res);
                    options.onReturn(obj);
                }
            });
        }
        let params = {
            callBackName: callbackName
        };

        let ret = this.invoke('getUserQQNum', params);
        return ret;
    },

    /**
     * [当h5登录后，调用此方法，App读取cooike，获取当前用户的登录态]
     * @method onLogIn
     * @param {[Object]} options 选项[必选]
     *    @param  {[String]} options.url  有登录态的url
     * @returns {boolean}
     * @example
     AppBridge.invokeJsBridge('onLogIn', {
                url: location.href
            });
     */
    onLogIn: function (options) {
        let callbackName = this.getCallbackName('onReturn', 'onLogIn');

        if (Tool.isFunction(options.onReturn)) {
            this.setCallback(callbackName, options.onReturn, function (res) {
                if (typeof res === 'object') {
                    options.onReturn(res);
                } else {
                    res = res || '';
                    let obj = JSON.parse(res);
                    options.onReturn(obj);
                }
            });
        }
        let params = {
            url: options.url,
            uid: options.uid,
            session_id: options.session_id,
            token_id: options.token_id,
            callBackName: callbackName
        };

        let ret = this.invoke('onLogIn', params);
        return ret;
    },
    /**
     * [当h5退出登录后，调用此方法，App清除保存的用户登录态]
     * @method onLogOut
     * @param {object} options
     * @returns {boolean}
     * @example
     var ret = AppBridge.invokeJsBridge('onLogOut');
     */
    onLogOut: function (options) {
        let ret = this.invoke('onLogOut', options);
        return ret;
    },
    /**
     * [隐藏当前app界面的标题栏]
     * @method hideTitle
     * @param {object} options
     * @returns {boolean}
     * @example
     var ret = AppBridge.invokeJsBridge('hideTitle');
     */
    hideTitle: function (options) {
        let ret = this.invoke('hideTitle', options);
        return ret;
    },
    /**
     * [隐藏App load界面]
     * @method hideLoading
     * @param {object} options
     * @returns {boolean}
     * @example
     var ret = AppBridge.invokeJsBridge('hideLoading');
     */
    hideLoading: function (options) {
        let ret = this.invoke('hideLoading', options);
        return ret;
    },
    /**
     * [显示当前app界面的标题栏]
     * @method showTitle
     * @param {object} options
     * @returns {boolean}
     * @example
     var ret = AppBridge.invokeJsBridge('showTitle');
     */
    showTitle: function (options) {
        let ret = this.invoke('showTitle', options);
        return ret;
    },
    /**
     * [判断用户是否已经在App端登录]
     * @method isLogin
     * @param {object} options
     * @returns {boolean}
     * @example
     var ret = AppBridge.invokeJsBridge('isLogin');
     */
    isLogin: function (options) {
        let ret = this.invoke('isLogin', options);
        return ret;
    },
    /**
     * [获取用户的SessionId]
     * @method getSessionId
     * @param {object} options
     * @returns {boolean}
     * @example
     AppBridge.invokeJsBridge('getSessionId', {
                onReturn: function(data){}
            });
     */
    getSessionId: function (options) {
        return this.setAsyncCall('getSessionId', options);
    },
    /**
     * [获取用户的TokenId]
     * @method getTokenId
     * @param {object} options
     * @returns {boolean}
     * @example
     AppBridge.invokeJsBridge('getTokenId', {
                onReturn: function(data){}
            });
     */
    getTokenId: function (options) {
        return this.setAsyncCall('getTokenId', options);
    },
    /**
     * [调用微信支付]
     * @method doWxPay
     * @param {[Object]} options 选项[必选]
     *    @param  {[String]} options.appid  微信支付参数
     *    @param  {[String]} options.package  微信支付参数
     *    @param  {[String]} options.prepayid  微信支付参数
     *    @param  {[String]} options.partnerid  微信支付参数
     *    @param  {[String]} options.noncestr  微信支付参数
     *    @param  {[String]} options.sign  微信支付参数
     *    @param  {[String]} options.timestamp  微信支付参数
     *    @param  {[Function]} options.onWxPayBack  回调函数
     *    @param  {[Function]} options.onNotInApp  非app中打开时执行的操作[可选]
     * @returns {boolean} || {object}
     * @example
     AppBridge.invokeJsBridge('doWxPay', {
                appid: 'appid',
                package: 'package',
                prepayid: 'prepayid',
                partnerid: 'partnerid',
                noncestr: 'noncestr',
                sign: 'sign',
                timestamp: 'timestamp',
                onWxPayBack: function(){}
            });
     */
    doWxPay: function (options) {
        // 如果不在app中，则设置默认行为
        if (this.checkNotInApp(options)) {
            // 不在app中
            return false;
        }
        // 获取传给接口的回调函数名
        let callbackName = this.getCallbackName('onWxPayBack');
        // 如果有传回调函数，则将其扩展到window，给客户端调用
        if (Tool.isFunction(options.onWxPayBack)) {
            this.setCallback(callbackName, options.onWxPayBack, function (res) {
                if (typeof res === 'object') {
                    options.onWxPayBack(res);
                } else {
                    res = res || '';
                    let obj = JSON.parse(res);
                    options.onWxPayBack(obj);
                }
            });
        }
        let params = {
            appid: options.appid,
            package: options.package,
            prepayid: options.prepayid,
            partnerid: options.partnerid,
            noncestr: options.noncestr,
            sign: options.sign,
            timestamp: options.timestamp,
            callBackName: callbackName
        };
        return this.invoke('doWxPay', params);
    },
    /**
     * [加载Url]
     * 根据传入的Url调用此webview加载对应url界面
     * @method loadUrl
     * @param {[Object]} options 选项[必选]
     *    @param  {[String]} options.loadUrl  加载的url
     * @returns {boolean}
     * @example
     AppBridge.invokeJsBridge('loadUrl', {
                url: 'http://m.fenqile.com/app/pocket/intro.html'
            });
     */
    loadUrl: function (options) {
        // 如果是相对路径，则补齐域名
        if (options['url']) {
            options['url'] = Tool.normalizeUrl(options['url']);
        }
        return this.invoke('loadUrl', options);
    },
    /**
     * [在新的webview打开Url]
     * 判断url中是否含有“fenqile.com”，如果有，进行重定向并加载此页面；如果没有，不能重定向。
     * @method openUrl
     * @param {[Object]} options 选项[必选]
     *    @param  {[String]} options.url  打开的url
     * @returns {boolean}
     * @example
     AppBridge.invokeJsBridge('openUrl', {
                url: 'http://m.fenqile.com/app/pocket/intro.html'
            });
     */
    openUrl: function (options) {
        // 如果是相对路径，则补齐域名
        if (options['url']) {
            options['url'] = Tool.normalizeUrl(options['url']);
        }

        return this.invoke('openUrl', options);
    },
    /**
     * [打开app的设置界面]
     * @method openSettingActivity
     * @param {object} options
     * @returns {boolean}
     * @example
     var ret = AppBridge.invokeJsBridge('openSettingActivity');
     */
    openSettingActivity: function (options) {
        return this.invoke('openSettingActivity', options);
    },
    /**
     * [直接关闭当前webview窗口]
     * @method onCloseClicked
     * @param {object} options
     * @returns {boolean}
     * @example
     var ret = AppBridge.invokeJsBridge('onCloseClicked');
     */
    onCloseClicked: function (options) {
        return this.invoke('onCloseClicked', options);
    },
    /**
     * [设置webView显示的标题]
     * @method setTitle
     * @param {[Object]} options 选项[必选]
     *    @param  {[Int]} options.type  标题类型 1文本 2图片url
     *    @param  {[String]} options.title  type为1是传标题文本，type为2时传图片url
     * @returns {boolean}
     * @example
     var ret = AppBridge.invokeJsBridge('setTitle');
     */
    setTitle: function (options) {
        // 默认为text类型
        options = Object.assign({
            type: 1,
            title: ''
        }, options);

        if (typeof options.title !== 'string') { // 兼容App未处理的类型错误
            options.title = options.title ? (options.title + '') : '';
        }
        return this.invoke('setTitle', options);
    },
    /**
     * [设置标题左侧返回键的可见]
     * @method setLeftButtonVisible
     * @param {[Object]} options 选项[必选]
     *    @param  {[String]} options.visible  visible为1是显示，visible为0是隐藏
     * @returns {object}
     * @example
     AppBridge.invokeJsBridge('setLeftButtonVisible', {
            visible: 0
        });
     */
    setLeftButtonVisible: function (options) {
        // 默认为text类型
        options = Object.assign({
            visible: '1'
        }, options);
        return this.invoke('setLeftButtonVisible', options);
    },
    /**
     * [标题右侧按钮属性设置]
     * @method setTitleRightIcon
     * @param {Object} options 选项[必选]
     *    @param  {String} options.visible  是否可见
     *    @param  {String} options.type  按钮类型， text或url，content是icon图片的链接
     *    @param  {String} options.content  显示内容
     *    @param  {String} options.needRedPoint  是否显示红点 1显示，0不显示 @since 3.7.2
     *    @param  {Function} options.onClick  点击按钮回调
     *    @param  {String} options.textColor  文案颜色
     * @returns {object}
     * @example
     AppBridge.invokeJsBridge('setTitleRightIcon', {
                content: 'app/product/view/S201310010242.html',
                onClick: function(){}
            });
     */
    setTitleRightIcon: function (options) {
        let isVisible = (options.visible === undefined || options.visible === null) ? 1 : options.visible;
        // 获取传给接口的回调函数名
        let callbackName = this.getCallbackName('onClick', 'setTitleRightIcon');

        if (isVisible) {
            // 如果有传回调函数，则将其扩展到window，给客户端调用
            if (Tool.isFunction(options.onClick)) {
                this.setCallback(callbackName, options.onClick);
            }
        }

        let params = {
            visible: isVisible,
            type: (options.type || 'text'),
            content: (options.content || ''),
            needRedPoint: (options.needRedPoint || '0'),
            callBackName: callbackName,
            textColor: options.textColor || '#3b9bff'
        };
        return this.invoke('setTitleRightIcon', params);
    },
    /**
     * [标题右侧多个按钮属性设置]
     * @method setTitleRightIcon
     * @param {[Object]} options 选项[必选]
     * 注意： icons最多两个， 组件会校验
     *    @param  {[String]} options.visible 是否可见
     *    @param  {[Array]}  options.icons:  为需要添加的icon的数组array，最多两个icon，app会从右往左设置
     *    @param  {[String]} options.content 内容（显示的为图片，则需传一个imgUrl链接）
     *    @param  {[Function]} options.onClick 点击按钮回调
     * @returns {boolean} || {object}
     * @since  3.6.4

     * @example
        App_Bridge.jsBridgeReady(function() {
            App_Bridge.invokeJsBridge('setMultiRightIcon', {
                visible: 1,
                icons: [
                    {
                        content: 'http://cres.fenqile.com/res/mobile/res/img/app/i_sharef.png',
                        onClick: function(){
                            _this.renderShareInfo1();
                        }
                    },
                    {
                        content: 'http://cres.fenqile.com/res/mobile/res/img/app/gray_tip.png',
                        onClick: function(){
                            _this.renderShareInfo2();
                        }
                    }
                ]

            });
        });
     */
    setMultiRightIcon: function (options) {
        let _this = this;

        // 版本检查，不可用版本调用时报错
        if (AppBridge.isVersionBelow('3.6.4')) {
            let callVersion = this.getVersion();
            if (!options.isSilent) {
                setTimeout(function () { // 异步报错，不影响外部代码执行
                    throw new Error('call setMultiRightIcon on an invalid app version[' + callVersion + ']');
                }, 0);
            }
            return false;
        }

        let isVisible = (options.visible === undefined || options.visible === null) ? 1 : options.visible;
        let icons = [];

        // icons最多设置两个
        if (options.icons.length > 2) {
            options.icons = options.icons.slice(0, 2);
        }

        if (isVisible) {
            options.icons.forEach(function (item, key) {
                // 获取传给接口的回调函数名
                let callBackName = _this.getCallbackName('onClick', 'setMulRightIcon' + key);

                // 如果有传回调函数，则将其扩展到window，给客户端调用
                if (Tool.isFunction(item.onClick)) {
                    _this.setCallback(callBackName, item.onClick);
                }

                icons[key] = {
                    content: item.content,
                    callBackName: callBackName
                };
            });
        }

        let params = {
            visible: isVisible,
            icons: icons
        };

        return this.invoke('setMultiRightIcon', params);
    },
    /**
     * [设置未读消息数目]
     * @method setUnReadNumber
     * @param {[Object]} options 选项[必选]
     *    @param  {[String]} options.unread_num  指定app的界面
     * @returns {object}
     * @example
     AppBridge.invokeJsBridge('setUnReadNumber', {
                unread_num: 5
            });
     */
    setUnReadNumber: function (options) {
        return this.invoke('setUnReadNumber', options);
    },
    /**
     * [打开app的界面]
     * @method startActivity
     * @param {[Object]} options 选项[必选]
     *    @param  {[String]} options.content  指定app的界面
     * @returns {object}
     * @example
     AppBridge.invokeJsBridge('startActivity', {
                content: 'app/product/view/S201310010242.html'
            });
     */
    startActivity: function (options) {
        return this.invoke('startActivity', options);
    },
    /**
     * [显示提示]
     * @method toast
     * @param {[Object]} options 选项[必选]
     *    @param  {[String]} options.message  提示的文案
     * @returns {object}
     * @example
     AppBridge.invokeJsBridge('tips', {
                message: '这是tips内容！'
            });
     */
    tips: function (options) {
        return this.invoke('toast', options);
    },
    /**
     * [关闭当前包含并显示webview的界面]
     * 有页面内跳转的时候goBack就是返回web的上一页，没有就直接关闭原生页面
     * @method goBack
     * @param {object} options
     * @returns {object}
     * @example
     var ret = AppBridge.invokeJsBridge('goBack');
     */
    goBack: function (options) {
        return this.invoke('goBack', options);
    },
    /**
     * [打开app商户详情原生界面]
     * @method showMerchantDetail
     * @param {[Object]} options 选项[必选]
     *    @param  {[String]} options.merchant_id  商户ID[必选]
     *    @param  {[String]} options.latitude  纬度[可选] 经纬度不传，则不显示距离
     *    @param  {[String]} options.longitude  经度[可选] 经纬度不传，则不显示距离
     * @returns {object}
     * @example
     AppBridge.invokeJsBridge('showMerchantDetail', {
                merchant_id: '111111',
                latitude: '22.5297227180',
                longitude: '113.9393871425'
            });
     */
    showMerchantDetail: function (options) {
        return this.invoke('showMerchantDetail', options);
    },
    /**
     * [设置返回键点击事件回调]
     * @method setReturnClickListener
     * @param {[Object]} options 选项[必选]
     *    @param  {[String]} options.listenerFlag  是否取消默认返回事件 1 监听，执行回调；0 不监听，执行app默认回退行为
     *    @param  {[Function]} options.onClick  点击按钮回调
     * @returns {object}
     * @example
     AppBridge.invokeJsBridge('setReturnClickListener', {
                listenerFlag: 1,
                onClick: function(){}
            });
     */
    setReturnClickListener: function (options) {
        // 获取传给接口的回调函数名
        let callbackName = this.getCallbackName('onClick', 'setReturnClickListener');
        // 如果有传回调函数，则将其扩展到window，给客户端调用
        let listenerFlag = (options.listenerFlag || 0) + ''; // iosapp调整导致新bug，flag只能传字符串，这里做一层转换
        if (listenerFlag === '1') {
            if (!Tool.isFunction(options.onClick)) {
                return; // 如果设置了为1，但没有传回调函数，则直接返回，不调用接口，保持原状态
            }
            this.setCallback(callbackName, options.onClick);
        }

        let params = {
            listenerFlag: listenerFlag,
            callBackName: callbackName
        };

        return this.invoke('setReturnClickListener', params);
    },

    /**
     * [设置标题x按钮的显示]
     * @method setNavCloseButtonVisible
     * @param {[Object]} options 选项[必选]
     *    @param  {[String]} options.visible  左侧返回键是否展示 1 展示；0 隐藏
     * @returns {object}
     * @example
     AppBridge.invokeJsBridge('setNavCloseButtonVisible', {
                visible: 1
            });
     */
    setNavCloseButtonVisible: function (options) {
        return this.invoke('setNavCloseButtonVisible', options);
    },

    /**
     * [用户行为数据传输]
     * @method behaviorDataTransfer
     * @param {[Object]} options 选项[必选]
     *    @param  {[String]} options.data  传输的数据
     *    @param  {[Function]} options.onReturn  传输之后的回调函数
     * @returns {object}
     * @example
     AppBridge.invokeJsBridge('behaviorDataTransfer', {
                data: {
                    'scene_type' => 1,
                    'refer' => 'http://www.fenqile.com/',
                    'channel_id' => APP,
                    'is_encrypt' => 0
                },
                onReturn: function(){}
            });
     */
    behaviorDataTransfer: function (options) {
        // 获取传给接口的回调函数名
        let callbackName = this.getCallbackName('onReturn', 'behaviorDataTransfer');

        // 如果有传回调函数，则将其扩展到window，给客户端调用
        if (Tool.isFunction(options.onReturn)) {
            this.setCallback(callbackName, options.onReturn, function (res) {
                if (typeof res === 'object') {
                    options.onReturn(res);
                } else {
                    res = res || '';
                    let obj = JSON.parse(res);
                    options.onReturn(obj);
                }
            });
        }

        let params = {
            data: options.data,
            callBackName: callbackName
        };
        return this.invoke('behaviorDataTransfer', params);
    },

    /**
     * [隐藏刚开始加载webView时的进度条]
     * @method hideProgress
     * @param {object} options
     * @returns {object}
     * @example
     var ret = AppBridge.invokeJsBridge('hideProgress');
     */
    hideProgress: function (options) {
        return this.invoke('hideProgress', options);
    },
    /**
     * [首页界面的互相切换]
     * @method showColumn
     * @param {[Object]} options 选项[必选]
     *    @param  {[Int]} options.columnNumber  界面索引：0为“购物”界面；1为“信用钱包”界面；2为“限时惠”界面；3为“帮助”界面。
     * @returns {object}

     * @example
     AppBridge.invokeJsBridge('showColumn', {
                columnNumber: 0
            });
     */
    showColumn: function (options) {
        return this.invoke('showColumn', options);
    },
    /**
     * [分享]
     * @method shareDetails
     * @param {[Object]} options 选项[必选]
     *    @param  {[String]} options.title  分享的标题
     *    @param  {[String]} options.titleUrl  分享的链接Url(即被分享者点击跳转的链接)
     *    @param  {[String]} options.content  分享的内容
     *    @param  {[String]} options.imgurl  分享的图片链接Url
     *    @param  {[String]} options.singleImgUrl  单张图片的链接Url，用户分享单张图片的场景，3.6.4版本开始可用
     *    @param  {[String]} options.platform  需要显示的分享平台 1、所有平台：”12345678”或者””或者null 2、只有微信朋友，微信朋友圈：”45”。详细平台表参见wiki
     *    @param {[Function]} [options.onSuccess] 分享成功时的回调方法，3.6开始可用，历史版本此参数无意义
     *                              签名为 `function():void`，未提供时无行为。注意，App会自动toast提示，前端无需再处理
     *    @param {[Function]} [options.onCancel] 用户取消分享时的回调方法，3.6开始可用，历史版本此参数无意义
     *                              签名为 `function():void`，未提供时无行为。注意，App会自行toast提示，前端无需再处理
     *    @param  {[Function]} [options.onError] 分享过程出错时的回调方法，3.6开始可用，历史版本此参数无意义
     *                              签名为 `function():void`，未提供时无行为。注意，App会自行toast提示，前端无需再处理
     * @returns {object}
     *
     * @example
     var ret = AppBridge.invokeJsBridge('shareDetails');
     */
    shareDetails: function (options) {
        // 如果不在app中，则设置默认行为
        if (this.checkNotInApp(options)) {
            // 不在app中
            return false;
        }
        // 保留方法引用，防止异步时方法在外部被更改
        let onSuccess = options.onSuccess;
        let onCancel = options.onCancel;
        let onError = options.onError;
        // 包装回调方法
        let callbackName = this.getCallbackName('onShareDetailsReturn', 'shareDetails');
        this.setCallback(callbackName, function (res) {
            if (typeof res !== 'object') { // android返回返回字符串，但是要针对低版本的app返回不标准的字符串做转换
                res = res || '';
                res = res.replace(/:"\{/g, ':{').replace(/\}",/g, '},');
                res = eval('(' + res + ')');
            }
            if (res.retcode === '0') {
                if (Tool.isFunction(onSuccess)) {
                    onSuccess({
                        raw: res
                    });
                }
            } else if (res.retcode === '1') {
                if (Tool.isFunction(onError)) {
                    onError({
                        raw: res
                    });
                }
            } else if (res.retcode === '2') {
                if (Tool.isFunction(onCancel)) {
                    onCancel({
                        raw: res
                    });
                }
            }
        });

        let params = {
            title: (options.title || document.title) + '',
            titleUrl: (options.titleUrl || location.href) + '',
            content: (options.content || document.title) + '',
            imgurl: (options.imgurl || document.imgurl || '') + '',
            imgUrl: (options.imgurl || document.imgurl || '') + '', // 兼容ios
            singleImgUrl: (options.singleImgUrl || document.singleImgUrl || '') + '',
            platform: (options.platform || document.platform || '') + '',
            tip: (options.tip || ''),
            callBackName: callbackName,
            wxUserName: options.wxUserName || '', // 小程序原始id
            wxPath: options.wxPath || '', // 分享进入的页面
            wxImgUrl: options.wxImgUrl || '//res.fenqile.com/res/img/global/wx_logo.png', // 小程序分享图，建议为5:4
            wxMiniProgramType: options.wxMiniProgramType || '0' // 小程序版本 0为正式版，2为体验版，1为测试版
        };
        return this.invoke('shareDetails', params);
    },
    /**
     * [获取联系人信息]
     * @method getContacts
     * @param {[Object]} options 选项[必选]
     *    @param  {[Function]} options.onContactsReceive  回调函数
     * @returns {object}
     * @example
     AppBridge.invokeJsBridge('getContacts', {
                onContactsReceive: function(str){
                    log(str);
                }
            });
     */
    getContacts: function (options) {
        // 获取传给接口的回调函数名
        let callbackName = this.getCallbackName('onContactsReceive');
        // 如果有传回调函数，则将其扩展到window，给客户端调用
        if (Tool.isFunction(options.onContactsReceive)) {
            this.setCallback(callbackName, options.onContactsReceive);
        }
        let params = {
            callBackName: callbackName
        };
        return this.invoke('getContacts', params);
    },
    /**
     * [下单回调]
     * 当用户下完单时，调用此接口完成风控相关需求
     * @method onOrderSubmit
     * @param {[Object]} options 选项[必选]
     *    @param  {[String]} options.order_id  订单号
     * @returns {object}
     * @example
     AppBridge.invokeJsBridge('onOrderSubmit', {
                orderId: '2654895784'
            });
     */
    onOrderSubmit: function (options) {
        return this.invoke('onOrderSubmit', options);
    },
    /**
     * 获取支付成功/失败结果
     * @method fqlPayResultWithRetCode
     * @param {[Object]} options 选项[必选]
     *    @param  {[String]} options.retCode  状态码
     * @returns {object}
     * @example
     AppBridge.invokeJsBridge('fqlPayResultWithRetCode', {
                retCode: '0',     //状态码（0成功 -1失败 -2取消）
                retInfo: '',         //返回信息
                attach: {}                //扩展字段
            });
     */
    fqlPayResultWithRetCode: function (options) {
        return this.invoke('fqlPayResultWithRetCode', options);
    },
    /**
     * [获取极光推送的pushToken]
     * @method getPushToken
     * @param {object} options
     * @returns {object}
     * @example
     AppBridge.invokeJsBridge('getPushToken', {
                onReturn: function(data){}
            });
     */
    getPushToken: function (options) {
        return this.setAsyncCall('getPushToken', options);
    },
    /**
     * [获取同盾的token]
     * @method getFraudmetrixToken
     * @param {object} options
     * @returns {object}
     * @example
     AppBridge.invokeJsBridge('getFraudmetrixToken', {
                onReturn: function(data){}
            });
     */
    getFraudmetrixToken: function (options) {
        return this.setAsyncCall('getFraudmetrixToken', options);
    },
    /**
     * [获取系统信息]
     * @method getFmSysParams
     * @param {object} options
     * @returns {object}
     * @example
     AppBridge.invokeJsBridge('getFmSysParams', {
                onReturn: function(data){}
            });
     */
    getFmSysParams: function (options) {
        return this.setAsyncCall('getFmSysParams', options);
    },
    /**
     * [订单详情浏览历史]
     * 当用户打开商品详情时，传入skuid到app，app端存入浏览历史
     * @method onOrderSubmit
     * @param {[Object]} options 选项[必选]
     *    @param  {[String]} options.sku_id  订单号
     * @returns {object}
     * @example
     AppBridge.invokeJsBridge('onOrderSubmit', {
                orderId: '2654895784'
            });
     */
    onProductDetailOpened: function (options) {
        return this.invoke('onProductDetailOpened', options);
    },
    /**
     * [判断操作系统是Android]
     * @method isAndroid
     * @returns {boolean}
     * @example
     var ret = AppBridge.invokeJsBridge('isAndroid');
     */
    isAndroid: function () {
        let ua = navigator.userAgent;
        let patt = /fenqile_android_(\d{1,}\.\d{1,}\.\d{1,})/i;
        let res = patt.exec(ua);

        return !!res;
    },
    /**
     * [判断操作系统是isIos]
     * @method isIos
     * @returns {boolean}
     * @example
     var ret = AppBridge.invokeJsBridge('isIos');
     */
    isIos: function () {
        let ua = navigator.userAgent;
        let patt = /fenqile_ios_(\d{1,}\.\d{1,}\.\d{1,})/i;
        let res = patt.exec(ua);
        return !!res;
    },
    /**
     * [是否采用iOS第二版JSAPI调用方式]
     * @method isIosV2Invok
     * @returns {boolean}
     * @example
     var ret = AppBridge.invokeJsBridge('isIosV2Invok');
     */
    isIosV2Invok: function () {
        let ua = navigator.userAgent;
        let patt = /wv_i_v2/i;
        let res = patt.exec(ua);
        return !!res;
    },
    /**
     * [获取当前App的版本号]
     * @method getVersion
     * @returns {string}
     * @example
     var ret = AppBridge.invokeJsBridge('getVersion');
     */
    getVersion: function () {
        let ua = navigator.userAgent;
        let patt = /fenqile_(ios|android)_(\d{1,}\.\d{1,}\.\d{1,})/i;
        let res = patt.exec(ua);
        if (res) {
            return res[2];
        }
        return '';
    },
    /**
     * [获取设备号]
     * @method getDeviceId
     * @returns {string}
     * @example
     var ret = AppBridge.invokeJsBridge('getDeviceId');
     */
    getDeviceId: function () {
        let deviceInfo = this.getDeviceInfo();
        if (!deviceInfo) { // 不在app中
            return '';
        }
        return deviceInfo['deviceId'];
    },
    /**
     * [判断是不是App]
     * @method isApp
     * @returns {boolean}
     * @example
     var ret = AppBridge.invokeJsBridge('isApp');
     */
    isApp: function () {
        // 通过ua来判断
        let ua = navigator.userAgent;
        let patt = /fenqile_(ios|android)_(\d{1,}\.\d{1,}\.\d{1,})/i;
        let res = patt.exec(ua);
        return !!res;
    },

    /**
     * [人脸识别]
     * @method startFaceRecognize
     * @param {[Object]} options 选项[必选]
     *    @param  {[Function]} options.onRecognizeReturn  回调函数
     * @return {[Object]}
     * {
     *      retmsg: 'success',
     *      retcode: 0
     * }
     * @example
     *    AppBridge.invokeJsBridge('startFaceRecognize', {
     *             onRecognizeReturn: function(str){
     *                  log(str);
     *             }
     *        });
     */
    startFaceRecognize: function (options) {
        // 获取传给接口的回调函数名
        let callbackName = this.getCallbackName('onRecognizeReturn', 'startFaceRecognize');
        // 如果有传回调函数，则将其扩展到window，给客户端调用
        if (Tool.isFunction(options.onRecognizeReturn)) {
            this.setCallback(callbackName, options.onRecognizeReturn, function (res) {
                if (typeof res === 'object') {
                    options.onRecognizeReturn(res);
                } else {
                    res = res || '';
                    let obj = JSON.parse(res);
                    options.onRecognizeReturn(obj);
                }
            });
        }
        let params = {};
        if (options.scene) {
            params = {
                callBackName: callbackName,
                scene: options.scene
            };
        } else {
            params = {
                callBackName: callbackName
            };
        }
        return this.invoke('startFaceRecognize', params);
    },
    /**
     * 判断是否页面是否工作与沉浸式状态栏之下
     *
     * @method isSupportedImmersiveStatusBar
     *
     * @returns {boolean} 是否在沉浸式状态栏下工作
     */
    isSupportedImmersiveStatusBar: function () {
        if (this.isApp) {
            if (this.isIos()) {
                return true;
            } else if (this.isAndroid()) {
                //  appVersion  >= 3.4.0&&android X.X.X >= 4.4.0
                let appVersion = this.getVersion();
                let androidVersion = (/\bAndroid\s+(\d+.\d+.\d+)\b/.exec(navigator.userAgent) || [])[1] || null;
                if (appVersion >= '3.4.0' && androidVersion >= '4.4.0') { // TODO 暂时保持与其他场景用法相同，直接比较字符串
                    return true;
                }
            }
        }
        return true;
    },
    /**
     * 分期乐app打开系统以浏览器加载url
     *
     * @method openSysBrowser
     *
     * @param {object} options 调用选项
     * @param {string} options.url 待打开的URL
     * @param {boolean} [options.isSilent=false] 是否静默调用。静默调用时，即使App不支持也不报错
     * @return {boolean} 是否成功请求API
     *
     * @since 3.5.0
     */
    openSysBrowser: function (options) {
        // 入参合法性检查
        !options && (options = {});
        if (typeof options.url !== 'string') {
            throw new Error('options.url[' + options.url + '] must be a string');
        }
        // 版本检查，不可用版本调用时报错
        if (AppBridge.isVersionBelow('3.5.0')) {
            let callVersion = this.getVersion();
            if (!options.isSilent) {
                setTimeout(function () { // 异步报错，不影响外部代码执行
                    throw new Error('call openSysBrowser on an invalid app version[' + callVersion + ']');
                }, 0);
            }
            return false;
        }
        // 准备调用参数
        let params = {
            url: Tool.normalizeUrl(options.url)
        };
        // 调用API
        this.invoke('openSysBrowser', params);
        // 标识请求成功
        return true;
    },
    /**
     * 多张照片上传
     *
     * @method chooseMultiPhoto
     *
     * @param {object} options 调用选项
     * @param {string} options.scene 上传场景
     * @param {int} options.maxPhotoNum 上传时允许选择的照片最大数量。App侧限制之多选择10张，建议不超过5张
     * @param {function} options.callback 上传后的回调方法
     *              方法签名为 `function(json):void`，其中json格式为
     *              `{retcode:"0", retmsg:"success", data:["http://img1.xxxxxxx.html", "http://img1.xxxxxxx.html"...]}`
     *              其中，retcode为`"0"`时，表示上传成功，data不为空数组
     *                   retcode为`"2"`时，表示用户取消了上传，data无意义
     *                   retcode为`"1"`或其它值时，表示上传过程发生了错误
     * @param {boolean} [options.isSilent=false] 是否静默调用。静默调用时，即使App不支持也不报错
     * @return {boolean} 是否成功请求API
     *
     * @since 3.5.0
     */
    chooseMultiPhoto: function (options) {
        // 入参合法性检查
        !options && (options = {});
        if (!options.scene) {
            throw new Error('options.scene[' + options.scene + '] can not be empty');
        }
        if (!options.maxPhotoNum) {
            throw new Error('options.maxPhotoNum[' + options.maxPhotoNum + '] can not be empty');
        }
        if (!Tool.isFunction(options.callback)) {
            throw new Error('options.callback[' + options.callback + '] must be a function');
        }
        // 获取传给接口的回调函数名
        let callbackName = this.getCallbackName('onChooseMultiPhotoReturn', 'chooseMultiPhoto');
        // 如果有传回调函数，则将其扩展到window，给客户端调用
        if (Tool.isFunction(options.callback)) {
            this.setCallback(callbackName, options.callback, function (res) {
                if (typeof res !== 'object') { // android返回返回字符串
                    res = JSON.parse(res || '');
                }
                options.callback(res);
            });
        }
        // 版本检查，不可用版本调用时报错
        if (AppBridge.isVersionBelow('3.5.0')) {
            if (!options.isSilent) {
                let callVersion = this.getVersion();
                setTimeout(function () { // 异步报错，不影响外部代码执行
                    throw new Error('call chooseMultiPhoto on an invalid app version[' + callVersion + ']');
                }, 0);
            }
            return false;
        }
        // 准备调用参数
        let params = {
            scene: options.scene,
            maxPhotoNum: options.maxPhotoNum,
            callBackName: callbackName
        };
        // 调用API
        this.invoke('chooseMultiPhoto', params);
        return true;
    },
    /**
     * 关闭所有界面并打开一个新的界面
     *
     * @method closeAllActivityAndOpenNew
     *
     * @param {object} options 调用选项
     * @param {string} options.url 需要新打开界面的url
     * @param {boolean} [options.isSilent=false] 是否静默调用。静默调用时，即使App不支持也不报错
     * @return {boolean} 是否成功请求API
     *
     * @since 3.5.0
     */
    closeAllActivityAndOpenNew: function (options) {
        // 入参合法性检查
        !options && (options = {});
        if (typeof options.url !== 'string') {
            throw new Error('options.url[' + options.url + '] must be a string');
        }

        // 版本检查，不可用版本调用时报错
        if (AppBridge.isVersionBelow('3.5.0')) {
            let callVersion = this.getVersion();
            if (!options.isSilent) {
                setTimeout(function () { // 异步报错，不影响外部代码执行
                    throw new Error('call closeAllActivityAndOpenNew on an invalid app version[' + callVersion + ']');
                }, 0);
            }
            return false;
        }
        // 准备调用参数
        let params = {
            url: Tool.normalizeUrl(options.url)
        };
        // 调用API
        this.invoke('closeAllActivityAndOpenNew', params);
        // 标识请求成功
        return true;
    },
    /**
     * 身份证照片上传
     *
     * @method idCardCapture
     *
     * @param {options} options 调用选项
     * @param {int} options.captureMode 拍摄模式（0为正面，1为反面）
     * @param {function} options.callback 上传后的回调方法
     *              方法签名为 `function(json):void`，其中json格式为
     *              `{retcode:"0", retmsg:"success", faceExists: "0", captureMode:" 0", data:"data:image/png;base64,nahwegjhalkwneoighnkwenglk"}`
     *              其中，retcode为`"0"`时，表示上传成功，data不为空
     *                   retcode为`"2"`时，表示用户取消了上传，data无意义
     *                   retcode为`"1"`或其它值时，表示上传过程发生了错误
     *                   faceExists表示回传给h5的照片中是否含有人脸，`0`含有，`1`不含（只有拍摄身份证带头像的时候此参数有用，反面此参数为1）
     *                   captureMode表示拍摄模式，`0`为正面，`1`为反面（此值为h5传过来的值）
     *                   data是经过base64编码的图片
     * @param {boolean} [options.isSilent=false] 是否静默调用。静默调用时，即使App不支持也不报错
     * @return {boolean} 是否成功请求API
     *
     * @since 3.5.0
     */
    idCardCapture: function (options) {
        // 入参合法性检查
        !options && (options = {});
        if (options.captureMode === undefined) {
            throw new Error('options.captureMode[' + options.captureMode + '] must be 0 or 1');
        }
        if (!Tool.isFunction(options.callback)) {
            throw new Error('options.callback[' + options.callback + '] must be a function');
        }
        // 获取传给接口的回调函数名
        let callbackName = this.getCallbackName('onIdCardCaptureReturn', 'idCardCapture');
        // 如果有传回调函数，则将其扩展到window，给客户端调用
        if (Tool.isFunction(options.callback)) {
            this.setCallback(callbackName, options.callback, function (res) {
                if (typeof res !== 'object') { // android返回返回字符串
                    res = JSON.parse(res || '');
                }
                if (res && res.retcode === '0' && typeof res.data === 'string') {
                    res.data = 'data:image/png;base64,' + res.data; // 拼接base64头
                }
                options.callback(res);
            });
        }
        // 版本检查，不可用版本调用时报错
        if (AppBridge.isVersionBelow('3.5.0')) {
            if (!options.isSilent) {
                let callVersion = this.getVersion();
                setTimeout(function () { // 异步报错，不影响外部代码执行
                    throw new Error('call idCardCapture on an invalid app version[' + callVersion + ']');
                }, 0);
            }
            return false;
        }
        // 准备调用参数
        let params = {
            captureMode: options.captureMode,
            callBackName: callbackName
        };
        // 调用API
        this.invoke('idCardCapture', params);
        return true;
    },
    /**
     * 打开指纹支付原生界面（iOS）
     * @method openTouchPayActivity
     * @param {object} [options] 调用选项
     * @param {boolean} [options.isSilent=false] 是否静默调用。静默调用时，即使App不支持也不报错
     * @return {boolean} 是否成功请求API
     *
     * @since 3.6.0 限iOS
     */
    openTouchPayActivity: function (options) {
        // 入参合法性检查
        !options && (options = {});
        // 系统检查，不可用版本调用时报错
        if (!this.isIos()) {
            if (!options.isSilent) {
                setTimeout(function () { // 异步报错，不影响外部代码执行
                    throw new Error('call openTouchPayActivity on a non-iOS app');
                }, 0);
            }
            return false;
        }
        // 版本检查，不可用版本调用时报错
        if (AppBridge.isVersionBelow('3.6.0')) {
            if (!options.isSilent) {
                let callVersion = this.getVersion();
                setTimeout(function () { // 异步报错，不影响外部代码执行
                    throw new Error('call openTouchPayActivity on an invalid app version[' + callVersion + ']');
                }, 0);
            }
            return false;
        }
        // 准备调用参数
        let params = {};
        // 调用API
        this.invoke('openTouchPayActivity', params);
        return true;
    },
    /**
     * 设备是否支持指纹支付（iOS）
     *
     * @method isHaveTouchPay
     *
     * @param {object} options 调用选项
     * @param {function} options.callback 获取到判断结果时的回调方法
     *              方法签名为 `function(result:object):void`
     *              其中，`result`对象定义为 `{ device_status: int, pay_status: int }`
     *                  device_status为0时，表示设备支持指纹支付
     *                  device_status为1时，表示设备不支持指纹支付
     *                  pay_status为0时，表示用户已启用指纹支付。设备不支持指纹支付时，总是为1
     *                  pay_status为1时，表示用户未启用指纹支付
     *                  raw对象为接口返回的原始数据对象，不建议使用
     * @param {boolean} [options.isSilent=false] 是否静默调用。静默调用时，即使App不支持也不报错
     * @return {boolean} 是否成功请求API
     *
     * @since 3.6.0 限iOS
     */
    isHaveTouchPay: function (options) {
        // 入参合法性检查
        !options && (options = {});
        if (!Tool.isFunction(options.callback)) {
            throw new Error('options.callback[' + options.callback + '] must be a function');
        }

        // 系统检查，不可用版本调用时报错
        if (!this.isIos()) {
            if (!options.isSilent) {
                setTimeout(function () { // 异步报错，不影响外部代码执行
                    throw new Error('call isHaveTouchPay on a non-iOS app');
                }, 0);
            }
            return false;
        }
        // 版本检查，不可用版本调用时报错
        if (AppBridge.isVersionBelow('3.6.0')) {
            if (!options.isSilent) {
                let callVersion = this.getVersion();
                setTimeout(function () { // 异步报错，不影响外部代码执行
                    throw new Error('call isHaveTouchPay on an invalid app version[' + callVersion + ']');
                }, 0);
            }
            return false;
        }

        // 获取传给接口的回调函数名
        let callbackName = this.getCallbackName('onIsHaveTouchPayReturn', 'isHaveTouchPay');
        // 回调函数扩展到window，给客户端调用
        this.setCallback(callbackName, options.callback, function (res) {
            let deviceStatus = '1';
            let payStatus = '1';
            if (res) {
                deviceStatus = res['device_status'];
                payStatus = res['pay_status'];
            }
            options.callback({
                device_status: deviceStatus,
                pay_status: payStatus,
                raw: res
            });
        });

        // 准备调用参数
        let params = {
            callBackName: callbackName
        };

        // 调用API
        this.invoke('isHaveTouchPay', params);

        return true;
    },
    /**
     * 打开App指纹支付功能（iOS）
     *
     * @method showTouchPay
     *
     * @param {object} options 调用选项
     * @param {string} options.key 从后端获取的随机字符串，用于标识本次支付过程，加密数据
     * @param {string} [options.descText] 系统指纹验证弹层上的描述文案，未指定时使用App设置的默认值
     * @param {boolean} [options.isShowPwdBtn=true] 是否显示输入密码按钮，默认显示
     * @param {string} [options.pwdBtnText] 系统指纹验证弹层上的输入密码按钮文案，未指定时使用App设置的默认值
     * @param {function} options.callback 处理支付结果的回调方法
     *              方法签名为 `function(result:object):void`
     *              其中，`result`对象定义为 `{ pay_status: int, pay_info: string, sign: string }`
     *                  pay_status为0时，表示指纹支付验证通过
     *                  pay_status为1时，表示指纹支付验证失败
     *                  pay_status为2时，表示用户取消了指纹支付操作
     *                  pay_status为3时，表示用户选择了输入密码操作
     *                  pay_info为本次支付的标识字符串，仅pay_status为0时有效
     *                  sign为pay_info的签名字符串，仅pay_status为0时有效
     *                  raw对象为接口返回的原始数据对象，不建议使用
     * @param {boolean} [options.isSilent=false] 是否静默调用。静默调用时，即使App不支持也不报错
     * @return {boolean} 是否成功请求API
     *
     * @since 3.6.0 限iOS
     */
    showTouchPay: function (options) {
        // 入参合法性检查
        !options && (options = {});
        if (typeof options.key !== 'string') {
            throw new Error('options.key[' + options.callback + '] must be a string');
        }
        if (!Tool.isFunction(options.callback)) {
            throw new Error('options.callback[' + options.callback + '] must be a function');
        }

        // 系统检查，不可用版本调用时报错
        if (!this.isIos()) {
            if (!options.isSilent) {
                setTimeout(function () { // 异步报错，不影响外部代码执行
                    throw new Error('call showTouchPay on a non-iOS app');
                }, 0);
            }
            return false;
        }
        // 版本检查，不可用版本调用时报错
        if (AppBridge.isVersionBelow('3.6.0')) {
            if (!options.isSilent) {
                let callVersion = this.getVersion();
                setTimeout(function () { // 异步报错，不影响外部代码执行
                    throw new Error('call showTouchPay on an invalid app version[' + callVersion + ']');
                }, 0);
            }
            return false;
        }

        // 获取传给接口的回调函数名
        let callbackName = this.getCallbackName('onShowTouchPayReturn', 'showTouchPay');
        // 回调函数扩展到window，给客户端调用
        this.setCallback(callbackName, options.callback, function (res) {
            let payStatus;
            let payInfo = '';
            let sign = '';
            payStatus = res['pay_status'];
            if (payStatus === '0') {
                payInfo = res['pay_info'];
                sign = res['sign'];
            }
            options.callback({
                pay_status: payStatus,
                pay_info: payInfo,
                sign: sign,
                raw: res
            });
        });

        // 准备调用参数
        let params = {
            random_num: options.key,
            is_show_pwd_btn: ('isShowPwdBtn' in options) ? (options.isShowPwdBtn ? '1' : '0') : '1',
            reason_string: options.descText || '',
            fallback_string: options.pwdBtnText || '',
            callBackName: callbackName
        };

        // 调用API
        this.invoke('showTouchPay', params);

        return true;
    },

    /**
     * 读取分期乐短信（Android）
     * @method receiveSMS
     * @param {object} [options] 调用选项
     * @param {boolean} [options.isSilent=false] 是否静默调用。静默调用时，即使App不支持也不报错
     * @param {function} options.callback 读取结果的回调方法
     *              方法签名为 `function(result:object):void`
     *              其中，`result`对象定义为 `{ retcode: number, retmsg: string, data: string }`
     *              data为短信的内容
     * @return {boolean} 是否成功请求API
     *
     * @since 3.6.4 限android
     */
    receiveSMS: function (options) {
        // 入参合法性检查
        !options && (options = {});
        if (!Tool.isFunction(options.callback)) {
            throw new Error('options.callback[' + options.callback + '] must be a function');
        }

        // 系统检查，不可用版本调用时报错
        if (!this.isAndroid()) {
            if (!options.isSilent) {
                setTimeout(function () { // 异步报错，不影响外部代码执行
                    throw new Error('call receiveSMS on a non-android app');
                }, 0);
            }
            return false;
        }
        // 版本检查，不可用版本调用时报错
        if (AppBridge.isVersionBelow('3.6.4')) {
            if (!options.isSilent) {
                let callVersion = this.getVersion();
                setTimeout(function () { // 异步报错，不影响外部代码执行
                    throw new Error('call receiveSMS on an invalid app version[' + callVersion + ']');
                }, 0);
            }
            return false;
        }

        // 获取传给接口的回调函数名
        let callbackName = this.getCallbackName('onReceiveSMSReturn', 'receiveSMS');
        // 回调函数扩展到window，给客户端调用
        this.setCallback(callbackName, options.callback);

        // 准备调用参数
        let params = {
            callBackName: callbackName
        };

        // 调用API
        this.invoke('receiveSMS', params);

        return true;
    },

    /**
     * 向APP记录日志
     *
     * @method outputLog
     *
     * @param {object} options 调用选项
     * @param {string} options.level 日志级别，总共分4个级别：“0”表示“error”级别，“1”表示“warning”级别，“2”表示“info”级别 ，“3”表示“debug”级别
     * @param {string} options.module 当前模块名称，命名规则与点击流一致
     * @param {string} options.content 当前模块名称，命名规则与点击流一致
     * @param {boolean} [options.isSilent=false] 是否静默调用。静默调用时，即使App不支持也不报错
     * @return {boolean} 是否成功请求API
     *
     * @since 3.6.4
     */
    outputLog: function (options) {
        // 入参合法性检查
        !options && (options = {});
        if (typeof options.level === 'undefined') {
            throw new Error('options.level[' + options.level + '] is not provided');
        }
        if (typeof options.module !== 'string') {
            throw new Error('options.module[' + options.module + '] must be a string');
        }
        if (typeof options.content === 'undefined') {
            throw new Error('options.content[' + options.content + '] is not provided');
        }

        // 版本检查，不可用版本调用时报错
        if (AppBridge.isVersionBelow('3.6.4')) {
            let callVersion = this.getVersion();
            if (!options.isSilent) {
                setTimeout(function () { // 异步报错，不影响外部代码执行
                    throw new Error('call closeAllActivityAndOpenNew on an invalid app version[' + callVersion + ']');
                }, 0);
            }
            return false;
        }

        // 准备调用参数
        let params = {
            level: options.level,
            module: options.module,
            content: options.content
        };

        // 调用API
        this.invoke('outputLog', params);

        // 标识请求成功
        return true;
    },

    /**
     * 设置webview隐藏和返回的回调
     *
     * @method setPageStatusCallback
     *
     * @param {object} options 调用选项
     * @param {function} options.stopCallback webview界面隐藏时的回调
     * @param {function} options.resumeCallback webview界面显示时的回调
     *              方法签名为 `function(result:object):void`
     *              其中，`result`对象定义为 `{ retcode: number, retmsg: string, data: string }`, data为用户输入的内容
     * @return {boolean} 是否成功请求API
     *
     * @since 3.7.0
     */
    setPageStatusCallback: function (options) {
        // 入参合法性检查
        !options && (options = {});

        // 获取传给接口的回调函数名
        let stopCallbackName = this.getCallbackName('OnStop', 'PageStatus');
        let resumeCallbackName = this.getCallbackName('OnResume', 'PageStatus');

        // 回调函数扩展到window，给客户端调用
        if (options.stopCallback) {
            this.setCallback(stopCallbackName, options.stopCallback, function (res) {
                if (typeof res === 'object') { // ios会返回json对象
                    options.stopCallback(res);
                } else {
                    res = res || '';
                    let obj = JSON.parse(res);
                    options.stopCallback(obj);
                }
            });
        }

        if (options.resumeCallback) {
            this.setCallback(resumeCallbackName, options.resumeCallback, function (res) {
                if (typeof res === 'object') { // ios会返回json对象
                    options.resumeCallback(res);
                } else {
                    res = res || '';
                    let obj = JSON.parse(res);
                    options.resumeCallback(obj);
                }
            });
        }

        // 标识请求成功
        return true;
    },

    /**
     * 将客服电话写入用户通讯录
     *
     * @method addServicePhoneNum
     *
     * @param {object} options 调用选项
     * @return {boolean} 是否成功请求API
     *
     * @since 3.7.4
     */
    addServicePhoneNum: function (options) {
        // 入参合法性检查
        !options && (options = {});

        // 版本检查，不可用版本调用时报错
        if (AppBridge.isVersionBelow('3.7.4')) {
            let callVersion = this.getVersion();
            setTimeout(function () { // 异步报错，不影响外部代码执行
                throw new Error('call addServicePhoneNum on an invalid app version[' + callVersion + ']');
            }, 0);
            return false;
        }

        // 调用API
        this.invoke('addServicePhoneNum');

        // 标识请求成功
        return true;
    },

    /**
     * 更改app头部颜色
     *
     * @method setTitleBg
     *
     * @param {object} options 调用选项
     * @param {string} options.title_bg_color 颜色值，6位16进制，如#FFFFFF
     * @return {boolean} 是否成功请求API
     *
     * @since 4.0.0
     */
    setTitleBg: function (options) {
        // 入参合法性检查
        !options && (options = {});

        // 版本检查，不可用版本调用时报错
        if (AppBridge.isVersionBelow('4.0.0')) {
            let callVersion = this.getVersion();
            if (!options.isSilent) {
                setTimeout(function () { // 异步报错，不影响外部代码执行
                    throw new Error('call setTitleBg on an invalid app version[' + callVersion + ']');
                }, 0);
            }
            return false;
        }

        // 准备调用参数
        let params = {
            title_bg_color: options.title_bg_color
        };

        // 调用API
        this.invoke('setTitleBg', params);

        // 标识请求成功
        return true;
    },

    /**
     * 更改购物车数量
     *
     * @method updateShoppingCartNum
     *
     * @param {object} options 调用选项
     * @param {int} options.num 购物车数量
     * @return {boolean} 是否成功请求API
     *
     * @since 4.2.2
     */
    updateShoppingCartNum: function (options) {
        // 入参合法性检查
        !options && (options = {});

        // 版本检查，不可用版本调用时报错
        if (AppBridge.isVersionBelow('4.2.2')) {
            let callVersion = this.getVersion();
            if (!options.isSilent) {
                setTimeout(function () { // 异步报错，不影响外部代码执行
                    throw new Error('call setTitleBg on an invalid app version[' + callVersion + ']');
                }, 0);
            }
            return false;
        }

        // 准备调用参数
        let params = {
            num: options.num
        };

        // 调用API
        this.invoke('updateShoppingCartNum', params);

        // 标识请求成功
        return true;
    },
    /**
     * 打开App评价弹窗
     * @method showAppCommentView
     * @return {boolean}
     * @since 4.4.0
     * 仅IOS方法
     */
    showAppCommentView: function () {
        if (AppBridge.isVersionBelow('4.4.0')) {
            // 标识请求失败
            return false;
        }

        // 调用API
        this.invoke('showAppCommentView');

        // 标识请求成功
        return true;
    },

    /**
     * [微信授权登录]
     * @method doWxAuthLogin
     * @param {object} options
     * @returns {object}
     * @example
     AppBridge.invokeJsBridge('doWxAuthLogin', {
                onReturn: function(data){}
            });
     */
    doWxAuthLogin: function (options) {
        return this.setAsyncCall('doWxAuthLogin', options);
    }
};

/**
 *[AppBridge 通用方法]
 *@class AppBridge
 */
const AppBridge = {
    /**
     * [app外H5跳转判断]
     * @method outsideAppGuid
     * @param  {[Object]} options 选项[必选]
     *    @param  {[String]} options.cmd   调起app的指令
     *    @param  {[Function]} options.guide 未安装app的默认操作，没有回调时，默认跳到下载页
     * @example
     // 不在app内
     if(Tool.os.android){  // android下
                AppBridge.outsideAppGuid({
                    cmd: "fenqile://app/webview?url=" + encodeURIComponent(url),  // 安装了app的操作
                    guide: function(){  // 未安装app的默认操作
                        _this.renderGuideWrap(Tool("#low_guide_wrap"));
                    }
                });
            }else if(Tool.os.ios){  // ios下
                AppBridge.outsideAppGuid({
                    cmd: "fenqile://app/webview?url=" + encodeURIComponent(url),  // 安装了app的操作
                    guide: function(){  // 未安装app的默认操作
                        _this.renderGuideWrap(Tool("#ios_guide_wrap"));
                    }
                });
            }
     参考链接：http://m.fenqile.com/res/js/action/applewatch.js
     */
    outsideAppGuid: function (options) {
        app.guide(options);
    },
    /**
     * [区分是否在app中执行不同方法]
     * @method bridgeCall
     * @param {[Function]} fn1 在app中时执行的方法
     * @param {[Function]} fn2 不在app中时执行的方法
     * @example
     bridgeCall(function () {
                AppBridge.invokeJsBridge('tips', {
                    message: '这是tips内容！'
                });
            }, function() {
                Toast.showTip('这是tips内容！');
            });

     */
    bridgeCall: function (fn1, fn2) {
        if (jsBridge.isApp()) {
            if (typeof fn1 === 'function') {
                fn1();
            }
        } else {
            if (typeof fn2 === 'function') {
                fn2();
            }
        }
    },
    jsBridgeReady: function (callback) {
        jsBridge.ready(callback);
    },
    /**
     * [调用APP接口]
     * @method invokeJsBridge
     * @param {string} method 
     * @param {object} options 
     * @returns {object}
     * @example
     */
    invokeJsBridge: function (method, options) {
        return jsBridge[method](options);
    },
    logout: function () {
        // 进登录页面先清除app登录态
        this.invokeJsBridge('onLogOut');
        location.href = '//mall.m.fenqile.com/logout';
    },
    /**
     * [替换location.href跳转]
     * @method locationHref
     * @param {[String]} url 跳转链接
     * @param {number} isLoadOnCurPage （1：直接在当前页面加载新的页面, 0:打开新的页面）
     * @example
     AppBridge.locationHref('http://m.fenqile.com/');
     */
    locationHref: function (url, isLoadOnCurPage = 0) {
        // 不在app里，或者不是分期乐的域名则直接跳转
        if (!jsBridge.isApp()) {
            app.locationHandle(url, isLoadOnCurPage);
        } else {
            // 检测是否绝对路径，站内路径均为相对路径，绝对路径为站外路径，采用location.href方式跳转
            if (/^http[s]?:\/\/[^.]*/.test(url)) {
                // 检测是否是分期乐的域名，是则通过openUrl方式打开
                if (/^http[s]?:\/\/([^.]*.){1,2}(fenqile)\.com/.test(url)) {
                    this.invokeJsBridge('openUrl', {
                        url: Tool.normalizeUrl(url),
                        isLoadOnCurPage: isLoadOnCurPage
                    });
                } else { // 不是则采用location.href方式跳转
                    app.locationHandle(url, isLoadOnCurPage);
                }
            } else {
                url = Tool.normalizeUrl(url); // 如果是相对路径，则补齐域名
                if (/^http[s]?:\/\/([^.]*\.)+(fenqile)\.com/.test(url)) {
                    this.invokeJsBridge('openUrl', {
                        url: Tool.normalizeUrl(url),
                        isLoadOnCurPage: isLoadOnCurPage
                    });
                } else {
                    app.locationHandle(url, isLoadOnCurPage);
                }
            }
        }
    },
    /**
     * [App中打开新的页面]
     * @method locationHref
     * @param {[String]} url 跳转链接
     * @param {number} isLoadOnCurPage （1：直接在当前页面加载新的页面, 0:打开新的页面）
     * @example
     AppBridge.locationHref('http://m.fenqile.com/');
     */
    locationNewPage: function (url, isLoadOnCurPage = 0) {
        if (!jsBridge.isApp()) {
            app.locationHandle(url, isLoadOnCurPage);
        } else {
            this.invokeJsBridge('openUrl', {
                url: Tool.normalizeUrl(url),
                isLoadOnCurPage: isLoadOnCurPage
            });
        }
    },
    /**
     * [app版本号是否高于指定的版本]
     * @method isVersionAbove
     * @param {[String]} version 指定的版本号
     * @returns {boolean}
     * @example
     AppBridge.isVersionAbove('3.4.1');
     */
    isVersionAbove: function (version) {
        let appVersion = AppBridge.invokeJsBridge('getVersion');
        return Tool.compareVersion(appVersion, version) > 0;
    },

    /**
     * [app版本号是否低于指定的版本]
     * @method isVersionBelow
     * @param {[String]} version 指定的版本号
     * @returns {boolean}
     * @example
     AppBridge.isVersionBelow('3.4.1');
     */
    isVersionBelow: function (version) {
        let appVersion = AppBridge.invokeJsBridge('getVersion');
        return Tool.compareVersion(appVersion, version) < 0;
    },

    /**
     * 规范化Url，在url为相对路径时规范化为绝对路径
     */
    normalizeUrl: Tool.normalizeUrl
};

// 对外提供接口
export default AppBridge;

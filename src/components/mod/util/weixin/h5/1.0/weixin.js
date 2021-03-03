// https://github.com/yanxi-me/weixin-js-sdk
import wx from 'weixin-js-sdk';
import EventModel from '@/model/EventModel';
const WeiXin = {
    wx: wx,
    version: '1.0',
    isReady: (typeof WeixinJSBridge !== 'undefined'),
    isInWeixin () {
        return !!navigator.userAgent.match(/MicroMessenger/);
    },

    // 初始化微信版本
    getVersion () {
        let pattern = /MicroMessenger\/([\d.]+)/i;
        let wc = (navigator.wxuserAgent || navigator.userAgent).match(pattern);
        let version = '';

        version = wc ? wc[1] : (!navigator.wxuserAgent ? -2 : -1);
        this.version = version;
    },

    /**
     * [微信js-sdk 初始化完成后的回调函数]
     * @method ready
     * @param  {[Function]} callback   初始化完成后的回调函数
     * @example
            Weixin.ready(function(){
                //在此调用微信接口，如显示右上角菜单接口、分享等
                Weixin.showOptionMenu();  // 显示右上角菜单接口
            });
     */
    ready (callback) {
        this.wx.ready(() => {
            this.isReady = true;
            this.getVersion();
            if (typeof callback === 'function') {
                callback();
            }
        });
    },
    /**
     * [初始化微信JS-SDK]
     * @method init
     * @param {[Object]} options 选项[必选]
     *    @param  {[Boolean]} options.debug  是否开启调试模式，默认为false
     *    @param  {[String]} options.site  调用接口的站点名，根据该项读取对应获取配置参数的url
     *    @param  {[Array]}  options.jsApiList 需要使用的JS接口列表
     * @example
            var config = {
            debug: true,  //默认为false
            site: 'sale',  //指定sale站点
            jsApiList: [  //需要使用的JS接口列表
                'checkJsApi',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'showOptionMenu'
            ]
        };
        Weixin.init(config);
     */
    init (options) {
        if (this.isInWeixin()) {
            // 获取当前页面除去'#'hash部分的链接
            let url = location.href.split('#')[0];
            this.getWxSign(url, options);
        }
    },

    // 获取微信签名
    async getWxSign (url, options) {
        try {
            const eventModel = new EventModel();
            let hostname = location.hostname;
            // 设置serviceId
            let serviceId = hostname === 'sale.fenqile.com' ? '20' : '110';
            const ret = await eventModel.getWeiXinSign(url, serviceId);
            let data = ret['data']['result_rows'];
            options['appId'] = data.appId;
            options['timestamp'] = data.timestamp;
            options['nonceStr'] = data.nonceStr;
            options['signature'] = data.signature;
            this.config(options);
        } catch (err) {
            Vue.prototype.$toast(err);
        }
    },

    /**
     * [微信JS-SDK 注入权限验证配置]
     * @method config
     * @param {[Object]} options 选项[必选]
     *    @param  {[Boolean]} options.debug  是否开启调试模式
     *    @param  {[String]} options.appId   公众号的唯一标识
     *    @param  {[String]} options.timestamp   生成签名的时间戳
     *    @param  {[String]} options.nonceStr   生成签名的随机串
     *    @param  {[String]} options.signature   签名
     *    @param  {[Array]}  options.jsApiList 需要使用的JS接口列表
     * @example
            var config = {
            debug: true,  //开启调试模式
            appId: $('#appid').val(),  //公众号的唯一标识
            timestamp: $('#timestamp').val(),  //生成签名的时间戳
            nonceStr: $('#noncestr').val(),  //生成签名的随机串
            signature: $('#signature').val(),  //签名
            jsApiList: [  //需要使用的JS接口列表
                'checkJsApi',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'showOptionMenu'
            ]
        };
        Weixin.config(config);
     */
    config (options) {
        this.wx.config(options);
    },

    /**
     * [显示右上角菜单接口]
     * @method showOptionMenu
     * @example
            Weixin.showOptionMenu();  // 显示右上角菜单接口
     */
    showOptionMenu () {
        this.wx.showOptionMenu();
    },

    closeWindow () {
        this.wx.closeWindow();
    },

    /**
     * [获取“分享到朋友圈”按钮点击状态及自定义分享内容接口]
     * @method onMenuShareTimeline
     * @param {[Object]} options 选项[必选]
     *    @param  {[String]} options.imgUrl   分享图片logo地址
     *    @param  {[String]} options.link   分享跳转至目标URL
     *    @param  {[String]} options.title   分享标题  // 分享到朋友圈只显示titel，发送到聊天消息 则title和desc都会显示
     *    @param  {[Function]} options.success   用户确认分享后执行的回调函数
     *    @param  {[Function]} options.cancel   用户取消分享后执行的回调函数
     * @example
            Weixin.onMenuShareTimeline({
                title: '防火防盗防诈骗',  //分享到朋友圈标题
                link: location.href,  //分享跳转至目标URL
                imgUrl: 'http://sale.fenqile.com/res/2015041702/img/logo.jpg',  //分享图片logo地址
                success: function(res) {
                    // alert(JSON.stringify(res));
                }
            });
     */
    onMenuShareTimeline (options) {
        this.wx.onMenuShareTimeline(options);
    },
    /**
     * [获取“分享给朋友”按钮点击状态及自定义分享内容接口]
     * @method onMenuShareAppMessage
     * @param {[Object]} options 选项[必选]
     *    @param  {[String]} options.imgUrl   分享图片logo地址
     *    @param  {[String]} options.link   分享跳转至目标URL
     *    @param  {[String]} options.desc   分享描述
     *    @param  {[String]} options.title   分享标题  // 分享到朋友圈只显示titel，发送到聊天消息 则title和desc都会显示
     *    @param  {[String]} options.type   分享类型,music、video或link，不填默认为link
     *    @param  {[String]} options.dataUrl   如果type是music或video，则要提供数据链接，默认为空
     *    @param  {[Function]} options.success   用户确认分享后执行的回调函数
     *    @param  {[Function]} options.cancel   用户取消分享后执行的回调函数
     * @example
            Weixin.onMenuShareAppMessage({
                title: '防火防盗防诈骗',             // 发送给朋友的消息标题
                desc: '新型诈骗专骗大学生，注意！',  // 发送给朋友的消息描述
                link: location.href,                 // 发送给朋友的消息跳转至目标URL
                imgUrl: 'http://sale.fenqile.com/res/2015041702/img/logo.jpg',                      // 发送给朋友的消息图片logo地址
                success: function() {
                    // 用户确认分享后执行的回调函数
                }
            });
     */
    onMenuShareAppMessage (options) {
        this.wx.onMenuShareAppMessage(options);
    },

    /**
     * [调起微信支付接口]
     * @method weiXinPay
     * @param {[Object]} options 选项[必选]
     *   @param {[Object]} options.data   微信支付的配置参数
     *   @param {[Function]} options.unready  //微信支付未初始化的回调
     *   @param {[Function]} options.unsupport  //微信支付不支持的回调
     *   @param {[Function]} options.success  //微信支付成功的回调
     *   @param {[Function]} options.cancel  //微信支付取消的回调
     *   @param {[Function]} options.error  //微信支付发生错误的回调
     *
     */
    doWeiXinPay (options) {
        // 微信5.0以下版本也会存在WeixinJSBridge,这里取版本号判断
        if (this.getVersion() !== -2 && this.getVersion() < 5) {
            options.unsupport && options.unsupport();
            return;
        }

        if (typeof WeixinJSBridge === 'undefined') {
            options.unready && options.unready();
            return;
        }

        // 参数强制过滤
        let data = {};
        ['appId', 'timeStamp', 'nonceStr', 'package', 'signType', 'paySign'].forEach(item => {
            data[item] = options.data[item] || '';
        });

        WeixinJSBridge.invoke('getBrandWCPayRequest', data, function (res) {
            // get_brand_wcpay_request:cancel 支付过程中用户取消
            // get_brand_wcpay_request:fail 支付失败
            // get_brand_wcpay_request:ok 支付成功
            let msg = res.err_msg;
            if (msg === 'get_brand_wcpay_request:ok') {
                options.success && options.success();
            } else if (msg === 'get_brand_wcpay_request:cancel') {
                options.cancel && options.cancel(msg);
            } else {
                options.error && options.error(msg);
            }
        });
    },
    // 关闭分享到朋友和朋友圈等按钮 在相关页面直接调用Weixin.closeShare();
    closeShare () {
        function onBridgeReady () {
            WeixinJSBridge.call('hideOptionMenu');
        }

        if (typeof WeixinJSBridge === 'undefined') {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
        } else {
            onBridgeReady();
        }
    }
};

export default WeiXin;

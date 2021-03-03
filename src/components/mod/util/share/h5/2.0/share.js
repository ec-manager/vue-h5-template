import WeiXin from '@/mod/util/weixin/h5/1.0/weixin';
import App from '@/mod/util/app/h5/2.0/app.js';
/* 用法 （兼容分享小程序，小程序platform为d，当同时存在4和d时，不能分享小程序，只能分享微信）
 * Share.init({
 *     title: '分享标题',
 *     content: '分享内容',
 *     imgUrl: '分享图片'
 *     friend_title: '朋友圈标题',
 *     link: '分享链接',
 *     platform: '分享平台',
 *     success: function(){}
 * })
 *
 */
const Share = {
    config: {
        debug: false,
        title: '',
        friend_title: '',
        link: location.href,
        imgUrl: '//res.fenqile.com/res/img/global/wx_logo.png',
        content: '',
        platform: '12345678',
        wxUserName: '', // 小程序原始id
        wxPath: '', // 分享进入的页面
        wxImgUrl: '//res.fenqile.com/res/img/global/wx_logo.png', // 小程序分享图，建议为5:4
        wxMiniProgramType: '0', // 小程序版本 0为正式版，2为体验版，1为测试版
        success: function (res) {
            // 分享成功回调函数
        },
        appShareClicked: function () {}
    },
    setShare () {
        // 配置微信js，先config之后，才会触发ready事件
        const config = {
            debug: this.config.debug,
            jsApiList: [
                'checkJsApi',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'showOptionMenu'
            ]
        };
        WeiXin.init(config);
        // 设置微信分享
        WeiXin.ready(() => {
            WeiXin.onMenuShareTimeline({
                title: this.config.title,
                link: this.config.link,
                imgUrl: this.config.imgUrl,
                desc: '',
                success: this.config.success
            });

            WeiXin.onMenuShareAppMessage({
                title: this.config.friend_title || this.config.title,
                desc: this.config.content,
                link: this.config.link,
                imgUrl: this.config.imgUrl,
                success: this.config.success
            });
        });

        // 设置APP分享
        App.jsBridgeReady(() => {
            App.invokeJsBridge('setTitleRightIcon', {
                visible: 1,
                type: 'url',
                content: App.isVersionAbove('4.0.0') ? 'https://cres.fenqile.cn/fenqile_m/img/global/i_sha.png' : 'https://cres.fenqile.com/res/mobile/res/img/app/i_sharef.png',
                onClick: () => {
                    // 调用app的分享
                    App.invokeJsBridge('shareDetails', {
                        platform: this.config.platform,
                        title: this.config.title,
                        titleUrl: this.config.link,
                        content: this.config.content,
                        imgurl: this.config.imgUrl,
                        singleImgUrl: this.config.singleImgUrl,
                        onSuccess: this.config.success,
                        wxUserName: this.config.wxUserName || '', // 小程序原始id
                        wxPath: this.config.wxPath || '', // 分享进入的页面
                        wxImgUrl: this.config.wxImgUrl || '//res.fenqile.com/res/img/global/wx_logo.png', // 小程序分享图，建议为5:4
                        wxMiniProgramType: this.config.wxMiniProgramType || '0' // 小程序版本 0为正式版，2为体验版，1为测试版
                    });
                    this.config.appShareClicked();
                }
            });
        });
    },
    init (params) {
        // 合并对象
        Object.assign(this.config, params);
        this.setShare();
    }
};

export default Share;

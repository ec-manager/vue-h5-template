import App from '@/mod/util/app/h5/1.0/app.js';
import Tool from '@/mod/util/tool/1.0/tool.js';
import WeiXin from '@/mod/util/weixin/h5/1.0/weixin';

const CpsShare = {
    methods: {
        // 获取邀请链接
        getShareLink () {
            return `${location.protocol}//sale.fenqile.com/sales/VlVeRUhdVFhHTVdTX0BJ/index.html?inviterKey=${this.inviterKey}inK`;
        },
        // 邀请
        onShare (e, isReinvite) {
            let hottag = '';

            // 校验登录态
            if (!this.isLogin) {
                this.$login();
                return false;
            }

            if (!this.inviterKey) {
                this.$toast('邀请码为空！');
                return false;
            }

            if (Tool.isInApp()) {
                App.invokeJsBridge('shareDetails', this.getShareParams());
                hottag = 'BTN_INVITE_APP';
            } else if (Tool.isInWeiXin()) {
                this.showWxShareLayer(); // 微信上展示蒙层
                this.setWeixinShare();
                hottag = 'BTN_INVITE_WENXIN';
            } else {
                this.$toast('请到app或微信上分享哦');
                hottag = 'BTN_INVITE_BROWSER';
            }

            // 立即邀请按钮点击流
            hottag && this.$report.initParamsFunc({
                actionType: 2,
                hottag: hottag + (isReinvite ? '_AGAIN' : '')
            });
        },
        // 微信上展示蒙层
        showWxShareLayer () {

        },
        // 微信上分享
        setWeixinShare () {
            // 配置微信js，先config之后，才会触发ready事件
            const config = {
                debug: false, // 默认为false
                site: 'mobile', // 指定sale站点
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
                let shareParams = this.getShareParams();

                WeiXin.onMenuShareTimeline(shareParams);
                WeiXin.onMenuShareAppMessage(shareParams);
            });
        },
        // 获取分享参数
        getShareParams () {
            let _this = this;
            let successCallback = function () {
                _this.$refs.box.show({
                    title: '分享成功',
                    desc: '分享到微信或朋友圈，邀请成功率可高达98%',
                    btnText: '继续分享',
                    textClass: 'gray',
                    btnHandler: () => {
                        _this.$refs.box.close(); // 关闭继续分享弹窗

                        _this.onShare({}, 1);
                    },
                    closeHandler: () => {
                        // 继续分享弹窗关闭按钮点击流
                        _this.$report.initParamsFunc({
                            actionType: 2,
                            hottag: 'BTN_CLOSE_SHARE_SUCCESS_BOX'
                        });
                    }
                });

                // 继续分享弹窗曝光
                _this.$report.initParamsFunc({
                    hottag: 'SHARE_SUCCESS_BOX'
                });
            };

            let shareLink = this.getShareLink(); // 加inK字符便于落地页解析邀请码
            let shareDesc = this.baseInfo['share_desc'] ? this.baseInfo['share_desc'] : document.title;
            let shareParams = {
                title: this.baseInfo['share_title'] ? this.baseInfo['share_title'] : document.title,
                titleUrl: shareLink, // APP用
                link: shareLink, // 微信H5用
                content: shareDesc, // APP用
                desc: shareDesc, // 微信H5用
                tip: this.descInfo && this.descInfo.share_tips ? this.descInfo.share_tips : '',
                imgurl: this.baseInfo['share_img'] ? this.baseInfo['share_img'] : '',
                platform: '4',
                onSuccess: successCallback, // APP用
                success: successCallback // 微信H5用
            };
            return shareParams;
        }
    },
    created () {
        if (Tool.isInApp()) {
            // 这个会导致在页面设置的setTitleRightIcon不生效，如果需要引入这个文件，可以在自己页面中做隐藏处理
            // App.invokeJsBridge('setTitleRightIcon', {visible: false}); // 隐藏右上角分享
        }
    }
};
export default CpsShare;

import CpsShare from '@/mixins/cpsShare/1.0/cpsShare.js'; // 分享逻辑
import Tool from '@/mod/util/tool/1.0/tool.js';
import App from '@/mod/util/app/h5/2.0/app.js';
import SaleModel from '../../model/SaleModel.js';

const saleModel = new SaleModel();

export default {
    name: 'my-friend',
    mixins: [CpsShare],
    props: {
        countInfo: {},
        inviterKey: {},
        isShowCountInfo: false,
        config: {},
        taskInfo: {},
        isLogin: {},
        headHeight: {},
        baseInfo: {}
    },
    data () {
        return {
            tool: Tool,
            isInApp: Tool.isInApp(),
            isShowWxShareLayer: false, // 是否展示非app环境的分享蒙层
            headerConfig: {},
            imgSrc: {
                shareBtnGif: `${location.protocol}//cimg1.fenqile.com/product5/M00/1C/13/MNEHAF-S3b-AJjoiAAC8sgcXA78702.gif`, // 分享微信按钮gif
                inviteBtnGif: `${location.protocol}//cimg1.fenqile.com/product5/M00/1C/13/MNEHAF-S3dmARCHwAADKWqOrnAc651.gif`, // 邀请好友按钮gif
                defaultPhoto: `${location.protocol}//cimg1.fenqile.com/product5/M00/8A/77/MdEHAF9qreiANcr7AAA0cxTv-jI388.png`,
                tipsFloorBg: `${location.protocol}//cimg1.fenqile.com/product5/M00/89/94/MtEHAF9jHoyAaYFRAATMrI6fa2M685.png`,
                shareLayer: `${location.protocol}//cimg1.fenqile.com/product5/M00/5A/48/MdEHAF6qLUyAKwwiAADURBy5Df8365.png`,
                closeIcon: `${location.protocol}//cimg1.fenqile.com/product5/M00/89/27/MtEHAF9gfUuAWUaSAAACKMPURQc889.png`,
                shareBtnImg: `${location.protocol}//cimg1.fenqile.com/product5/M00/8A/AF/MtEHAF9sCS2AQdv_AACKjWvGvfA296.gif`,
                notReceiveBg: `${location.protocol}//cimg1.fenqile.com/product5/M00/22/DF/MtEHAF-YGSqAe4vMAADFecoyeq0430.png`,
                receivedBg: `${location.protocol}//cimg1.fenqile.com/product5/M00/22/DE/MtEHAF-YF1KADDmMAABxtWl_rYk852.png`,
                receiveGif: `${location.protocol}//cimg1.fenqile.com/product5/M00/1A/38/MNEHAF-Oo-iAfmwVAAt7mUi3GcE670.gif`,
                countInfoBg: `${location.protocol}//cimg1.fenqile.com/product5/M00/22/E0/MtEHAF-YG4eAAJXeAAB3LMvP53s708.png`,
                topTitleImg: `${location.protocol}//cimg1.fenqile.com/product5/M00/1A/40/MNEHAF-Ots2AUANBAAAlTFqbMI0233.png`
            },
            showHead: false,
            isShowRule: false,
            isShowReceiveGif: false, // 是否展示领取红包动效
            taskStatusConfig: {
                notReceive: 1, // 未领取红包
                received: 2, // 已领取红包
                other: 3 // 其他
            }
        };
    },

    computed: {
        // 步骤说明文案
        stepInfo () {
            return this.config.step_info || {};
        },
        // 指南说明
        tipsFloor () {
            return this.config.tips_floor || {};
        },
        // 描述说明
        descInfo () {
            return this.config.desc_info || {};
        },
        // 客服说明
        serviceFloor () {
            return this.config.service_floor || {};
        },
        // 底部按钮
        bottomBtn () {
            return this.config.bottom_btn || {};
        }
    },

    methods: {
        // 微信上展示蒙层
        showWxShareLayer () {
            this.isShowWxShareLayer = true;
        },
        // 复制微信
        setClipBoard (text) {
            if (this.isInApp) {
                App.invokeJsBridge('setClipBoard', {
                    text: text,
                    onReturn: () => {
                        this.$toast('复制成功！');
                        window.location.href = 'weixin://';
                    }
                });
            }
        },
        // 开红包
        async receiveBonus () {
            // 校验登录态
            if (!this.isLogin) {
                this.$login();
                return false;
            }

            if (!this.taskInfo.task_id) {
                this.$toast('任务id为空！');
                return false;
            }

            try {
                let res = await saleModel.receiveBonus(this.taskInfo.task_id);

                if (parseInt(res.result) === 0) {
                    this.isShowReceiveGif = true; // 领取成功展示开红包动效
                    setTimeout(() => {
                        this.isShowReceiveGif = false; // 关闭gif图
                        this.taskInfo.task_status = this.taskStatusConfig.received; // 已领取
                    }, 2000);
                } else {
                    this.$toast(res.retmsg);
                }
            } catch (err) {
                this.$toast(err);
            }
        }
    }
};

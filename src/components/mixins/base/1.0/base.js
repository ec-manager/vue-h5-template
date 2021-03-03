/**
 * @name [活动基类]
 * @author [beginning]
 * @description [默认所有活动都继承这个基类]
 * @modiyfied 增加复购二期浏览类
 * @class Base
 */
import EventModel from '@/model/EventModel';
import ProductModel from '@/model/ProductModel';
import TaobaoGrantModel from '@/model/TaobaoGrantModel';
import RebuyModel from '@/model/RebuyModel';
import Share from '@/mod/util/share/h5/1.0/share';
import Url from '@/mod/util/url/h5/1.0/url.js';
import Tool from '@/mod/util/tool/1.0/tool.js';

const G_BASE_SOURCE = Url.get('source') || 2; // 来源，默认分期乐
const G_BASE_DEVICE_TYPE = 2; // 设备类型 1：IOS 2:安卓&H5,因活动页就是H5页面所以写死为2
const Base = {
    filters: {
        // 市场价取整
        toInt (value) {
            return ~~value;
        }
    },

    computed: {
        // 活动基础信息
        baseInfo () {
            return window.G_BASE_INFO || {
                event_id: 'EVE202009222535989'
            };
        },

        // 活动配置信息
        eventConfig () {
            return this.configData;
        },

        // 活动ID
        eventId () {
            if (this.baseInfo['event_id']) {
                return this.baseInfo['event_id'];
            } else {
                let pageId = parseInt(Url.get('pageId', location.href), 10) || '';
                // 获取活动ID
                let match = location.pathname.match(/\d{15}/g);
                return pageId ? `EVE${pageId}` : `EVE${match[0]}`;
            }
        },

        // 返回所有板块下sku的数量
        getSkuNum () {
            let skuNum = {};
            this.plateList.forEach(item => {
                skuNum[item.plateId] = item.skuNum;
            });
            return skuNum;
        }
    },

    data () {
        return {
            // 是否登录
            isLogin: false,
            // 板块列表
            plateList: [],
            // 默认分享图片
            defaultShareImg: 'https://res.fenqile.com/res/img/global/wx_logo.png',
            // 配置数据
            configData: {}
        };
    },
    methods: {
        // 获取活动配置信息
        async handleGetEventConfig () {
            try {
                let eventModel = new EventModel();
                console.log(eventModel);
                let ret = await eventModel.getEventConfig(this.eventId);
                console.log(ret);
                let data = ret['data']['result_rows']['data'];
                if (data) {
                    this.configData = JSON.parse(ret['data']['result_rows']['data'])['config'];
                } else {
                    // 开发环境下获取配置
                    if (process.env.NODE_ENV === 'development') {
                        this.getOmsConfig(this.eventId);
                    }
                }
                this.configCallback(); // 获取配置后的回调
            } catch (err) {
                this.$toast(err);
            }
        },

        // 获取配置后的回调
        configCallback () {

        },

        // 获取登录状态
        async getLoginStatus () {
            // 实例化模型类
            const eventModel = new EventModel();
            // 发送请求
            let res = await eventModel.getIsLogin();
            if (parseInt(res.retcode) === 0) {
                this.isLogin = !!res['is_login'];
                let node = document.getElementById('is_login');
                if (node) {
                    node.value = res['is_login'];
                }
                if (this.isLogin) {
                    this.loginCallback();
                }
            } else {
                this.$toast(res.retmsg);
            }
        },

        // 获取登录状态gateway接口（2020新）
        async getCheckLogin () {
            try {
                // 实例化模型类
                let eventModel = new EventModel();
                let ret = await eventModel.getCheckLogin();
                let isLogin = ret['data']['is_login'];
                this.isLogin = !!isLogin;
                let node = document.getElementById('is_login');

                // 登录状态写进隐藏域
                if (node) {
                    node.value = isLogin; 
                }
                // 登录成功回调
                if (this.isLogin) {
                    this.loginCallback();
                } else {
                    this.unloginCallback();
                }
            } catch (err) {
                this.$toast(err);
            }
        },

        // 有登陆态的请求回调
        loginCallback () {

        },
        // 没有登录态的请求回调
        unloginCallback () {

        },

        // 处理分享链接
        handleShareLink (href = location.href, agent) {
            if (agent) {
                href = Url.set('agent', agent, href);
            }
            href = Url.append('fqlshare', 1, href);
            return this.$href(href, false);
        },

        // 分享成功后数据上报
        handleShareSuccess (hottag = 'BTN_SHARE_SUCCESS') {
            if (this.$report) {
                this.$report.initParamsFunc({
                    onlyReportEcr: 1,
                    hottag: hottag,
                    actionType: 10
                });
            }
        },

        // 初始化分享
        initShare (config = {}) {
            let shareInfo = Object.assign({}, this.baseInfo, config);
            Share.init({
                title: shareInfo['share_title'] ? shareInfo['share_title'] : document.title,
                content: shareInfo['share_desc'] ? shareInfo['share_desc'] : document.title,
                imgUrl: shareInfo['share_img'] ? shareInfo['share_img'] : this.defaultShareImg,
                friend_title: shareInfo['share_title'] ? shareInfo['share_title'] : document.title,
                link: this.handleShareLink(shareInfo['share_link'], shareInfo['share_dtag']),
                platform: '12345678',
                success: () => {
                    // 分享成功后，数据上报
                    this.handleShareSuccess();
                }
            });
        },

        // 判断活动是否过期或者未开始
        isOver () {
            let time = new Date().getTime();
            if (this.baseInfo['begin_time'] && this.baseInfo['end_time']) {
                let beginTime = new Date(this.baseInfo['begin_time']).getTime();
                let endTime = new Date(this.baseInfo['end_time']).getTime();
                // 活动未开始
                if (time < beginTime) {
                    this.$shade('该活动暂未开始，感谢您的关注。', {
                        text: '更多精彩活动',
                        link: '//m.fenqile.com'
                    });
                }
                // 活动已经结束
                if (time > endTime) {
                    this.$shade('该活动已过期，感谢您的关注。', {
                        text: '更多精彩活动',
                        link: '//m.fenqile.com'
                    });
                }
            }
        },

        // 图片懒加载曝光
        dataReport () {
            this.$nextTick(function () {
                let oldSrc = '';
                this.$Lazyload.$on('loaded', ({ el, src }) => {
                    if (oldSrc !== src) {
                        oldSrc = src;
                        let hottag = el.dataset ? el.dataset.stat : '';
                        if (hottag) {
                            this.$report.initParamsFunc({
                                onlyReportEcr: 1,
                                hottag: hottag
                            });
                        }
                    }
                });
            });
        },

        // 获取板块列表
        async handleGetPlateList () {
            try {
                const productModel = new ProductModel();
                let ret = await productModel.getPlateList(this.eventId);
                this.plateList = ret['data']['result_rows']['plateList'] || [];
            } catch (err) {
                this.$toast(err);
            }
        },

        // 获取活动配置
        async getOmsConfig (id) {
            // 实例化模型类
            const eventModel = new EventModel();
            // 发送请求
            let res = await eventModel.getOmsConfig(id.slice(3));
            if (parseInt(res.retcode) === 0) {
                this.configData = res['result_rows']['config'];
            } else {
                this.$toast(res.retmsg);
            }
        },
        // 复购激活任务
        async activeUserJob (jobId, typeList) {
            try {
                // 实例化模型类
                let rebuyModel = new RebuyModel();
                let ret = await rebuyModel.activeUserJob(jobId, typeList);
                let res = ret['data'];
                if (+res.result === 0) {
                    const result = res['result_rows'];
                    if (result['jobTime']) {
                        let time = result['jobTime'].replace('S', '') * 1000;
                        let status = result['status'];
                        if (status && +status === 30) {
                            // 进行中的才做任务
                            const userJobId = result['userJobId'];
                            setTimeout(() => {
                                this.finishUserJob(userJobId);
                            }, time);
                        }
                    } else {
                        console.log('该活动没有浏览任务');
                    }
                }
            } catch (err) {
                console.log(err);
                if (err.indexOf('37021421') > -1) {
                    this.$toast('奖励已被领完啦，快去解锁其他任务吧!');
                } else {
                    this.$toast(err);
                }
            }
        },
        // 复购完成任务
        async finishUserJob (userJobId) {
            try {
                // 实例化模型类
                let rebuyModel = new RebuyModel();
                let ret = await rebuyModel.finishUserJob(userJobId);
                let res = ret['data'];
                if (+res.result === 0) {
                    this.$toast('任务完成');
                }
            } catch (err) {
                this.$toast(err);
            }
        },
        // 淘宝授权回调接口
        async grantCallback (code, source, callBack) {
            try {
                let res = await TaobaoGrantModel.grantCallback(code, source, callBack);
                // 授权完成后，跳转至对应页面
                if (+res.data.result === 0) {
                    callBack && callBack();
                }
            } catch (err) {
                this.$toast(err);
            }
        },
        // 渠道推广链接
        async getPromotionUrl (param, callBack) {
            try {
                if (Tool.isObject(param)) {
                    let options = Object.assign({
                        source: G_BASE_SOURCE,
                        device_type: G_BASE_DEVICE_TYPE
                    }, param);

                    let res = await TaobaoGrantModel.getPromotionUrl(options);
                    // 授权完成后，跳转至对应页面
                    if (+res.data.result === 0) {
                        let ret = res.data.result_rows[0] || {};
                        if (callBack) {
                            // 成功的回调方法
                            callBack(ret);
                        } else {
                            // 默认获取到推广链接后跳转至第三方活动列表
                            ret.click_url && this.$open(ret.click_url);
                        }
                    }
                }
            } catch (err) {
                this.$toast(err);
            }
        },
        // 用户淘宝授权信息查询, 因为deviceType可以不传，所以参数放在后面
        async tbAuthBindInfo (callBack, deviceType) {
            try {
                let res = await TaobaoGrantModel.tbAuthBindInfo(deviceType || G_BASE_DEVICE_TYPE);
                // 用户淘宝授权信息查询
                if (+res.data.result === 0) {
                    let ret = res.data.result_rows || {};
                    callBack && callBack(ret);
                }
            } catch (err) {
                this.$toast(err);
            }
        },
        /**
         * 手动上报点击事件
         * @param {String} hottag 点击流字段
         * @param {String} skuId 电商相关 sku_id
         * @param {Number} actionType 行为类型（非电商业务关注1和2即可） 1-曝光 ，2-点击，3-观看（阅读），4-购买，5-拉入购物车，6-收藏，7-点赞，8-评论
         */
        setDataReport (hottag = '', skuId = '', actionType = 2) {
            // 手动上报
            this.$report.initParamsFunc({
                onlyReportEcr: 1,
                actionType: actionType,
                hottag: hottag,
                skuId: skuId
            });
        },
        /**
         * 链接跳转支持上报
         * @param {String} url 跳转链接
         * @param {String} stat 上报hottag
         * @param {*} isLoadOnCurPage isLoadOnCurPage表示是否在当前页打开新页面，默认为0
         */
        linkToUrl (url, stat, isLoadOnCurPage = 0) {
            if (!url) {
                return;
            }
            // 如果有stat，则进行数据上报
            if (stat) {
                this.setDataReport(stat);
            }
            // isLoadOnCurPage表示是否在当前页打开新页面，默认为0
            this.$open(url, isLoadOnCurPage);
        }
    },

    created () {
        const rebuyJobid = Url.get('rebuy_jid', location.href);
        if (rebuyJobid) {
            this.activeUserJob(rebuyJobid, 1);
        }
        this.handleGetEventConfig();

        this.initShare();
        // 旧的请求登录接口代码，暂时保留过渡
        // this.getLoginStatus();
        this.getCheckLogin();
        if (process.env.NODE_ENV === 'production') {
            this.isOver();
        }
        this.handleGetPlateList();
    },

    mounted () {
        if (process.env.NODE_ENV === 'production') {
            this.dataReport();
        }
    }
};

export default Base;

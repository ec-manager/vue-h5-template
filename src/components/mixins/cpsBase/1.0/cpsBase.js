/**
 * @name [CPS基类]
 * @author [denyszhou]
 * @description [CPS活动基类]
 * @class CpsBase
 */
import Base from '@/mixins/base/1.0/base.js';
import TaobaoGrantModel from '@/model/TbGrantModel';
import Tool from '@/mod/util/tool/1.0/tool.js';
import AppBridge from '@/mod/util/app/h5/2.1/app';
import Url from '@/mod/util/url/h5/1.0/url.js';
// 渠道配置
const Channel = {
    jd: 1,
    tb: 2,
    pdd: 3,
    wph: 5
};
// 来源：1：淘物星球，2：分期乐 默认分期乐
const G_SOURCE = Url.get('source') || 2;
// 淘宝授权信息Promise
var TbAuthPromise = '';

const CpsBase = {
    extends: Base,
    computed: {
        // 授权重定向落地页
        authRedirectUrl () {
            if (Tool.isInApp()) {
                return encodeURIComponent('https://sale.fenqile.com/sales/VlVeRUlUV15HTVBTWUVO/index.html');
            } else {
                // 多次encode防止淘宝decode丢失参数
                return encodeURIComponent((`https://sale.fenqile.com/sales/VlVeRUlUV15HTVBTWUVO/index.html?back_uri=${encodeURIComponent(encodeURIComponent(location.href))}`));
            }
        },
        // 淘宝授权链接
        tbAuthUrl () {
            let {appKey} = this.tb;
            // 若appkey已经返回则直接跳转
            if (appKey) {
                return `https://oauth.taobao.com/authorize?response_type=code&client_id=${appKey}&redirect_uri=${this.authRedirectUrl}&state=fql_cps&view=wap`;
            } else { // 未返回则重置为空
                return '';
            }
        }
    },

    data () {
        return {
            pdd: {
                isInstall: false
            },
            // 京东渠道内容
            jd: {
                isInstall: false
            },
            // 淘宝渠道内容
            tb: {
                // 是否跳出淘宝授权流程
                isGoTbAuth: false,
                // 是否已经授权
                isAuth: false,
                // 是否安装淘宝app
                isInstall: false,
                // 淘宝appkey
                appKey: '',
                // 待跳转的缓存参数
                // 可能值 url, active_id
                activeCache: []
            },
            // 唯品会
            wph: {
                isInstall: false
            }
        };
    },
    methods: {

        // 校验缓存内是否存在活动参数并跳转
        checkChannelActive () {
            let {tb} = this;
            // 获取淘宝活动参数
            let activeOptions = tb.activeCache.pop();
            // 是否存在淘宝活动
            activeOptions && this.linkToTaobao(activeOptions);
            // 不允许存在多条缓存
            this.clearActiveCache();
            // if( pdd.theme_id...)
        },

        // 设置缓存参数
        pushActiveCache (activeOptions = '') {
            let {tb} = this;
            // 存储活动参数
            activeOptions && tb.activeCache.push(activeOptions);
        },

        // 清除跳转缓存
        clearActiveCache () {
            let {tb} = this;
            // 清除缓存
            tb.activeCache = [];
        },

        // 获取各渠道最终的跳转链接
        getChannelJumpUrl (channel = '', data = {}) {
            // 初始化跳转
            let jumpUrl = '';
            // 判断渠道
            switch (channel) {
            // 淘宝渠道 && 京东渠道
                case Channel.tb:
                case Channel.jd: 
                    jumpUrl = data.click_url || '';
                    break;
                    // 拼多多渠道，已安装pdd情况取mobile_url，未安装或者h5走click_url减少h5重定向次数
                case Channel.pdd:
                    jumpUrl = this.pdd.isInstall ? (data.mobile_url || '') : (data.click_url || '');
                    break;
                case Channel.wph:
                    jumpUrl = this.wph.isInstall ? (data.mobile_url || '') : (data.click_url || '');
                    break;
                default:
                    // do
            }
            return jumpUrl;
        },
        
        // 跳转至拼多多
        async linkToPdd (options = {}, controll = {}) {
            let {needCallback = false} = controll;
            // 未登录需要先登录
            if (!this.isLogin) {
                this.$login();
                return;
            }

            try {
                // 查询促销url
                let ret = await this.getPromotionUrl({
                    channel: Channel.pdd,
                    ...options
                });

                let linkToCallback = () => {
                    // 获取跳转链接
                    let jumpUrl = this.getChannelJumpUrl(Channel.pdd, ret);
                    // 安装拼多多
                    if (this.pdd.isInstall) {
                        // 添加iframe打开拼多多
                        let iframe = document.createElement('iframe');
                        iframe.src = jumpUrl;
                        iframe.style.display = 'none';
                        document.body.append(iframe);
                    } else { // 未安装或h5流程跳转h5
                        this.$open(jumpUrl);
                    }
                };
                // 若需要回调则传出
                if (needCallback) {
                    return linkToCallback;
                } else {
                    linkToCallback();
                }
            } catch (err) { // 接口抛错不做处理
                this.$toast(err);
            }
        },

        // 跳转至jd
        async linkToJD (options = {}, controll = {}) {
            let {needCallback = false} = controll;
            // 未登录需要先登录
            if (!this.isLogin) {
                this.$login();
                return;
            }

            try {
                // 查询促销url
                let ret = await this.getPromotionUrl({
                    channel: Channel.jd,
                    ...options
                });
                let linkToCallback = () => {
                    // 跳转链接
                    let jumpUrl = this.getChannelJumpUrl(Channel.jd, ret);
                    // app内调用api 安卓体验较差，暂不唤起
                    if (Tool.isInApp() && AppBridge.invokeJsBridge('isIos')) {
                        try {
                            AppBridge.invokeJsBridge('openJDMobile', {
                                url: jumpUrl,
                                onReturn: (res) => {
                                    // 若跳转京东失败
                                    // 未安装京东 或 打开异常
                                    if (!res || parseInt(res.retcode) !== 0) { 
                                        // h5打开
                                        this.$open(jumpUrl);
                                    }
                                }
                            });
                        } catch (err) {
                            // app版本过低h5打开
                            this.$open(jumpUrl);
                        }
                    } else { // h5流程打开
                        this.$open(jumpUrl);
                    }
                };
                // 若需要回调则传出
                if (needCallback) {
                    return linkToCallback;
                } else {
                    linkToCallback();
                }
            } catch (err) { // 接口抛错不做处理
                this.$toast(err);
            }
        },

        // 跳转至唯品会
        async linkToWph (options = {}, controll = {}) {
            let {needCallback = false} = controll;
            // 未登录需要先登录
            if (!this.isLogin) {
                this.$login();
                return;
            }

            try {
                // 查询促销url
                let ret = await this.getPromotionUrl({
                    channel: Channel.wph,
                    ...options
                });
                let linkToCallback = () => {
                    // 跳转链接
                    let jumpUrl = this.getChannelJumpUrl(Channel.wph, ret);
                    if (this.wph.isInstall) {
                        // 添加iframe打开唯品会
                        let iframe = document.createElement('iframe');
                        iframe.src = jumpUrl;
                        iframe.style.display = 'none';
                        document.body.append(iframe);
                    } else { // 未安装或h5流程跳转h5
                        this.$open(jumpUrl);
                    }
                };
                // 若需要回调则传出
                if (needCallback) {
                    return linkToCallback;
                } else {
                    linkToCallback();
                }
            } catch (err) { // 接口抛错不做处理
                this.$toast(err);
            }
        },
        // 跳转至淘宝 优先取url
        // options.url       跳转链接
        // options.active_id  活动id
        async linkToTaobao (options = {}, controll = {}) {
            let {needCallback = false} = controll;
            // 未登录需要先登录
            if (!this.isLogin) {
                this.$login();
                return;
            }

            // 若已经授权 查询促销url
            if (this.tb.isAuth) {
                try {
                    // 查询促销url
                    let ret = await this.getPromotionUrl({
                        channel: Channel.tb,
                        ...options
                    });
                    let linkToCallback = () => {
                        // 跳转链接
                        let jumpUrl = this.getChannelJumpUrl(Channel.tb, ret);
                        // 已安装
                        if (this.tb.isInstall) {
                            try {
                                AppBridge.invokeJsBridge('doAlibcTradeOpenUrl', {
                                    url: jumpUrl,
                                    onReturn: () => {
                                        // console.log(res);
                                    }
                                });
                            } catch (err) {
                                // 版本过低h5打开
                                this.$open(jumpUrl);
                            }
                        } else {
                            // 未安装h5打开
                            this.$open(jumpUrl);
                        }
                    };
                    // 若需要回调则传出
                    if (needCallback) {
                        return linkToCallback;
                    } else {
                        linkToCallback();
                    }
                } catch (err) { // 接口抛错不做处理
                    this.$toast(err);
                }
            } else { // 若未授权
                let {tbAuthUrl, tb} = this;
                // 若链接还未获取完整 || 为缓存跳转
                // 若当前为跳出后返回，若还未授权，则无需跳转
                if (!tbAuthUrl || tb.isGoTbAuth) {
                    // 手动清除缓存
                    this.clearActiveCache();
                    return;
                }
                // 若存在活动参数，跳转前缓存
                this.pushActiveCache(options);
                // 已安装淘宝 跳转淘宝授权
                if (tb.isInstall) {
                    try {
                        // 登录
                        AppBridge.invokeJsBridge('getAliAuthLogin', {
                            onReturn: (data) => {
                                // 若登录授权成功 则使用百川唤起授权链接
                                if (parseInt(data.retcode) === 0) {
                                    // 这里安卓上执行比viewAppear更早，会导致执行viewAppear时候，先重置了isGoTbAuth再执行viewAppear，用settimeout延迟执行
                                    // 设置为跳出授权 登录完成回调时有一次viewAppear
                                    setTimeout(() => {
                                        tb.isGoTbAuth = true;
                                    }, 200);
                                    AppBridge.invokeJsBridge('doAlibcTradeOpenUrl', {
                                        url: tbAuthUrl,
                                        onReturn: () => {
                                            // res.code为非0则联盟授权失败，[用户主动取消，授权报错等] 暂无需处理
                                        }
                                    });
                                }
                                // 授权失败下次点击继续授权无需处理
                            }
                        });
                    } catch (err) { // 调用时低版本报错，使用h5授权
                        // 设置为跳出授权
                        tb.isGoTbAuth = true;
                        // h5授权
                        this.$open(tbAuthUrl);
                    }
                } else { // 未安装淘宝 跳转h5授权
                    // 设置为跳出授权
                    tb.isGoTbAuth = true;
                    this.$open(tbAuthUrl);
                }
            }
        },

        // 获取渠道推广链接 存在活动id时需要进行转链，url转化格式为click_url返回
        // options.url       跳转链接
        // options.active_id  活动id
        async getPromotionUrl (options) {
            try {
                if (Tool.isObject(options)) {
                    // 存在url直接返回
                    if (options.url) {
                        return {click_url: options.url};
                    } else {
                        let res = await TaobaoGrantModel.getPromotionUrl(options);
                        // 获取链接
                        if (+res.data.result === 0) {
                            let ret = res.data.result_rows[0] || {};
                            return ret;
                        } else {
                            return '';
                        }
                    }
                } else {
                    return '';
                }
            } catch (err) {
                return '';
            }
        },

        // 用户淘宝授权信息查询
        getTbAuth () {
            return TbAuthPromise || (TbAuthPromise = new Promise(async (resolve, reject) => {
                try {
                    let res = await TaobaoGrantModel.tbAuthBindInfo();
                    // 用户淘宝授权信息查询
                    if (+res.data.result === 0) {
                        let ret = res.data.result_rows || {};
                        this.tb.appKey = ret.tb_app_key || ''; // 淘宝appKey，授权时需要
                        this.tb.isAuth = parseInt(ret.is_tb_grant) === 1; // 是否已授权淘宝，目前仅限淘宝
                        // 对外兼容返回授权信息
                        resolve(ret);
                    } else { // http模块已处理 result 为非0，catch捕获
                        // 若返回异常重置Promise，允许重试
                        TbAuthPromise = '';
                        reject(new Error('授权失败'));
                    }
                } catch (err) {
                    // 若返回异常重置Promise，允许重试
                    TbAuthPromise = '';
                    // 异常抛出
                    reject(err);
                }
            }));
        },

        // 校验是否安装app
        initInstalledCpsApp () {
            AppBridge.jsBridgeReady(() => {
                AppBridge.invokeJsBridge('isAppInstalled', {
                    schemeName: 'taobao',
                    packageName: 'com.taobao.taobao',
                    onReturn: (data) => {
                        this.tb.isInstall = parseInt(data.isInstalled) === 1;
                        // 检查pdd是否安装
                        // 需要串行执行isAppInstalled，否则bridge函数回调会有时序问题
                        setTimeout(() => {
                            AppBridge.invokeJsBridge('isAppInstalled', {
                                schemeName: 'pinduoduo',
                                packageName: 'com.xunmeng.pinduoduo',
                                onReturn: (pdd_data) => {
                                    this.pdd.isInstall = parseInt(pdd_data.isInstalled) === 1;
                                    setTimeout(() => {
                                        AppBridge.invokeJsBridge('isAppInstalled', {
                                            schemeName: 'vipshop',
                                            packageName: 'com.achievo.vipshop',
                                            onReturn: (wph_data) => {
                                                this.wph.isInstall = parseInt(wph_data.isInstalled) === 1;
                                            }
                                        });
                                    }, 200);
                                }
                            });
                        }, 200);
                    }
                });
            });
        },

        // 初始化绑定事件
        initEvent () {
            // 回到页面需要重新查询淘宝授权状态
            if (Tool.isInApp()) {
                AppBridge.jsBridgeReady(() => {
                    // 再次回到页面时，重新获取是否已授权淘宝
                    AppBridge.invokeJsBridge('setPageStatusCallback', {
                        resumeCallback: async () => {
                            // 如果已登录
                            if (this.isLogin && this.tb.isGoTbAuth) {
                                // 重置Promise，允许重试
                                TbAuthPromise = '';
                                try {
                                    // 重新获取授权信息
                                    await this.getTbAuth();
                                    // 重新查询，失败不处理
                                    this.checkChannelActive();
                                    // 重置标记位
                                    this.tb.isGoTbAuth = false;
                                } catch (err) {
                                    // 查询授权失败重置标记位;
                                    // 重置标记位
                                    this.tb.isGoTbAuth = false;
                                }
                            } else { // 返回都需要重新查询授权
                                // 重置Prosmise，允许重试
                                TbAuthPromise = '';
                                // 重新获取授权信息
                                await this.getTbAuth();
                            }
                        }
                    });
                });
            }
        },

        /**
         * 跳转到Cps商品详情页面
         * @param {String|Number} channelId 渠道id 1 京东 2 淘宝 3 拼多多
         * @param {Object} sku 当前点击的商品的对象信息，如果是淘宝商品则需包含请求淘宝缓存接口需要的参数
         */
        getProductDetailUrl (channelId, sku) {
            let categoryId = sku.category_id || '';
            let channel = sku.channel || channelId || ''; // 如果接口中有返回channel，则取接口中的，否则取参数传递的
            // 跳转的链接
            let url = `//item.m.fenqile.com/cps/product.html?sku_id=${sku.sku_id}&cps=${channel}&source=${G_SOURCE}&category_id=${categoryId}`;

            // 淘宝跳转商详进行特殊处理
            if (Number(channel) === Channel.tb) {
                let params = {
                    sku_id: sku.sku_id,
                    product_desc: sku.product_desc,
                    has_coupon: sku.has_coupon,
                    coupon_info: sku.coupon_info,
                    sale_num: sku.sale_num,
                    commission_rate: sku.commission_rate,
                    commission_amount: sku.commission_amount,
                    user_rebate: sku.user_rebate,
                    taobao_coupon_url: sku.taobao_coupon_url || ''
                };
                TaobaoGrantModel.taobaoSkuInfoCache(params)
                    .then(res => {
                        let ret = res.data || {};
                        if (+ret.result === 0) {
                            this.$href(url);
                        }
                    }).catch(err => {
                        console.log(err);
                    });
            } else {
                this.$href(url);
            }
        }
    },

    created () {
        console.log('tetestes');
        // 初始化app安装状态
        this.initInstalledCpsApp();
        // 初始化事件
        this.initEvent();
        // 获取淘宝授权
        this.getTbAuth();
    }
};

export default CpsBase;

import CpsBase from '@/mixins/CpsBase/1.0/CpsBase.js';
import Tool from '@/mod/util/tool/1.0/tool.js';
import Url from '@/mod/util/url/h5/1.0/url.js';
import Tab from '@/mod/render/tab/h5/1.0/index.vue';
import CpsProductModel from './model/CpsProductModel.js';
import SaleModel from './model/SaleModel.js';
import App from '@/mod/util/app/h5/2.1/app.js';
import ActivityProduct from './components/activityProduct/index.vue';
import ImmersiveHeader from '@/mod/render/header/h5/1.2/index.vue';
import RulesModal from './components/rulesModal/index.vue';
import RecommendProduct from '@/mod/render/recommendProduct/h5/2.0/index.vue'; // 商品列表
import CpsJumpModal from '@/mod/render/cpsJumpModal/h5/1.0/index.vue';
import GoTop from '@/mod/render/gotop/h5/1.0/index.vue';
import MyFriend from './components/myFriend/index.vue';
import Notice from '@/mod/render/notice/h5/1.0/index.vue';
import SharePop from '@/mod/render/sharePop/h5/1.0/index.vue';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import Floating from '@/mod/render/floating/h5/1.0/index.vue';
import countTo from 'vue-count-to';

const saleModel = new SaleModel();

const G_SOURCE = Url.get('source') || 2; // 来源，默认分期乐
const G_FOOT_INDEX = Url.get('tab') || 0; // 获取底部tab的当前值
const G_JUMP_TYPE = Url.get('jump') || 0; // 需要跳转至某个地方 1 表示跳转至推荐
const G_AC_INDEX_PRE = 'act_'; // 活动索引前缀
const G_DEVICE_TYPE = Tool.isAppIos() ? 1 : 2; // 【设备类型：1 ios 2 android】 现后台逻辑，h5及安卓都为安卓
const G_DEVICE_TIME = new Date().getTime(); // 设备当前时间

let CPS_PRODUCT_LIST_CACHE = {}; // 商品信息缓存列表
let CPS_SCROLL_TOP_CACHE = {}; // 每个列表的scrollTop缓存

const CARD_TYPE = {
    credit: 1, // 额度卡
    take_out: 2 // 外卖卡
};
// 渠道
const G_CHANNEL = {
    'jd': 1,
    'tb': 2,
    'pdd': 3,
    'wph': 5
};
export default {
    name: 'page_h5_202009222535989',
    // 继承
    extends: CpsBase,
    components: {
        ImmersiveHeader,
        RulesModal,
        Tab,
        ActivityProduct,
        GoTop,
        MyFriend,
        CpsJumpModal,
        Notice,
        SharePop,
        RecommendProduct,
        swiper,
        swiperSlide,
        Floating,
        countTo,
        CpsIndex: () => import('./components/cpsIndex/index.vue')
    },

    data () {
        return {
            tool: Tool,
            imgSrc: {
                lehua: '//cimg1.fenqile.com/product5/M00/8A/B0/MNEHAF9rELSAHwvLAAAC2DqVuBI589.png', // 乐花卡icon
                shareIcon: '//cres.fenqile.cn/fenqile_m/img/global/i_sha.png' // 转发icon
            },
            taskList: [], // 任务列表
            amount: 0, // 购物返现金额
            oldAmount: 0, // 上一次进入首页的返现金额
            showDiffAmount: false,
            orderCount: 0, // 订单数量
            activitySkuList: [], // 推荐产品列表
            currentTab: 0, // 当前选中的tab
            isShowRulesBox: false, // 是否显示返现秘笈弹窗
            loading: false, // 下拉加载请求锁
            page: 1, // 其他分类推荐商品，当前请求的页数
            limit: 10, // 每页的商品数量
            isLastPage: false, // 是否到了最后一页，主要是底部的提示文案显示
            cpsProductList: [], // 当前选中的tab的分类商品列表
            scrollTop: 0, // 滚动条的垂直偏移高度
            showHead: false, // 配置信息回来后才显示头部，因为头部右边文案是在配置中配置的
            // 首页的头部配置
            indexHeadConfig: { // 头部组件传值
                title: '',
                stat: 'RULES', // 埋点
                right_btn_text: '返现秘籍',
                right_btn_link: '',
                needScroll: true, // 是否需要滚动事件
                textColor: '#ffffff', // 转变前文案颜色
                bgColor: 'transparent', // 转变前背景颜色
                slotBgColor: 'transparent', // 占位的背景颜色
                transformTextColor: '#000000', // 转变后文案颜色
                transformBgColor: '#ffffff', // 转变后背景颜色
                needTransform: true,
                arrowIcon: '//cimg1.fenqile.com/product5/M00/2C/C0/MdEHAF3R-xuALRqVAAABz27Q59A993.png', // 转变前左边icon
                transformArrowIcon: '//cimg1.fenqile.com/product5/M00/08/D7/L9EHAF0cVuSAUNcVAAACYK1H6qs010.png' // 转变后左边icon
            },
            // 邀请返现头部配置
            friendHeadConfig: {
                title: '',
                type: 'text',
                textColor: '#050C1C',
                bgColor: '#ffffff',
                slotBgColor: '#fafafa',
                right_btn_text: '我的好友',
                right_btn_link: '',
                needTransform: false,
                needSlot: true
            },
            // 大促头部
            promoteHeadConfig: {
                title: '',
                type: 'text',
                textColor: '#050C1C',
                bgColor: '#ffffff',
                slotBgColor: '#fafafa',
                needTransform: false,
                needSlot: true,
                needShare: true
            },
            footIndex: 0, // 当前选中的底部tab
            // 邀请返现组件需要是数据
            friendComponentInfo: {
                countInfo: {},
                inviterKey: '', // 邀请码
                isShowCountInfo: false,
                taskInfo: {} // 任务奖励信息
            },
            navScrollTop: {}, // 缓存上一个页面的scrollTop，目的是在点击tab切换回到之前的滚动高度
            channelJumpPop: { // 自动跳转弹框的控制字段
                show: false,
                timeOut: 1200 // 倒计时
            },
            guide: {
                isShowIndex: true, // 进入时是否展示搜索指引
                isShowEntry: false, // 退出时是否展示入口指引
                isShowBack: false, // 退出时是否展示挽留指引
                isGetEntry: false, // 是否请求展示入口指引
                isGetBack: false, // 是否请求展示挽留指引
                entryNotice: {}, // 入口指引数据
                backNotice: {}, // 挽留指引数据
                hasEverClickSearch: false, // 是否曾经点击过搜索框
                isShowIndexSale: false // 营销类弹窗，在搜索指引（功能性弹窗）弹窗关闭后展示
            },
            tabListScroll: { // tab滚动吸顶
                needSticky: false
            },
            footInit: { // 是否是第一次加载
                0: {
                    config: true, // 配置完成时
                    login: true, // 已登录后
                    unlogin: true, // 没有登录
                    init: true,
                    head: 'indexHeadConfig'
                },
                1: {
                    config: true,
                    login: true,
                    init: true,
                    head: 'friendHeadConfig'
                }
            },
            privilegeList: [], // 特权卡列表
            hasLepay: 0, // 是否开通了乐花卡
            channelModal: {}, // 自动跳转弹框内容
            searchBarHeight: 0, // 搜索框的高度
            headHeight: 0, // 头部高度
            searchBarTop: 0, // 搜索框距离顶部的高度
            deviceInfo: {
                deviceValue: '', // 设备号 
                deviceType: G_DEVICE_TYPE,
                deviceCode: ''
            },
            footerList: {}, // 存储以index为key的foot信息,目的是直接通过footIndex可以直接获取到当前的foot
            isShowPopShare: false, // 是否显示分享引导
            scrollInfo: {}, // 滚动获取到的数据
            swiperOption: { // 轮播图配置
                slidesPerView: 'auto',
                autoplay: 2000,
                loop: true,
                autoplayDisableOnInteraction: false, // 设为false,手动滑动后继续自动轮播
                pagination: '.swiper-pagination',
                onClick: function () {}
            },
            activitySwiperOption: { // 轮播图配置
                slidesPerView: 3,
                slidesPerGroup: 3,
                autoplay: 3000,
                loop: true,
                autoplayDisableOnInteraction: false // 设为false,手动滑动后继续自动轮播
            },
            shareConfig: {}, // 自定义分享的配置
            cardExpand: false,
            searchBarOptions: { // 搜索框提示文案swiper动效
                autoplay: 1200,
                slidesPerView: 1,
                loop: true,
                direction: 'vertical',
                noSwiping: true,
                autoplayDisableOnInteraction: false
            },
            isSuperMember: false, // 是否是超级会员
            cardType: CARD_TYPE, // 特权卡类型，目的是获取到配置中的特权卡文案信息
            creditCard: {}, // 额度卡信息
            takeOutCard: {}, // 外卖卡信息
            isInit: true // 目的是只初始化一次
        };
    },

    computed: {
        // 当前服务器时间
        currentServiceTime () {
            // G_CURRENT_SERVICE_TIME是从服务器获取的时间,php的time的单位是秒
            return window.G_CURRENT_SERVICE_TIME ? window.G_CURRENT_SERVICE_TIME * 1000 : G_DEVICE_TIME;
        },
        // 头部背景图
        bgImg () {
            return this.eventConfig.bg_img || '';
        },
        // 搜索信息配置
        searchBar () {
            return this.eventConfig.search_bar || {};
        },
        // 我的返现
        bonus () {
            let bonus = this.eventConfig.bonus || {};
            bonus.link = bonus.link ? this.linkAddSource(bonus.link) : ''; // 链接加上来源
            return bonus;
        },
        // 我的订单
        order () {
            let order = this.eventConfig.order || {};
            order.link = order.link ? this.linkAddSource(order.link) : ''; // 链接加上来源
            return order;
        },
        // 返现秘笈
        rules () {
            return this.eventConfig.rules || {};
        },
        // 任务列表标题
        taskTitle () {
            return this.eventConfig.task_title || '做任务拿返现';
        },
        // icon位标题
        iconTitle () {
            return this.eventConfig.icon_title || '下单拿返现';
        },
        // 是否在app环境内
        isInApp () {
            return Tool.isInApp();
        },
        // 渠道icons
        channelIcon () {
            return this.eventConfig.channel_icon || [];
        },
        // icon位列表配置
        iconList () {
            return this.eventConfig.icon_list || [];
        },
        // 推荐商品tab列表
        tabList () {
            return this.eventConfig.recommend_list || {};
        },
        // 底部tab
        footerTab () {
            let footList = this.eventConfig.footer || [];
            footList = footList.filter(foot => {
                if (foot.start_time && foot.end_time) {
                    return this.tool.isActiveDateByService(foot, this.currentServiceTime) === 1;
                } else {
                    return true;
                }
            });
            return footList;
        },
        // 是否显示第一个推荐列表
        showRecommendList () {
            return this.eventConfig.show_recommend_list || false;
        },
        // banner运营坑位
        banner () {
            let banner = this.eventConfig.banner || {};
            banner.is_show = this.tool.isActiveDateByService(banner, this.currentServiceTime) === 1;
            return banner;
        },
        // 活动运营坑位
        activityList () {
            return this.eventConfig.activity_list || [];
        },
        // 特权卡配置
        cardConfig () {
            let cardInfo = this.eventConfig.card_info || {};
            // 开通乐花卡链接
            if (cardInfo.lepay_url) {
                // 开通乐花卡链接增加开通完后回跳参数
                cardInfo.openUrl = Url.joinParams(cardInfo.lepay_url, {
                    redirect_url: location.href,
                    redirect_flag: true
                });
            }
            return cardInfo;
        },
        // 是否存在退出入口指引
        hasEntryNotice () {
            return !!(this.guide.entryNotice && this.guide.entryNotice.act_id);
        },
        // 是否存在退出入口挽留
        hasBackNotice () {
            // 当次已经点击过则不再展示搜索挽留引导
            return !!((this.guide.backNotice && this.guide.backNotice.act_id && !this.guide.hasEverClickSearch));
        },
        // 左侧按钮是否禁止默认返回行为（是否存在弹层需要弹出）
        leftBtnPreventDefault () {
            var isPrevent = this.hasBackNotice || this.hasEntryNotice;
            if (this.isInApp) {
                // 监听左侧返回
                App.invokeJsBridge('setReturnClickListener', {
                    listenerFlag: isPrevent ? 1 : 0,
                    onClick: () => {
                        this.leftBtnCallback();
                    }
                });
            }
            return isPrevent;  
        },
        // 当前展示的头部配置信息
        headConfig () {
            this.promoteHeadConfig.title = this.footInit[this.footIndex] ? (this.footerList[this.footIndex].text || '') : '';
            return this.footInit[this.footIndex] ? this[this.footInit[this.footIndex].head] : this.promoteHeadConfig;
        },
        // 京东/天猫组件所的数据
        cpsIndexConfig () {
            return {
                isLogin: this.isLogin, // 是否已登录
                channelIcon: this.channelIcon, // 渠道icon列表数据
                eventId: this.footerList[this.footIndex].event_id || 'EVE202011272542231',
                scrollInfo: this.scrollInfo, // 滚动的信息
                headHeight: this.headHeight, // 头部的高度
                deviceInfo: this.deviceInfo, // 设备信息
                lepayOpenUrl: this.cardConfig.openUrl || '', // 开通乐花卡链接
                source: G_SOURCE,
                deviceType: G_DEVICE_TYPE,
                htType: this.footIndex == 3 ? 'TMALL' : 'JD',
                serviceTime: this.currentServiceTime
            };
        },
        // 大促模块
        dacuInfo () {
            return this.eventConfig.dacu_info || {};
        },
        // 大促模块
        floatingInfo () {
            let floating = this.eventConfig.floating_info || {};
            floating.isShow = (floating.is_show && floating.start_time && floating.end_time) ? Tool.isActiveDate(floating) === 1 : false; // 是否显示

            return floating;
        },
        // 新增的返现金额
        diffAmount () {
            return this.oldAmount && (this.amount - this.oldAmount).toFixed(2);
        },
        // 特权卡是否可领取
        creditCardCanReceive () {
            return this.creditCard && +this.creditCard.has_privilege === 0;
        },
        // 是否显示特权卡
        showCardInfo () {
            return this.isLogin && this.hasLepay && this.privilegeList.length > 0;
        },
        // 特权卡的文案配置信息
        creditCardConfig () {
            return this.cardConfig.type[this.cardType.credit] || {};
        },
        // 是否滚动到推荐tab位置
        needScrollRecommend () {
            return G_JUMP_TYPE == 1 && this.headHeight > 0 && this.cpsProductList && this.cpsProductList.length > 0;
        }
    },
   
    watch: {
        needScrollRecommend (cur) {
            if (this.isInit && cur) {
                this.isInit = false;
                // 滚动到推荐tab
                let defaultScrollTop = this.$refs.tab_list.offsetTop - this.headHeight - this.$refs.search_bar.offsetHeight + 1;
                this.$nextTick(function () {
                    window.scrollTo(0, defaultScrollTop);
                });
            }
        }
    },
    methods: {
        // 在进入指引弹窗弹出后，请求其余两个弹窗
        indexNoticeReturn (data = {}) {
            // 若不存在弹窗活动则需查询搜索指引弹窗
            // if (!data.act_id) {
            //     // 若没有数据则查询搜索挽留
            //     this.guide.isShowBack = true;
            // } 
            if (Tool.isEmptyObject(data)) {
                this.guide.isShowIndexSale = true; // 搜索指引为空则展示营销类弹窗
            }
            this.guide.isGetEntry = true;
            this.guide.isGetBack = true;
        },
        // 在进入指引弹窗弹出后，请求其余两个弹窗
        entryNoticeReturn (data = {}) {
            this.guide.entryNotice = data;
        },
        backNoticeReturn (data = {}) {
            this.guide.backNotice = data;
        },
        // 点击后需要清空弹窗内容
        clearNotice () {
            this.guide.entryNotice = {};
            this.guide.backNotice = {};
        },
        // 左侧点击返回回调，在preventDefault时才生效
        leftBtnCallback () {
            this.setSearchBarTop();
            this.guide.isShowIndex = false;
            let {hasEntryNotice, hasBackNotice} = this;
            if (hasEntryNotice) {
                this.guide.isShowEntry = true;
                // clear触发preventDefault为false
                this.clearNotice();
                return;
            }
            
            if (hasBackNotice) {
                this.guide.isShowBack = true;
                this.clearNotice();
            }
        },
        // 搜索指引弹窗关闭
        indexNoticeClosed () {
            this.guide.isShowIndexSale = true; // 展示营销类弹窗
        },
        // 营销类弹窗点击
        indexSaleNoticeAction (data) {
            this.linkToCpsHandler(data, 'ADS_BOX_LINK_TO_CPS');
        },
        // 切换底部tab
        switchFootIndex (index) {
            if (index == this.footIndex) {
                return;
            }
            // 目的是为了只初始化一次notice
            if (this.footInit[this.footIndex] && this.footInit[this.footIndex].init) {
                this.footInit[this.footIndex].init = false;
            }
          
            this.$set(this.navScrollTop, this.footIndex, this.scrollTop);
            this.footIndex = 0; // 先重置，目的是为了京东和天猫组件每次点击都是重新请求
           
            let scrollTop = this.navScrollTop[index] || 0;
            this.$nextTick(() => {
                this.footIndex = index; // 设置选中tab
                // 确保请求一次初始化的数据
                this.initRequest();
                if (index == 0 && !this.searchBarTop) {
                    this.setSearchBarTop();
                }
                window.scrollTo(0, scrollTop);
            });
            // 更新tab变量，目的是跳转后刷新还是当前页
            window.history.replaceState({}, '', Url.set('tab', index, window.location.href));
        },
        // 确定切换tab后只请求一次
        initRequest () {
            this.init();
            if (this.isLogin) {
                this.loginCallback();
            } else {
                this.unloginCallback();
            }
        },

        // 点击搜索框跳转至搜索页
        toCpsSearch () {
            let link = this.linkAddSource(`//m.fenqile.com/cps/search.html?cps=${this.searchBar.channel_id}`); // 跳转至搜索页
            this.guide.hasEverClickSearch = true; // 设置已经点击过搜索框
            this.$href(link);
        },

        // 链接加上来源
        linkAddSource (link) {
            return Url.joinParams(link, {source: G_SOURCE});
        },

        // 点击商品列表商品
        recommendProductClick (sku) {
            this.getProductDetailUrl(this.tabList[this.currentTab].channel_id, sku);
        },
        // 选择tab
        selectedTab (index) {
            // 如果在点击切换tab时，当前分类数据还未加载完，则不能切换
            if (this.loading) {
                return;
            }
            if (this.tabListScroll.needSticky) {
                // 缓存点击前的tab的scrollTop
                CPS_SCROLL_TOP_CACHE[this.currentTab] = this.scrollTop;
                // 没有缓存scrollTop，则设置为tab的商品位置，注：+6是因为web和手机存在误差
                let defaultScrollTop = this.$refs.tab_list.offsetTop - this.headHeight - this.$refs.search_bar.offsetHeight + 1;
                let scrollTop = CPS_SCROLL_TOP_CACHE[index] ? CPS_SCROLL_TOP_CACHE[index] : defaultScrollTop;
                // 切换时滚动到之前的滚动位
                this.$nextTick(() => {
                    window.scrollTo(0, scrollTop);
                });
            } else {
                CPS_SCROLL_TOP_CACHE = {};
            }
            // 上报数据
            this.setDataReport('NAV_TO_THEME_RECOMMEND_' + index);
            // 如果点击是第一个分类，则不请求数据
            if (this.showRecommendList && index == 0) {
                this.currentTab = index;
                return;
            }
            // 如果有缓存,则用缓存数据显示
            if (CPS_PRODUCT_LIST_CACHE[index]) {
                this.cpsProductList = CPS_PRODUCT_LIST_CACHE[index].list || [];
                this.page = CPS_PRODUCT_LIST_CACHE[index].page || 1;
                this.isLastPage = CPS_PRODUCT_LIST_CACHE[index].isEnd;
                this.currentTab = index;
                return;
            }
            this.page = 1;
            this.isLastPage = false;
            this.queryRecommendGoods(index);
        },
        // 大促banner轮播图点击
        bannerSwiperClick (e) {
            let index = e.activeIndex % this.dacuInfo.banner.length;

            this.linkToCpsHandler(this.dacuInfo.banner[index]);
        },

        // 跳转至二级页面
        linkToCpsOtherPage (icon, index) {
            let link = icon.skip_url;
            if (icon.is_waiting) {
                this.$toast('敬请期待~');
                return;
            }

            // 处理参数
            icon.channel = icon.channel_id;
            icon.link = link;
            this.linkToCpsHandler(icon, 'LINK_TO_CPS_OTHER_PAGE_' + index);
            
        },

        // 处理第三方跳转
        linkToCpsHandler (item, stat = '') {
            let link = item.link,
                modalInfo = {};
            
            // 设置自动跳转弹框内容
            if (item.jump_modal && Object.keys(item.jump_modal).length) {
                modalInfo = {
                    icon: item.icon_url,
                    name: item.jump_modal.jump_desc,
                    tip: item.jump_modal.tip
                };
            }

            this.channelModal = modalInfo;

            item.active_id && typeof item.active_id === 'string' ? item.active_id = item.active_id.replace(/&amp;/gi, '&') : ''; // 兼容active_id存在&amp;的问题

            // 需要淘宝授权
            if (Number(item.channel) == G_CHANNEL.tb && item.need_tb_grant == 1) {
                this.linkToTbUrl(item, stat, modalInfo);
                return;
            }
            // 需转链
            if (item.need_promotion == 1) {
                this.linkToCpsUrl(item, stat, modalInfo);
                return;
            }
            // 直接跳转链接
            this.linkToUrl(link, stat);
        },

        // 跳转至第三方活动，且需要转链
        async linkToCpsUrl (param, stat = '', channelModal = {}) {
            // 如果没有登录,则先登录
            if (!this.isLogin) {
                this.$login();
                return;
            }
            let backFn = null;
            switch (Number(param.channel)) {
                case G_CHANNEL.tb: // 淘宝
                    backFn = await this.linkToTaobao(param, {needCallback: true});
                    break;
                case G_CHANNEL.jd: // 京东
                    backFn = await this.linkToJD(param, {needCallback: true});
                    break;
                case G_CHANNEL.pdd: // 拼多多
                    backFn = await this.linkToPdd(param, {needCallback: true});
                    break;
                case G_CHANNEL.wph: // 唯品会
                    backFn = await this.linkToWph(param, {needCallback: true});
                    break;
                default: {
                    let ret = await this.getPromotionUrl(param);
                   
                    ret.click_url && this.linkToUrl(ret.click_url, stat);
                }
            }
          
            backFn && this.cpsJumpUrl({channelModal, stat, fn: backFn});
        },

        // 自动跳转
        async autoJumpUrl ({link, stat, fn}) {
            let _this = this;
            _this.channelJumpPop.show = true;
            let timer = setTimeout(function () {
                clearTimeout(timer);
                timer = null;
                // 如果存在回调方法，则直接执行回调
                if (fn) {
                    fn();
                } else {
                    // 否则直接跳转链接
                    _this.linkToUrl(link, stat);
                }
                _this.channelJumpPop.show = false;
            }, _this.channelJumpPop.timeOut);
        },

        // 淘宝授权后是否需要打开弹框自动跳转
        async linkToTbUrl (icon, stat = '', channelModal = {}) {
            // 如果没有登录,则先登录
            if (!this.isLogin) {
                this.$login();
                return;
            }
            let param = {};
            if (icon.need_promotion == 1) {
                param.active_id = icon.active_id;
            } else {
                // 如果没有跳转链接则不跳转
                if (!icon.link) {
                    return;
                }
                param.url = icon.link;
            }
            param.channel = G_CHANNEL.tb; // 设置为淘宝的channel,统一收拢跳转
            this.linkToCpsUrl(param, stat, channelModal);
        },
        // 是否需要弹出框自动跳转
        cpsJumpUrl ({channelModal, stat, fn}) {
            // 判断fn是否返回的是方法
            if (Tool.isFunction(fn)) {
                let jumpCallback = () => {
                    this.setDataReport(stat);
                    fn();
                };
                if (channelModal && Object.keys(channelModal).length) {
                    // 显示浮层，自动跳转
                    this.autoJumpUrl({fn: jumpCallback});
                } else {
                    // 否则直接跳转
                    jumpCallback();
                }
            }
        },
        // 活动运营坑位，商品跳转处理
        toProductDetailHandler (activity, index, product, pIndex) {
            // 如果需要转链，则不跳转至CPS商详
            if (activity.need_promotion == 1) {
                this.linkToCpsHandler(activity, 'LINK_TO_CPS_ACTIVITY_' + index);
            } else {
                this.getProductDetailUrl(activity.channel, product);
                // 数据上报
                this.setDataReport(`ACTIVITY_PRODUCT_${index}_${pIndex}_${product.sku_id}`);
            }
        },

        // 领取特权卡
        async receivePrivilegeCard (item, index) {
            // 如果卡的状态是敬请期待，则不能领取
            if (item.has_privilege == 2) {
                this.setDataReport('BTN_DISABLED_RECEIVE_CARD_' + index);
                return;
            }
            // 如果没有登录,则先登录
            if (!this.isLogin) {
                this.$login();
                return;
            }
            // 如果没有开通乐花卡，则去开通
            if (!this.hasLepay) {
                this.cardConfig.openUrl && this.linkToUrl(this.cardConfig.openUrl, 'LINK_TO_LEPAY');
                return;
            }
            // 如果卡的状态是已领取
            if (item.has_privilege == 1) {
                if (item.type == 2) {
                    item.link_url && this.linkToUrl(item.link_url, 'LINK_TO_SECOND_PAGE');
                }
                return;
            }
            // 数据上报
            this.setDataReport('BTN_RECEIVE_PRIVILEGE_CARD_' + index);
            try {
                // 增加请求锁
                if (this.loading) {
                    return;
                }
                this.loading = true;
                let res = await CpsProductModel.sendPrivilege(item.privilege_id);
                this.loading = false;
                if (+res.data.result === 0) {
                    this.$toast('领取成功');
                    this.getIndexPrivilege(); // 领取成功后，重新获取特权卡信息
                }
            } catch (err) {
                this.loading = false;
                this.$toast(err);
            }
        },

        // 有登陆态的请求回调
        loginCallback () {
            let request = {
                // 购物返现
                0: () => {
                    // 查询用户类型,任务列表暂时去除
                    // this.queryUserTaskList();
                    // 查询购物返现金额
                    this.queryUserAccountStatus();
                    // 查询订单数量
                    // this.queryUserOrderCount();
                    // 查询特权卡信息
                    this.getIndexPrivilege();
                    // 查询是否是超级会员
                    this.getUserType();
                },
                // 邀请返现
                1: () => {
                    // 查询统计信息
                    this.queryCountInfo();
                }
            };
            if (this.isLogin && this.footInit[this.footIndex] && this.footInit[this.footIndex].login) {
                this.footInit[this.footIndex].login = false;
                request[this.footIndex] && request[this.footIndex]();
            }
        },

        setFootList () {
            let hasFootTab = false;
            this.footerTab.forEach(foot => {
                if (foot.index == G_FOOT_INDEX) {
                    hasFootTab = true;
                }
                this.footerList[foot.index] = foot;
            });
            !hasFootTab ? this.footIndex = 0 : '';
        },
        // 获取完配置后回调
        configCallback () {
            this.setFootList();
            this.showHead = true;
            this.indexHeadConfig.title = this.rules.index_title;
            this.indexHeadConfig.right_btn_text = this.rules.right_btn_text; // 头部右上角文案
            this.indexHeadConfig.right_btn_link = this.rules.link; // 头部右上角跳转链接

            this.friendHeadConfig.title = this.rules.friend_title;
            this.friendHeadConfig.right_btn_text = this.rules.friend_right_btn_text; // 头部右上角文案
            this.friendHeadConfig.right_btn_link = this.rules.friend_right_btn_link; // 头部右上角跳转链接

            // 兼容没有
            if (!this.footerTab.some(foot => foot.index == G_FOOT_INDEX)) {
                this.footIndex = 0;
            }
            
            // 初始化
            this.init();
        },

        // 获取头部实际高度
        getHeadHeight (height) {
            this.headHeight = height;
            // 设置搜索框距离顶部的高度
            this.$nextTick(()=> {
                this.setSearchBarTop();
            }); 
        },
        // 设置搜索框距离顶部的高度
        setSearchBarTop () {
            this.$refs.search_bar ? this.searchBarTop = this.$refs.search_bar.getBoundingClientRect().top : '';
        },
        // 点击去完成
        toFinishTask (task, index) {
            // 如果任务类型是新手任务，则直接跳转至新人教程
            if (task.task_id == 1) {
                this.linkToUrl(task.skip_url, 'LINK_TO_TASK_URL_' + index); // 跳转链接
            } else {
                this.addUserTask(task, index);
            }
        },
        // 设置大促的分享和标题
        getCpsIndexInfo (config) {
            this.headConfig.title = config.head_title || this.footerList[this.footIndex].text || ''; // 自定义头部标题
            this.shareConfig = config.share_info || this.baseInfo || {}; // 分享配置
            this.initShare(this.shareConfig);
        },
        // 立即分享
        toShare () {
            if (this.isInApp) {
                App.invokeJsBridge('shareDetails', {
                    platform: '12345678',
                    title: this.shareConfig['share_title'] || document.title,
                    titleUrl: this.handleShareLink(location.href, this.baseInfo['share_dtag']),
                    content: this.shareConfig['share_desc'] || document.title,
                    imgurl: this.shareConfig['share_img'] || this.defaultShareImg,
                    onSuccess: () => {
                        this.handleShareSuccess();
                        this.isShowPopShare = false;
                    }
                });
            } else {
                this.isShowPopShare = true;
            }
        },
        // 点击右边按钮返现秘籍
        rightBtnCallBack () {
            // 如果需要分享
            if (this.headConfig.needShare) {
                this.toShare();
                return;
            }
            // 如果配置了跳转链接，则跳转至新页面
            if (this.headConfig.right_btn_link) {
                this.linkToUrl(this.headConfig.right_btn_link, `LINK_TOP_RIGHT_URL_${this.footIndex == 1 ? 'FRIEND' : ''}`); // 跳转链接
                return;
            }
            // 否则打开弹窗
            this.isShowRulesBox = true;
        },

        // 处理sku列表的价格展示
        handlePrice (price) {
            let price_arr = String(price).split('.');
            if (price_arr.length > 1) {
                return `<span class="yuan">&yen;</span><span class="price">${price_arr[0]}</span><span class="price-float">.${price_arr[1]}</span>`;
            }
            return `<span class="yuan">&yen;</span><span class="price">${price}</span>`;
        },
        // 我的返现跳转
        linkToBonusUrl (url, stat) {
            // 如果没有登录,则先登录
            if (!this.isLogin) {
                this.$login();
                return;
            }
            this.linkToUrl(url, stat); // 跳转链接
        },
        // 生成任务
        async addUserTask (task, index) {
            try {
                let res = await CpsProductModel.addUserTask(task.task_id);
                if (+res.data.result === 0) {
                    this.linkToUrl(task.skip_url, 'LINK_TO_TASK_URL_' + index); // 跳转链接
                }
            } catch (err) {
                this.$toast(err);
            }
        },

        // 查询购物返现金额
        async queryUserAccountStatus () {
            try {
                let res = await CpsProductModel.queryUserAccountStatus(G_SOURCE, {te: [4, 7, 8]});
                if (+res.data.result === 0) {
                    let ret = res.data.result_rows || {};
                    
                    // 设置返现金额
                    this.amount = ret.fql_order_status_user_rebate_map && ret.fql_order_status_user_rebate_map.te || 0;
                    let uid = res.system.uid; // 当前用户的uid
                    let oldBonusAmount = window.localStorage.getItem('bonus_amount_' + uid);
                   
                    if (oldBonusAmount && this.amount - oldBonusAmount > 0) {
                        this.oldAmount = oldBonusAmount;
                        // 显示新增的返现金额
                        this.showDiffAmount = true;
                        let speed = this.bonus.amount_speed || 0; // 显示的时间
                        let timer = setTimeout(() =>{
                            this.showDiffAmount = false;
                            clearTimeout(timer);
                        }, speed);
                    } else {
                        this.oldAmount = this.amount;
                    }
                    window.localStorage.setItem('bonus_amount_' + uid, this.amount);
                }
            } catch (err) {
                // 因为报错后可以使用默认的0显示，所以不需要报错
                // this.$toast(err);
            }
        },

        // 查询订单数量
        async queryUserOrderCount () {
            try {
                let res = await CpsProductModel.queryUserOrderCount(G_SOURCE);
                if (+res.data.result === 0) {
                    let ret = res.data.result_rows || {};
                    // 设置订单数量
                    this.orderCount = ret.count || 0;
                }
            } catch (err) {
                // 因为报错后可以使用默认的0显示，所以不需要报错
                // this.$toast(err);
            }
        },

        // 查询用户任务列表
        async queryUserTaskList () {
            try {
                let res = await CpsProductModel.queryUserTaskList();
                let ret = res.data.result_rows || [];
                if (+res.data.result === 0) {
                    this.taskList = ret;
                }
            } catch (err) {
                this.$toast(err);
            }
        },

        // 活动推荐商品查询
        async queryGuessYouLikeGoods () {
            try {
                // 请求锁
                if (this.loading) {
                    return;
                }
                this.loading = true;
                let res = await CpsProductModel.queryGuessYouLikeGoods();
                if (+res.data.result === 0) {
                    let ret = res.data.result_rows || [];
                    this.activitySkuList = ret;
                    this.loading = false;
                    ret.map((ac_sku, index) => {
                        // 曝光推荐模块
                        this.setDataReport('QUERY_GUESS_YOU_LIKE_GOODS_' + index, '', 1);

                        // 曝光sku列表
                        let skuList = ac_sku.sku_list.map(item => item && item.sku_id);
                        this.setDataReport('LIKE_SKU_LIST_' + index, skuList, 1);
                    });
                }
            } catch (err) {
                this.loading = false;
                this.$toast(err);
            }
        },

        // 主题活动推荐商品查询
        async queryRecommendGoods (index) {
            try {
                // 请求锁
                if (this.loading) {
                    return;
                }
                this.loading = true;
                let currentTabInfo = this.tabList[index];
                let res = await CpsProductModel.queryRecommendGoods(this.page, this.limit, this.deviceInfo, currentTabInfo);
                if (+res.data.result === 0) {
                    let ret = res.data.result_rows || [];
                    this.currentTab = index; // 放在这里设置当前选中的tab的原因是防止在没加载完导致的页面闪动
                    // 如果page为1则cpsProductList先清空
                    if (this.page == 1) {
                        this.cpsProductList = [];
                    }
                    let product_list = [].concat(this.cpsProductList, ret);
                    let totalPage = Math.ceil(res.data.total_num / this.limit); // 计算出总页数
                    this.cpsProductList = product_list;
                    this.page++;
                    // 如果没有缓存数据,则初始化为空对象
                    if (!CPS_PRODUCT_LIST_CACHE[index]) {
                        CPS_PRODUCT_LIST_CACHE[index] = {};
                    }

                    // 设置tab页的商品缓存数据
                    CPS_PRODUCT_LIST_CACHE[index] = {
                        list: product_list,
                        page: this.page,
                        isEnd: false
                    };

                    // 如果到了最后一页,则不再继续下拉加载,且文案变成已经到底啦
                    // 根据是否返回数据为空表示最后一页，不能统一成总页数的原因是因为淘宝没有总条数返回, if_end字段如果有则表示没有总条数返回，
                    // 兼容其他渠道也没有总条数返回的情况，就不直接根据渠道id去判断了
                    if (res.data.if_end || res.data.if_end == undefined && this.page > totalPage) {
                        CPS_PRODUCT_LIST_CACHE[index].isEnd = true;
                        this.isLastPage = true;
                    }

                    let skuList = ret.map(item => item && item.sku_id);
                    this.setDataReport('THEME_RECOMMEND_' + index, skuList, 1);
                }
                this.loading = false;
            } catch (err) {
                this.$toast(err);
                this.loading = false;
            }
        },

        // 查询统计信息
        async queryCountInfo () {
            try {
                let res = await saleModel.queryCountInfo();

                this.friendComponentInfo.isShowCountInfo = true;
                if (parseInt(res.result) === 0) {
                    let result_rows = res['data']['result_rows'] || {};

                    this.friendComponentInfo.countInfo = result_rows; // 数量或金额统计信息
                    this.friendComponentInfo.inviterKey = result_rows.inviter_key || ''; // 邀请码
                    this.friendComponentInfo.taskInfo = result_rows.task_info || {}; // 任务奖励信息
                } else {
                    this.$toast(res.retmsg);
                }
            } catch (err) {
                this.friendComponentInfo.isShowCountInfo = true;
                this.$toast(err);
            }
        },
        // 获取批量活动请求参数
        getActivityParam () {
            return this.activityList.map((ac, index) => {
                return {
                    channel_id: ac.channel || '',
                    channel_type: ac.channel_type || '',
                    recommend_type: ac.recommend_type || 0,
                    limit: ac.limit || 3,
                    act_index: G_AC_INDEX_PRE + index
                };
            });
        },
        // 批量获得活动信息
        async queryRecommendActivitys () {
            try {
                let param = {
                    source_id: G_SOURCE,
                    device_type: G_DEVICE_TYPE,
                    activitys: this.getActivityParam()
                };
                let res = await CpsProductModel.queryRecommendActivitys(param);
                if (parseInt(res.result) === 0) {
                    let ret = res['data']['result_rows'] || {};
                    let activityList = ret.activitys || {};
                    this.activityList.forEach((ac, index) => {
                        let key = G_AC_INDEX_PRE + index;
                        let skuList = [];
                        if (activityList[key] && activityList[key].sku_list && activityList[key].sku_list.length) {
                            this.$set(this.activityList[index], 'product_list', activityList[key].sku_list);
                            activityList[key].sku_list.forEach(sku => {
                                sku.sku_id ? skuList.push(sku.sku_id) : '';
                            });
                            this.setDataReport('ACTIVITY_SKU_LIST_' + index, skuList, 1); // 曝光上报sku
                        }
                    });
                } else {
                    this.$toast(res.retmsg);
                }
            } catch (err) {
                this.$toast(err);
            }
        },
        // 特权卡查询
        async getIndexPrivilege () {
            try {
                let res = await CpsProductModel.getIndexPrivilege();
                if (parseInt(res.result) === 0) {
                    let ret = res['data']['result_rows'] || {};
                    this.privilegeList = ret.privileges || []; // 特权卡列表
                    // 分别设置外卖卡和额度卡，目前只支持外卖卡和额度卡各一张
                    this.privilegeList.forEach(card => {
                        if (card.type == this.cardType.credit) {
                            this.creditCard = card;
                        } else {
                            this.takeOutCard = card;
                        }
                    });
                    this.cardExpand = this.creditCard && this.creditCard.has_privilege == 0;

                    this.hasLepay = ret.has_lepay || 0; // 是否开通了乐花卡
                } else {
                    this.$toast(res.retmsg);
                }
            } catch (err) {
                this.$toast(err);
            }
        },
       
        // 查询是否是超级会员
        async getUserType () {
            try {
                let res = await CpsProductModel.getUserType();
                if (parseInt(res.result) === 0) {
                    let ret = res['data']['result_rows'] || {};
                    this.isSuperMember = ret.user_type == 1;
                } else {
                    this.$toast(res.retmsg);
                }
            } catch (err) {
                console.error(err);
            }
        },

        // 滚动到底部
        scrollBottom () {
            // 如果已经加载到了最后一页数据，则无需再到达底部请求数据
            if (CPS_PRODUCT_LIST_CACHE[this.currentTab] && CPS_PRODUCT_LIST_CACHE[this.currentTab].isEnd) {
                return;
            }
            // 滚动到距离底部10px的位置.加载下一页数据
            if (this.footIndex == 0 && this.tabList.length > 0 & !(this.showRecommendList && this.currentTab == 0)) {
                this.queryRecommendGoods(this.currentTab);
            }
        },

        // 全局滚动,目的是记录tab切换前的scrollTop
        scroll (opt) {
            this.scrollTop = opt.scrollTop || 0;
            this.scrollInfo = opt;
            if (this.footIndex == 0) {
                let top = this.$refs.tab_list.getBoundingClientRect().top;
                this.searchBarHeight = this.$refs.search_bar.offsetHeight;
                let fixedTop = this.$refs.search_bar.offsetHeight + this.headHeight;
                this.tabListScroll.needSticky = top <= fixedTop;
            }
        },

        // 初始化
        init () {
            if (this.footIndex == 0 && this.footInit[this.footIndex].config) {
                this.footInit[this.footIndex].config = false;
                // 活动推荐商品查询
                if (this.showRecommendList) {
                    this.queryGuessYouLikeGoods();
                } else {
                    // 如果不需要推荐位列表，则第一个tab也是普通的cps列表
                    this.queryRecommendGoods(0);
                }
                // 批量获得活动信息
                this.queryRecommendActivitys();
            }
        },

        // 获取设备信息
        queryDeviceInfo () {
            let isIOS = G_DEVICE_TYPE == 1;
            // 兼容app版本低于5.13
            if (App.isVersionBelow('5.13.0')) {
                App.invokeJsBridge('getDeviceInfo', {
                    onReturn: (data) => {
                        this.deviceInfo.deviceValue = data.mobileId || ''; // 设备号 ios：idfa 安卓：imei
                        this.deviceInfo.deviceCode = isIOS ? 'IDFA' : 'IMEI'; // 设备类型 
                    }
                });
                return;
            } 
            // app版本高于5.13，获取设备信息
            App.invokeJsBridge('getUserReportInfo', {
                onReturn: (data) => {
                    let deviceCode = '';
                    if (isIOS) {
                        deviceCode = 'IDFA';
                    } else {
                        deviceCode = data['oaid'] ? 'OAID' : (data['imei'] ? 'IMEI' : '');
                    }
                    this.deviceInfo.deviceCode = deviceCode; // 设备类型
                    this.deviceInfo.deviceValue = deviceCode ? data[deviceCode.toLowerCase()] : ''; // 设备号 ios：idfa 安卓：oaid|imei
                }
            });
        }
    },
    created () {
        this.footIndex = G_FOOT_INDEX;
        if (this.isInApp) {
            App.jsBridgeReady(() => {
                App.invokeJsBridge('setTitleRightIcon', {visible: false});
                App.invokeJsBridge('hideTitle');
                // 获取设备信息
                this.queryDeviceInfo();
            });
        }

        // 大促banner轮播图点击事件绑定
        this.swiperOption.onClick = this.bannerSwiperClick;
    }
};

import Tool from '@/mod/util/tool/1.0/tool.js';
import EventModel from '@/model/EventModel';
import CpsProductModel from '../../model/CpsProductModel.js';
import RecommendProduct from '@/mod/render/recommendProduct/h5/1.0/index.vue';
import AdList from '../adList/index.vue';
import Floating from '@/mod/render/floating/h5/1.0/index.vue';
import Marquee from '@/mod/render/marquee/marquee.vue'; // 弹幕轮播组件
import { swiper, swiperSlide } from 'vue-awesome-swiper';

let CPS_PRODUCT_LIST_CACHE = {}; // 商品信息缓存列表
let CPS_SCROLL_TOP_CACHE = {}; // 每个列表的scrollTop缓存
const TAB_COL_COUNT = 5;
const G_AC_INDEX_PRE = 'cps_act_'; // 活动索引前缀
export default {
    name: 'cpsIndex',
    props: {
        eventId: {
            type: String,
            default: 'EVE202011182538721'
        },
        isLogin: {},
        headHeight: {},
        scrollInfo: {},
        channelIcon: {},
        deviceInfo: {},
        lepayOpenUrl: {},
        source: {},
        deviceType: {},
        htType: {
            type: String,
            default: 'JD'
        },
        serviceTime: {}
    },
    components: {
        RecommendProduct,
        AdList,
        Floating,
        Marquee,
        swiper,
        swiperSlide
    },
    data () {
        return {
            tool: Tool,
            isInApp: Tool.isInApp(),
            config: {},
            imgSrc: {
                lehua: '//cimg1.fenqile.com/product5/M00/8A/B0/MNEHAF9rELSAHwvLAAAC2DqVuBI589.png', // 乐花卡icon
                productDefaultBg: '//cimg1.fenqile.com/product5/M00/36/41/MtEHAF-3z_WAMmtMAAEcAeu73kI077.png',
                whiteLehua: '//cimg1.fenqile.com/product5/M00/3B/84/MdEHAF-_IWKABUFnAAAEKH1awe4089.png'
            },
            currentTab: 0, // 当前选中的tabIndex
            recommendConfig: { // 推荐列表组件prop
                list: []
            },
            headImgOffsetHeight: 0, // 头部banner高度
            loading: false, // 请求锁
            page: 1, // 其他分类推荐商品，当前请求的页数
            limit: 20, // 每页的商品数量
            isLastPage: false, // 是否到了最后一页，主要是底部的提示文案显示
            quotaCardDetail: {}, // 额度卡详情
            awardOptions: { // 利益点swiper动效
                autoplay: 1200,
                slidesPerView: 1,
                loop: true,
                direction: 'vertical',
                noSwiping: true,
                autoplayDisableOnInteraction: false
            },
            isShowRulesDialog: false, // 是否显示规则
            productTag: {}, // 存储自定义sku list获取商品的左上角标签
            tabListDom: '', // tab列表的dom元素
            needSticked: false,
            isShowAwardDialog: false,
            tabList: []
        };
    },

    computed: {
        // 利益点
        awardList () {
            return this.config.head_award_list || [];
        },
        // 主题色
        themeColor () {
            return this.config.theme_color || '';
        },
        // logo
        logo () {
            return this.config.logo || {};
        },
        // 背景图
        bgImg () {
            return this.config.bg_img || {};
        },
        // 弹幕
        rollInfo () {
            return this.config.roll_info || {};
        },
        // 搜索框
        searchBar () {
            return this.config.search_bar || {};
        },
        // 乐花卡信息
        cardInfo () {
            return this.config.card_info || {};
        },
        // 福利楼层
        awardFloor () {
            let awardInfo = this.config.award_floor || {};
            awardInfo.is_show = this.checkIsActiveDate(awardInfo);
            awardInfo.ad_info = awardInfo.ad_info ? awardInfo.ad_info.filter(ad => this.checkIsActiveDate(ad)) : []; // 筛选出活动中的广告位展示
            return awardInfo;
        },
        // 会场楼层
        venueFloor () {
            let venueInfo = this.config.venue_floor || {};
            venueInfo.is_show = this.checkIsActiveDate(venueInfo);
            venueInfo.ad_info = venueInfo.ad_info ? venueInfo.ad_info.filter(ad => this.checkIsActiveDate(ad)) : []; // 筛选出活动中的广告位展示
            return venueInfo;
        },
        // 商品楼层
        productFloor () {
            let productFloor = this.config.product_floor || [];
            productFloor = productFloor.length ? productFloor.filter(pro => this.checkIsActiveDate(pro)) : []; // 筛选出在活动区间内的商品楼层
            return productFloor;
        },
        // tab的颜色设置(背景色和选中的颜色)
        tabListColor () {
            return this.config.tab_list_color || {};
        },
        // 乐花卡banner
        lepayBannerFloor () {
            let lepayBanner = this.config.lepay_banner_floor || {};
            lepayBanner.is_show = Object.keys(lepayBanner).length ? this.checkIsActiveDate(lepayBanner) : false; // 是否显示乐花卡banner
            return lepayBanner;
        },
        // floating
        floating () {
            let floating = this.config.floating || {};
            floating.is_show = Object.keys(floating).length ? this.checkIsActiveDate(floating) : false; // 是否显示
            return floating;
        },
        // 全局滚动的scrollTop
        scrollTop () {
            return this.scrollInfo.scrollTop || 0;
        },
        // 是否滚到底部
        isScrollBottom () {
            let {scrollHeight = 0, clientHeight = 0} = this.scrollInfo;
            return scrollHeight > clientHeight && this.scrollTop + clientHeight + 10 >= scrollHeight;
        },
        // 设置tabList的高度
        tabHeight () {
            return Math.ceil(this.tabList.length / TAB_COL_COUNT) * 71 + 22;
        }
    },

    watch: {
        // 滚动到底部
        isScrollBottom (newVal) {
            if (newVal) {
                this.loadMore();
            }
        },
        scrollTop () {
            if (this.tabListDom) {
                let top = this.tabListDom.getBoundingClientRect().top;
                this.needSticked = top <= this.headHeight;
            }
        }
    },
    methods: {
        // 查询是否在活动期间内
        checkIsActiveDate (target) {
            return this.tool.isActiveDateByService(target, this.serviceTime) === 1;
        },
        // 缓存tab的scrollTop值
        setScrollTopCache (index) {
            if (this.needSticked) {
                // 缓存点击前的tab的scrollTop
                CPS_SCROLL_TOP_CACHE[this.currentTab] = this.scrollTop;
                // 没有缓存scrollTop，则设置为tab的商品位置，注：-1是因为web和手机存在误差
                let defaultScrollTop = this.tabListDom.offsetTop - this.headHeight + 1;
                let scrollTop = CPS_SCROLL_TOP_CACHE[index] ? CPS_SCROLL_TOP_CACHE[index] : defaultScrollTop;
                // 切换时滚动到之前的滚动位
                this.$nextTick(() => {
                    window.scrollTo(0, scrollTop);
                });
            } else {
                CPS_SCROLL_TOP_CACHE = {};
            }
        },

        // 数据上报
        setDataReportHandler (hottag = '', skuId = '', actionType = 2) {
            this.$emit('setDataReportHandler', this.htType + '_' + hottag, skuId, actionType);
        },

        // 跳转链接
        linkToUrlHandler (url, stat) {
            if (!url) {
                return;
            }
            this.$open(url);
            stat && this.setDataReportHandler(stat);
        },

        // 选择tab
        selectTab (index) {
            // 如果在点击切换tab时，当前分类数据还未加载完，则不能切换
            if (this.loading) {
                return;
            }
            this.setScrollTopCache(index);
            let currentTabInfo = this.tabList[index];
            this.recommendConfig.channelId = currentTabInfo.channel_id;
            // 上报数据
            this.setDataReportHandler('NAV_TO_THEME_RECOMMEND_' + index);
            // 如果有缓存,则用缓存数据显示
            if (CPS_PRODUCT_LIST_CACHE[index]) {
                this.recommendConfig.list = CPS_PRODUCT_LIST_CACHE[index].list || [];
                this.page = CPS_PRODUCT_LIST_CACHE[index].page || 1;
                this.isLastPage = CPS_PRODUCT_LIST_CACHE[index].isEnd;
                this.currentTab = index;
                return;
            }
            this.page = 1;
            this.isLastPage = false;
            this.queryRecommendGoods(index);
        },

        // 点击搜索框跳转至搜索页
        toCpsSearch (stat) {
            let link = `//m.fenqile.com/cps/search.html?cps=${this.searchBar.channel_id}&source=${this.source}`; // 跳转至搜索页
            this.linkToUrlHandler(link, stat);
        },
        
        // 加载更多
        loadMore () {
            if (this.isLastPage || Object.keys(this.config).length == 0) {
                return;
            }
            // 查询渠道商品
            this.queryRecommendGoods(this.currentTab);
        },

        // 特权卡查询
        async getPrivilegeInfo () {
            try {
                let res = await CpsProductModel.getPrivilegeInfo(1);
                if (parseInt(res.result) === 0) {
                    let ret = res['data']['result_rows'] || {};
                    this.quotaCardDetail = {
                        isShow: Object.keys(ret).length > 0, // 是否是打标用户
                        privilegeId: ret.privilege_id || '', // 特权卡id
                        hasPrivilege: ret.has_privilege || 0, // 是否已领取：0-未，1-已领取
                        hasLepay: ret.has_lepay || 0 // 是否开通了乐花卡
                    };
                } else {
                    this.$toast(res.retmsg);
                }
            } catch (err) {
                this.$toast(err);
            }
        },

        // 领取特权卡
        async receivePrivilegeCard () {
            // 如果卡的状态是敬请期待，则不能领取
            if (this.quotaCardDetail.hasPrivilege == 2 || this.quotaCardDetail.hasPrivilege == 1) {
                this.setDataReportHandler('CPS_INDEX_BTN_DISABLED_RECEIVE');
                return;
            }
            // 如果没有登录,则先登录
            if (!this.isLogin) {
                this.$toast('登录后再来领取福利吧！');
                this.$login();
                return;
            }
            // 如果没有开通乐花卡，则去开通
            if (!this.quotaCardDetail.hasLepay) {
                this.$toast('先开通乐花卡再领取福利哦！');
                this.linkToUrlHandler(this.lepayOpenUrl, 'CPS_INDEX_LINK_TO_LEPAY');
                return;
            }
            // 数据上报
            this.setDataReportHandler('CPS_INDEX_BTN_RECEIVE_PRIVILEGE');
            try {
                // 增加请求锁
                if (this.loading) {
                    return;
                }
                this.loading = true;
                let res = await CpsProductModel.sendPrivilege(this.quotaCardDetail.privilegeId);
                this.loading = false;
                if (+res.data.result === 0) {
                    this.isShowAwardDialog = true;
                    this.getPrivilegeInfo(); // 领取成功后，重新获取特权卡信息
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
                    // 如果page为1则recommendConfig.list先清空
                    if (this.page == 1) {
                        this.recommendConfig.list = [];
                    }
                    let product_list = [].concat(this.recommendConfig.list, ret);
                    let totalPage = Math.ceil(res.data.total_num / this.limit); // 计算出总页数
                    this.recommendConfig.list = product_list;
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
                    this.setDataReportHandler('THEME_RECOMMEND_' + index, skuList, 1);
                }
                this.loading = false;
            } catch (err) {
                this.$toast(err);
                this.loading = false;
            }
        },

        // 批量获取商品接口需要的参数
        getActivityParam () {
            return this.productFloor.map((pro, index) => {
                let skuInfo = pro.sku_info || {};
                let skuList = skuInfo.sku_list || [];
                let skuIds = [];
                let options = {
                    channel_id: skuInfo.channel || '',
                    channel_type: skuInfo.channel_type || '',
                    recommend_type: skuInfo.recommend_type || 0,
                    limit: skuInfo.limit || 3,
                    act_index: G_AC_INDEX_PRE + index
                };
                skuList.forEach(x => {
                    skuIds.push(x.sku_id);
                    this.$set(this.productTag, x.sku_id, x.label || ''); // 设置左上角标签
                });
                skuIds.length > 0 ? options['sku_ids'] = skuIds : '';
                return options;
            });
        },
        // 批量获得活动信息
        async queryRecommendActivitys () {
            try {
                let param = {
                    source_id: this.source,
                    device_type: this.deviceType,
                    activitys: this.getActivityParam()
                };
                let res = await CpsProductModel.queryRecommendActivitys(param);
                if (parseInt(res.result) === 0) {
                    let ret = res['data']['result_rows'] || {};
                    let activityList = ret.activitys || {};
                    this.productFloor.forEach((ac, index) => {
                        let key = G_AC_INDEX_PRE + index;
                        let skuList = [];
                        let tmpSkuList = {}; // 缓存中间层sku信息，以sku_id为key
                        let acSkuList = [];
                        if (activityList[key] && activityList[key].sku_list && activityList[key].sku_list.length) {
                            // 处理上报sku，并设置以sku_id为key的中间层，目的是使返回的商品是根据传入的sku_ids进行排序的
                            activityList[key].sku_list.forEach(sku => {
                                skuList.push(sku.sku_id);
                                tmpSkuList[sku.sku_id] = sku; // 做中间层，目的是更好的取数据
                            });
                            // 如果是自定义sku_list，则需额外处理下返回商品的顺序，根据传入的sku_id排序输出
                            if (ac.sku_info && ac.sku_info.sku_list && ac.sku_info.sku_list.length) {
                                ac.sku_info.sku_list.forEach(sku => {
                                    if (tmpSkuList[sku.sku_id]) {
                                        acSkuList.push(tmpSkuList[sku.sku_id]);
                                    }
                                });
                            } else {
                            // 否则直接显示获取的sku_list
                                acSkuList = activityList[key].sku_list;
                            }
                            this.$set(this.productFloor[index], 'product_list', acSkuList);
                            this.setDataReportHandler('CPS_PRODUCT_SKU_LIST_' + index, skuList, 1); // 曝光上报sku
                        }
                    });
                } else {
                    this.$toast(res.retmsg);
                }
            } catch (err) {
                this.$toast(err);
            }
        },

        // 获取活动配置信息
        async handleGetEventConfig () {
            try {
                let eventModel = new EventModel();
                let ret = await eventModel.getEventConfig(this.eventId);
                let data = ret['data']['result_rows']['data'];
                if (data) {
                    this.config = JSON.parse(data)['config'] || {};
                    this.tabList = this.config.tab_list || []; // 长尾商品tabList
                    this.init();
                    this.$emit('getCpsIndexInfo', this.config);
                }
            } catch (err) {
                this.$toast(err);
            }
        },
        // 初始化
        init () {
            this.queryRecommendActivitys(); // 批量查询商品楼层商品
            this.queryRecommendGoods(0); // 查询推荐商品
            this.$nextTick(function () {
                this.tabListDom = this.$refs.tabList;
                this.headImgOffsetHeight = this.$refs.head_img.offsetHeight || 0;
                window.scrollTo(0, 0);
            });
        },
        // 调整至cps商详
        getProductDetailUrl (sku, channel_id) {
            this.$emit('getProductDetailUrl', channel_id ? channel_id : this.tabList[this.currentTab].channel_id, sku);
        },

        // 跳转至二级页或者第三方活动页
        linkToCps (item, stat) {
            this.$emit('linkToCps', item, stat);
        }
    },
    created () {
        this.handleGetEventConfig(); // 查询配置信息
        this.getPrivilegeInfo(); // 获取额度卡信息
    }
};

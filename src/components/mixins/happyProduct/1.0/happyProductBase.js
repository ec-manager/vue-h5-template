/**
 * @name [拉取乐疯抢活动商品基类]
 * @author [beginning]
 * @description [拉取乐疯抢活动商品都继承这个基类]
 * @class ProductBase
 */

import Cookie from 'js-cookie';
import ProductModel from '@/model/ProductModel';
const ProductBase = {
    props: {
        // 是否显示所有的板块
        showAllPlate: {
            type: Boolean,
            default: false
        },
        // 拉取商品条数
        limit: {
            type: Number,
            default: 10
        },
        // 是否过滤库存为0的sku
        hasFilterProduct: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        // 获取平台类型
        getChannelType () {
            const ua = navigator.userAgent.toLowerCase();
            const isApp = /fenqile_(ios|android)_(\d{1,}\.\d{1,}\.\d{1,})/i;
            const isWeb = /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i;
            return isApp.test(ua) ? 2 : isWeb.test(ua) ? 3 : 1;
        },

        // 处理后的板块列表数据
        getPlateList () {
            return this.plateList.map(item => {
                item.title = this.getMonthDate(item['begin_time']);
                item['sub_title'] = this.getHoursMins(item['begin_time']);
                return item;
            });
        },

        // 处理后的商品列表数据
        getProductList () {
            if (this.hasFilterProduct) {
                // 返回库存大于0的商品
                return this.productList.filter(item => {
                    return parseInt(item.sku_num) > 0;
                });
            } else {
                return this.productList;
            }
        }
    },

    data () {
        return {
            // 板块列表
            plateList: [],
            // 乐疯抢活动ID
            eventId: '',
            offset: 0,
            // 缓存商品列表
            cacheProductList: {},
            // now的plateid
            nowPlateId: '',
            // 商品列表
            productList: []
        };
    },

    methods: {
        // 显示月、日
        getMonthDate (time) {
            let date = new Date(time);
            let month = date.getMonth() + 1;
            let day = date.getDate();
            return `${month}月${day}日`;
        },

        // 显示时间、分钟
        getHoursMins (time) {
            let date = new Date(time);
            let hours = date.getHours();
            let mins = date.getMinutes();
            hours = hours > 9 ? hours : '0' + hours;
            mins = mins > 9 ? mins : '0' + mins;
            return `${hours}:${mins}`;
        },

        // 查询乐疯抢有效板块列表
        async quryLimitPlateByChannel () {
            try {
                let productModel = new ProductModel();
                let ret = await productModel.quryLimitPlateByChannel();
                let data = ret['data']['result_rows'];
                this.eventId = data['config']['event_id'];
                let eventPlate = data['event_detail']['plate'] || {};
                let {now, next, next2} = eventPlate;
                // 获取当前板块ID
                this.nowPlateId = now['plate_id'];
                // 显示所有板块
                if (this.showAllPlate) {
                    this.plateList = eventPlate['plate_list'];
                } else {
                    this.plateList = [now, next, next2];
                }
                // 获取当前的乐疯抢商品列表
                this.queryRecommendSkuList();
            } catch (err) {
                this.$toast(err);
            }
        },

        // 根据板块ID查询乐疯抢商品列表
        async queryRecommendSkuList (palteId = '') {
            try {
                let productModel = new ProductModel();
                let ret = await productModel.queryRecommendSkuList(this.eventId, this.getChannelType, palteId, this.limit, this.offset);
                this.productList = ret['data']['result_rows']['goods'] || [];
                // 不是当前板块写进缓存里
                if (palteId !== this.nowPlateId) {
                    this.cacheProductList[palteId] = this.productList;
                }
            } catch (err) {
                this.$toast(err);
            }
        },

        setProductList (palteId) {
            if (this.cacheProductList[palteId] && palteId !== this.nowPlateId) {
                // 缓存里面取商品列表
                this.productList = this.cacheProductList[palteId];
            } else {
                this.queryRecommendSkuList(palteId);
            }
        },

        // 把根据板块ID查询商品列表功能透传给插槽
        querySkuList (palteId) {
            return this.setProductList(palteId);
        },

        // 跳转到商品详情页面
        getProductDetailUrl (type, skuId) {
            // 修改cookie里的ei
            Cookie.set('ei', `EVE${Cookie.get('event_id')}_${this.pid}`, {
                domain: 'fenqile.com',
                path: '/'
            });

            switch (type) {
            // 游戏会员
                case 800:
                    this.$href(`${location.protocol}//chong.m.fenqile.com/game/charge/${skuId}.html`);
                    break;
                    // 话费流量
                case 900:
                    this.$href(`${location.protocol}//chong.m.fenqile.com/phone/charge.html`);
                    break;
                default:
                    this.$href(`${location.protocol}//item.m.fenqile.com/${skuId}.html`);
            }
        },

        // 把跳转到商品详情页面功能透传给插槽
        goDetail (type, skuId) {
            return this.getProductDetailUrl(type, skuId);
        }
    },

    created () {
        this.quryLimitPlateByChannel();
    }
};

export default ProductBase;

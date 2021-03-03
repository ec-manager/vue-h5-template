/**
 * @name [拉取乐疯抢活动商品基类]
 * @author [yosezheng]
 * @description [拉取乐疯抢2.0活动商品都继承这个基类]
 * @class ProductBase
 */

import Cookie from 'js-cookie';
import ProductModel from '@/model/ProductModel';
const productModel = new ProductModel();

const ProductBase = {
    props: {
        // 需要查询的板块类型
        channelTypeList: {
            type: Array,
            default: () => [0, 1]
        },
        // 请求后台商品数量，默认20条
        limit: {
            type: Number,
            default: 20
        },
        // 分页起始位置，默认从0开始
        offset: {
            type: Number,
            default: 0
        },
        // 经前端截取后展示的商品数量
        showSkuLimit: Number,
        // 是否过滤库存为0的sku
        hasFilterProduct: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        // 处理后的商品列表数据
        getProductList () {
            if (this.hasFilterProduct) {
                // 返回库存大于0的商品
                return this.productList.filter(item => {
                    return item.active_info && item.active_info.active_left_num;
                }).slice(0, this.showSkuLimit);
            } else {
                return this.productList.slice(0, this.showSkuLimit);
            }
        }
    },

    data () {
        return {
            // 当前点击的按钮type，由于后台延迟过高，导致异步加载完成后会覆盖当前type商品，需要做纪录
            tapPlateType: this.channelTypeList[0],
            // 板块列表
            plateList: [],
            // 展示的商品列表
            productList: [],
            // 缓存商品列表
            cacheProductList: {}
        };
    },

    methods: {
        // 边界情况，当前场次倒计时为0时，需要重新请求所有版块场次和商品
        reset () {
            this.tapPlateType = this.channelTypeList[0];
            this.plateList = [];
            this.productList = [];
            this.cacheProductList = {};
            this.queryChannelTitle();
        },

        // 查询板块场次
        async queryChannelTitle () {
            let promise = this.channelTypeList.map(type => productModel.queryChannelTitle(type));

            try {
                let plateList = await Promise.all(promise);
                this.plateList = plateList.map((item, index) => Object.assign({}, item.data.result_rows, { type: this.channelTypeList[index] }));

                // 查询第一个type商品列表
                let firstPlateId = this.plateList[0].plate_id;
                // 这里的权重排序不知道咋整，先写死
                this.queryHappySkuList(firstPlateId, 3, this.channelTypeList[0]);
            } catch (err) {
                this.$toast(err);
            }
        },

        // 根据板块ID查询乐疯抢商品列表
        async queryHappySkuList (palteId = '', weight = 3, type) {
            try {
                let ret = await productModel.queryHappySkuList(palteId, weight, this.offset, this.limit);
                this.cacheProductList[palteId] = ret.data.result_rows || [];

                // 请求type与当前点击type一致，才替换商品
                if (this.tapPlateType === type) {
                    this.productList = this.cacheProductList[palteId]; 
                }
            } catch (err) {
                this.$toast(err);
            }
        },

        async queryPlateInfo (palteId, type, weight) {
            // 纪录当前点击type
            this.tapPlateType = type;

            // 当日板块，重新获取距离结束时间
            // 假如组件并没有展示当日乐疯抢，则不需要任何重置操作（自定义channelTypeList，例如直接展示的第二天预告）
            if (type === 0 && this.plateList[0].type === 0) {
                let channelTitle = await productModel.queryChannelTitle(0);
                this.plateList[0].end_time = channelTitle.data.result_rows.end_time;
            }

            if (!this.cacheProductList[palteId]) {
                this.queryHappySkuList(palteId, weight, type);
            } else if (type === 0) {
                // 接口延时过高，先拿缓存的商品进行展示
                this.productList = this.cacheProductList[palteId];
                this.queryHappySkuList(palteId, weight, type);
            } else {
                this.productList = this.cacheProductList[palteId];
            }
        },

        // 重置所有数据
        resetData () {
            return this.reset();
        },

        // 根据板块ID查询商品列表功能透传给插槽
        queryPlate (palteId, type, weight) {
            return this.queryPlateInfo(palteId, type, weight);
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
        this.queryChannelTitle();
    }
};

export default ProductBase;

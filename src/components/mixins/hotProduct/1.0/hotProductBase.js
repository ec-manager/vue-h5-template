/**
 * @name [拉取热销类目排行榜单商品基类]
 * @author [beginning]
 * @description [拉取热销类目排行榜单商品都继承这个基类]
 * @class ProductBase
 */

import Cookie from 'js-cookie';
import ProductModel from '@/model/ProductModel';
const ProductBase = {
    props: {
        // 拉取商品条数
        limit: {
            type: Number,
            default: 10
        },
        // 类目ID列表
        categoryList: {
            type: Array,
            required: true
        }
    },

    data () {
        return {
            // 商品信息
            productInfo: {}
        };
    },

    computed: {
        getCategoryIds () {
            return this.categoryList.map((item, index) => {
                return {
                    id: item.id,
                    level: item.level,
                    key: 'list' + index
                };
            });
        }
    },

    methods: {
        // 根据类目ID查询热销商品列表
        async getSkuRankBatch () {
            try {
                let productModel = new ProductModel();
                let ret = await productModel.getSkuRankBatch(this.getCategoryIds, this.limit);
                this.productInfo = ret['data']['result_rows'];
            } catch (err) {
                this.$toast(err);
            }
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
    }
};

export default ProductBase;

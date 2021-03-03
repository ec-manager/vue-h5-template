/**
 * @name [活动基类]
 * @author [beginning]
 * @description [默认所有商品组件都继承这个基类]
 * @class ProductBase
 */

import Cookie from 'js-cookie';
import ProductModel from '@/model/ProductModel';
const ProductBase = {
    props: {
        // 板块id
        pid: {
            type: String,
            default: ''
        },
        // 板块下sku数量
        skuNum: {
            type: Number,
            default: 0
        },
        /*
         * 显示额外商品信息，用四位二进制数来表示，第一位表示是否拉取优惠券信息，第二位表示是否展示评论信息，第三位和第四位预留
         * 默认为0：不展示额外信息 1：拉取优惠券信息 2：展示评论信息 3：拉取优惠券信息和展示评论信息
         */
        type: {
            type: [Number, String],
            default: 0
        },
        // 活动类型，1：普通活动，2：特卖活动，11：普通乐黑卡，21：特卖乐黑卡
        eventType: {
            type: Number,
            default: 1,
            validator (value) {
                return [1, 2, 11, 21].indexOf(value) >= 0;
            }
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
        // 获取商品信息
        getProductParams () {
            let productParams = {};
            this.skuList.forEach(item => {
                productParams[item.skuId] = item.realAmount;
            });
            return productParams;
        }
    },

    data () {
        return {
            // sku列表
            skuList: [],
            // 商品数据是否加载完成
            isFinshed: false,
            // 额外的商品信息
            extraInfo: {
                // 商品优惠券信息
                maxDiscount: {},
                // 商品评论信息
                productComment: {},
                // 新人免息期数
                newFreeFqNum: {}
            }
        };
    },

    methods: {
        // 获取商品列表信息
        async getProductList () {
            try {
                let productModel = new ProductModel();
                let ret = await productModel.getProductList(this.pid, this.getChannelType, this.eventType);
                this.skuList = ret['data']['result_rows']['skuList'];
                this.isFinshed = true;
                // 显示优惠券信息
                if (this.getValueAtBit(this.type, 1) === 1) {
                    this.getMaxDiscount();
                }

                // 显示商品评论信息
                if (this.getValueAtBit(this.type, 2) === 1) {
                    this.getProductComment(this.skuList.map(item => item.productId));
                }

                // 显示新人免息期数
                if (this.getValueAtBit(this.type, 3) === 1) {
                    this.getNewFreeFqNum(this.skuList.map(item => item.skuId));
                }

                // 获取商品定金信息
                if (this.getValueAtBit(this.type, 4) === 1) {
                    this.getProductOrder(this.skuList.map(item => item.skuId));
                }

                // 曝光sku列表
                this.$report.initParamsFunc({
                    onlyReportEcr: 1,
                    skuList: this.skuList.map(item => item.skuId)
                });
            } catch (err) {
                this.isFinshed = true;
                this.$toast(err);
            }
        },

        // 跳转到商品详情页面
        getProductDetailUrl (type, skuId) {
            // 当板块id存在的时候，修改cookie里的ei
            if (this.pid) {
                Cookie.set(
                    'ei',
                    `EVE${Cookie.get('event_id')}_${this.pid}`,
                    {
                        domain: 'fenqile.com',
                        path: '/'
                    }
                );
            }

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

        // 获取sku对应的优惠力度最大的优惠券信息
        async getMaxDiscount () {
            try {
                let productModel = new ProductModel();
                let ret = await productModel.getMaxDiscount(this.getChannelType * 1000, this.getProductParams);
                this.$set(this.extraInfo, 'maxDiscount', ret['data']['result_rows']);
            } catch (err) {
                this.$toast(err);
            }
        },

        // 获取商品评论信息
        async getProductComment (productList) {
            try {
                let productModel = new ProductModel();
                let ret = await productModel.getProductComment(productList);
                this.$set(this.extraInfo, 'productComment', ret['data']['result_rows']);
            } catch (err) {
                this.$toast(err);
            }
        },

        // 新人免息期数
        async getNewFreeFqNum (productList) {
            try {
                let productModel = new ProductModel();
                let ret = await productModel.getNewFreeFqNum(productList, this.getChannelType);
                this.$set(this.extraInfo, 'newFreeFqNum', ret['data']['result_rows']);
            } catch (err) {
                this.$toast(err);
            }
        },

        // 获取商品定金预售信息
        async getProductOrder (skuIdList) {
            try {
                let productModel = new ProductModel();
                let ret = await productModel.getProductOrder(skuIdList, this.getChannelType);
                this.$set(this.extraInfo, 'productOrder', ret['data']['result_rows']);
            } catch (err) {
                this.$toast(err);
            }
        },

        // 获取二进制数据中的某一位
        getValueAtBit (num, bit) {
            return (parseInt(num) >> (bit - 1)) & 1;
        },

        // 商品加入购物车
        async addShopCart (addItemList, channelType, sceneType) {
            try {
                let productModel = new ProductModel();
                await productModel.addShopCart(addItemList, channelType, sceneType);
                // 加入购物车成功后回调
                this.$emit('success', addItemList);
            } catch (err) {
                this.$toast(err);
            }
        },

        // 点击商品加入购物车
        handleAddCart (skuId, amount, buyQuantity) {
            let addItem = {
                amount,
                sku_id: skuId,
                buy_quantity: buyQuantity
            };
            this.addShopCart([addItem], this.getChannelType, 1);
        },

        // 加入购物车功能穿透给插槽
        addCart (skuId, amount, buyQuantity) {
            return this.handleAddCart(skuId, amount, buyQuantity);
        }
    }
};

export default ProductBase;

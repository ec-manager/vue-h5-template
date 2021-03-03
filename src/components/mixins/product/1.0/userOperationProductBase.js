/**
 * @name [用户运营商品类]
 * @author [melody]
 * @description [默认所有商品组件都继承这个基类]
 * 主要改造type 入参
 * @class ProductBase
 */
import ProductModel from '@/model/ProductModel';
import M_WX from 'weixin-js-sdk';
import Base from './productBase.js';

const ProductBase = {
    extends: Base,
    props: {
        isSaleNew: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        // 获取平台类型
        getChannelType () {
            if (this.isInMp) {
                return 4;
            }
            const ua = navigator.userAgent.toLowerCase();
            const isApp = /fenqile_(ios|android)_(\d{1,}\.\d{1,}\.\d{1,})/i;
            const isWeb = /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i;
            return isApp.test(ua) ? 2 : isWeb.test(ua) ? 3 : 1;
        },
        isInMp () {
            M_WX.miniProgram.getEnv((res) => {
                if (res.miniprogram) {
                    return true;
                } else {
                    return false;
                }
            });
        }
    },

    data () {
        return {
            // 额外的商品信息
            extraInfo: {
                // 商品优惠券信息
                maxDiscount: {},
                // 商品评论信息
                productComment: {},
                // 新人免息期数
                newFreeFqNum: {},
                // 爆款到手价
                popularInfo: {},
                // 会员价相关
                vipInfo: {}
            }
        };
    },

    methods: {
        // 元转分
        yuanToCent (val) {
            return val * 100;
        },
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

                // 获取到手价
                if (this.getValueAtBit(this.type, 5) === 1) {
                    this.getPopToHandAmount(this.skuList.map(item => {
                        return {
                            skuId: item.skuId,
                            realAmount: this.isSaleNew && item.newUserAmount > -1 ? item.newUserAmount : item.realAmount
                        };
                    }));
                }

                // 获取vip信息
                if (this.getValueAtBit(this.type, 6) === 1) {
                    this.getVipProInfo(this.skuList.map(item => {
                        return {
                            skuId: item.skuId,
                            realAmount: this.isSaleNew && item.newUserAmount > -1 ? this.yuanToCent(item.newUserAmount) : this.yuanToCent(item.realAmount)
                        };
                    }));
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

        // 爆款页商品券后价
        async getPopToHandAmount (skuInfoList) {
            try {
                let productModel = new ProductModel();
                let ret = await productModel.getPopToHandAmount(skuInfoList);
                this.$set(this.extraInfo, 'popularInfo', ret['data']['result_rows']);
            } catch (err) {
                this.$toast(err);
            }
        },

        // 获取vip 特权价格等
        async getVipProInfo (skuInfoList) {
            try {
                let productModel = new ProductModel();
                let ret = await productModel.getVipProInfo(skuInfoList);
                this.$set(this.extraInfo, 'vipInfo', ret['data']['result_rows']);
            } catch (err) {
                this.$toast(err);
            }
        }
    }
};

export default ProductBase;

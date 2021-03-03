<template>
    <product
        :cols="options.cols || 1"
        :event-type="11"
        :type="1"
        :pid="options.plate_id"
        :skuNum="getSkuNum[options.plate_id] || 1"
        class="product-hot">
        <template slot="default" slot-scope="slot">
            <span class="leka-info" v-if="slot.product.blackInfo && !!slot.product.blackInfo.maxFreeNum">{{slot.product.blackInfo.maxFreeNum}}期免息</span>
            <div class="pro-img">
                <img v-lazy="slot.product.goodsImg" class="imgauto">
            </div>
            <div class="coupon-info" v-if="slot.extraInfo.maxDiscount[slot.product.skuId] && !tool.isEmptyObject(slot.extraInfo.maxDiscount[slot.product.skuId])">{{ slot.extraInfo.maxDiscount[slot.product.skuId].tps_name }}</div>
            <div>
                <h3 class="pro-name">{{slot.product.goodsName}}</h3>
                <p class="pro-desc">{{slot.product.goodsDesc}}</p>
                <div class="pro-price">
                    <span class="mon-pay">月供:&yen;<span class="num">{{slot.product.monPay}}</span>起</span>
                    <span class="mart-amount" v-if="slot.product.martAmount > slot.product.realAmount">&yen;{{slot.product.martAmount}}</span>
                </div>
                <div class="pro-btm">
                    <div class="price-info">{{slot.product.customLabelOne ? slot.product.customLabelOne : (configTips ? configTips : '')}}
                    &yen;<span class="num">
                    <template v-if="palteGoodsProperty.palteGoodsProperty === 1">{{slot.product.realAmount}}</template>
                    <template v-else-if="palteGoodsProperty.palteGoodsProperty === 2">{{slot.product.activeInfo.activeAmount ? slot.product.activeInfo.activeAmount : slot.product.realAmount}}</template>
                    <template v-else>{{slot.product.realAmount}}</template>
                    </span></div>
                    <div class="pro-btn">立即加购</div>
                </div>
            </div>
        </template>
    </product>
</template>
<script>
/**
 * @author melody
 * @des 6周年 爆款sku，支持1列、2列、3列
 * @params options：楼层配置
 * @params getSkuNum：sku数量
 * @params configTips：促销标签
 * @params plateList: 板块列表
 */
import Tool from '@/mod/util/tool/1.0/tool.js';

import Product from '@/mod/render/product/h5/1.0/index.vue';
export default {
    name: 'productHot',
    components: {
        Product
    },
    computed: {
        palteGoodsProperty () {
            let plateInfo = {};
            this.plateList.forEach(item => {
                if (item.plateId === this.options.plate_id) {
                    plateInfo = item;
                }
            });
            return plateInfo;
        }
    },
    props: {
        options: {
            type: Object,
            default: () => {}
        },
        getSkuNum: {
            type: Object,
            default: () => {}
        },
        configTips: {
            type: String,
            default: ''
        },
        plateList: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            tool: Tool
        };
    }
};
</script>
<style lang="less" scoped>
@import '~@/inc/sales/style/mixin/fn.less';
@import '../style/common.less';

.product-hot {
    /deep/ .sales-pro.sales-one-pro,
    /deep/ .sales-pro.sales-two-pro,
    /deep/ .sales-pro.sales-three-pro {
        padding: 0 12px/@p;
        .sales-pro-list {
            margin-right: -3px/@p;
            margin-left: -3px/@p;
            .sales-pro-item {
                a {
                    position: relative;
                    display: block;
                    box-sizing: border-box;
                    background: #fff;
                }
            }
        }
        // 优惠券tag
        .coupon-info {
            position: absolute;
            z-index: 4;
            padding: 0 20px/@p;
            height: 40px/@p;
            border-radius: 0 10px/@p 10px/@p 0;
            background-color: rgba(234,21,52,.9);
            color: #fff;
            text-align: center;
            font-size: 24px/@p;
            line-height: 40px/@p;
        }
        // 商品图
        .pro-img {
            margin-right: auto;
            margin-left: auto;
            width: 200px/@p;
            height: 200px/@p;
        }
        // 商品名
        .pro-name {
            width: 100%;
            font-weight: 700;
            font-size: 26px/@p;
            line-height: 1.2;

            .text-of();
        }
        // 商品描述
        .pro-desc {
            margin-top: 15px/@p;
            width: 100%;
            height: 64px/@p;
            color: #3a3935;
            font-size: 24px/@p;
            line-height: 32px/@p;

            .text-of-more(2);
        }
        // 价格
        .pro-price {
            margin-top: 22px/@p;
            // 月供
            .mon-pay {
                font-size: 22px/@p;
                .num {
                    font-size: 27px/@p;
                }
            }
            // 原价
            .mart-amount {
                margin-left: 20px/@p;
                color: #8d8d8d;
                text-decoration: line-through;
                font-size: 22px/@p;
            }
        }
        // 底部
        .pro-btm {
            position: relative;
            box-sizing: border-box;
            margin-top: 15px/@p;
            border-radius: 10px/@p;
            text-align: center;
            font-size: 20px/@p;

            .flex(vm);
            .num {
                font-size: 30px/@p;
            }
            .price-info {
                box-sizing: border-box;
                height: 56px/@p;
                line-height: 56px/@p;
            }
            // 按钮
            .pro-btn {
                height: 56px/@p;
                text-align: center;
                font-size: 24px/@p;
                line-height: 56px/@p;
            }
        }
    }

    /* 一行一个商品 */
    /deep/ .sales-pro.sales-one-pro {
        .sales-pro-list {
            margin: 0;
            .sales-pro-item {
                padding: 0;
                width: 100%;
                &:nth-child(n+2) {
                    margin-top: 6px/@p;
                }
                a {
                    padding: 38px/@p 38px/@p 38px/@p 276px/@p;
                    min-height: 276px/@p;
                }
                .pro-img {
                    position: absolute;
                    top: 55px/@p;
                    left: 38px/@p;
                    z-index: 2;
                }
                .coupon-info {
                    top: 225px/@p;
                    left: 0;
                }
                .pro-btm {
                    height: 56px/@p;
                    .price-info {
                        .fx(1);
                    }
                    .pro-btn {
                        width: 140px/@p;
                        border-radius: 0 10px/@p 10px/@p 0;
                    }
                }
            }
        }
    }
    /* 一行两个商品 */
    /deep/ .sales-pro.sales-two-pro {
        .sales-pro-list {
            .sales-pro-item {
                box-sizing: border-box;
                padding: 0 3px/@p;
                width: 50%;
                &:nth-child(n+3) {
                    margin-top: 6px/@p;
                }
                a {
                    padding: 20px/@p;
                }
                .coupon-info {
                    top: 185px/@p;
                    left: 0;
                }
                .pro-name {
                    margin-top: 14px/@p;
                }
                .pro-btm {
                    width: 100%;

                    .flex(v, vm);
                    .price-info {
                        width: 100%;
                    }
                    .pro-btn {
                        width: 100%;
                    }
                }
            }
        }
    }
    // 1行3列
    /deep/ .sales-pro.sales-three-pro {
        .sales-pro-list {
            .sales-pro-item {
                box-sizing: border-box;
                padding: 0 3px/@p;
                width: 33.33%;
                &:nth-child(n+4) {
                    margin-top: 6px/@p;
                }
                a {
                    padding: 15px/@p;
                }
                .coupon-info {
                    top: 175px/@p;
                    left: 0;
                }
                .pro-name {
                    margin-top: 15px/@p;
                }
                .pro-price {
                    .flex(v);
                    .mart-amount {
                        margin-top: 5px/@p;
                        margin-left: 0;
                    }
                }
                .pro-btm {
                    .flex(v, vm);
                    .price-info {
                        width: 100%;
                    }
                    .pro-btn {
                        width: 100%;
                    }
                }
            }
        }
    }
}
</style>

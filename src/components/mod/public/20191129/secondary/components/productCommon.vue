<template>
    <product
        :cols="options.cols"
        :event-type="11"
        :pid="options.plate_id"
        :skuNum="getSkuNum[options.plate_id] || 1"
        :class="['product-common', 'product-common-'+options.cols]">
        <template slot="default" slot-scope="slot">
            <div class="leka-info" v-if="slot.product.blackInfo && slot.product.blackInfo.maxFreeNum">{{slot.product.blackInfo.maxFreeNum}}期免息</div>
            <div class="pro-img">
                <img v-lazy="slot.product.goodsImg" class="imgauto">
            </div>
            <template v-if="configTips && !tool.isEmptyObject(slot.product.activeInfo)">
                <template v-if="slot.product.customLabelOne">
                    <div class="coupon-info">{{slot.product.customLabelOne}}&yen;{{slot.product.activeInfo.activeAmount}}</div>
                </template>
                <template v-else-if="configTips">
                    <div class="coupon-info">{{configTips}}&yen;{{slot.product.activeInfo.activeAmount}}</div>
                </template>
            </template>
            <template v-else-if="slot.product.customLabelTwo">
                <div class="coupon-info">{{slot.product.customLabelTwo}}</div>
            </template>
            <div>
                <h3 class="pro-name">{{slot.product.goodsName}}</h3>
                <div class="pro-price">
                    <span class="real-amount">&yen;<span class="amount">{{slot.product.realAmount}}</span></span>
                    <span class="mart-amount" v-if="slot.product.martAmount > slot.product.realAmount">&yen;{{slot.product.martAmount}}</span>
                </div>
                <div class="mon-pay">
                    月供：&yen;<span class="num">{{slot.product.monPay}}</span>起
                </div>
            </div>
        </template>
    </product>
</template>
<script>
/**
 * @author melody
 * @des 双11 普通sku，列数只支持2或3
 * @params options：楼层配置
 * @params getSkuNum：sku数量
 * @params configTips：促销标签
 */
import Tool from '@/mod/util/tool/1.0/tool.js';

import Product from '@/mod/render/product/h5/1.0/index.vue';
export default {
    name: 'productCommon',
    components: {
        Product
    },
    computed: {},
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

.product-common {
    /deep/ .sales-two-pro {
        .sales-pro-list {
            .sales-pro-item {
                &:nth-child(n+3) {
                    margin-top: 6px/@p;
                }
            }
        }
    }
    /deep/ .sales-three-pro {
        .sales-pro-list {
            .sales-pro-item {
                &:nth-child(n+4) {
                    margin-top: 6px/@p;
                }
            }
        }
    }
}

.product-common {
    /deep/ .sales-pro.sales-two-pro,
    /deep/ .sales-pro.sales-three-pro {
        padding: 0 12px/@p;
        .sales-pro-list {
            margin: 0 -3px/@p;
            padding: 0;
            .sales-pro-item {
                box-sizing: border-box;
                padding: 0 3px/@p;
                a {
                    position: relative;
                    display: block;
                    padding: 60px/@p 10px/@p 15px/@p 10px/@p;
                    background-color: #fff;
                }
            }
        }
        .pro-img {
            margin: 0 auto;
            width: 180px/@p;
            height: 180px/@p;
        }
        .pro-name {
            margin-top: 30px/@p;
            height: 64px/@p;
            color: #4f4f4f;
            font-size: 26px/@p;
            line-height: 32px/@p;

            .text-of-more(2);
        }
        .pro-price {
            margin-top: 15px/@p;
            .flex(ac, jsb);
            .real-amount {
                color: #000;
                font-size: 20px/@p;
                .fx(1);
                .amount {
                    font-size: 26px/@p;
                }
            }
            .mart-amount {
                .fx(1);
                color: #a4a4a4;
                text-decoration: line-through;
                text-align: right;
                font-size: 20px/@p;
            }
        }
        .coupon-info {
            position: absolute;
            top: 207px/@p;
            left: 10px/@p;
            z-index: 4;
            padding: 0 20px/@p;
            height: 40px/@p;
            border-radius: 0 10px/@p 10px/@p 0;
            color: #fff;
            text-align: center;
            font-size: 20px/@p;
            line-height: 40px/@p;
        }
        .mon-pay {
            margin-top: 10px/@p;
            height: 45px/@p;
            border-radius: 5px/@p;
            color: #fff;
            text-align: center;
            font-size: 20px/@p;
            line-height: 45px/@p;
            .num {
                font-size: 32px/@p;
            }
        }
    }
}
</style>

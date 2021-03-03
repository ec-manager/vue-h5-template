<template>
    <product
        :cols="options.cols || 3"
        :pid="options.plate_id"
        :skuNum="getSkuNum[options.plate_id] || 3"
        :wrapClass="'product-tps-' + options.cols"
        :event-type="11"
        :type="1">
        <template slot="default" slot-scope="slot">
            <div class="leka-info" v-if="slot.product.blackInfo && slot.product.blackInfo.maxFreeNum">{{slot.product.blackInfo.maxFreeNum}}期免息</div>
            <div class="coupon-info" v-if="slot.extraInfo.maxDiscount[slot.product.skuId] && !tool.isEmptyObject(slot.extraInfo.maxDiscount[slot.product.skuId])">{{ slot.extraInfo.maxDiscount[slot.product.skuId].tps_name }}</div>
            <div class="pro-img">
                <img v-lazy="slot.product.goodsImg" class="imgauto">
            </div>
            <h3 class="pro-name">{{slot.product.goodsName}}</h3>
            <div class="pro-price">
                <div class="real-amount">&yen;<span class="num">{{slot.product.realAmount}}</span></div>
                <span class="mart-amount" v-if="slot.product.martAmount > slot.product.realAmount">&yen;{{slot.product.martAmount}}</span>
            </div>
        </template>
    </product>
</template>
<script>
/**
 * @author melody
 * @des 双11含优惠券信息 商品组件，只支持2列、3列
 * @params options：楼层配置
 * @params getSkuNum：板块sku数量
 */
import Tool from '@/mod/util/tool/1.0/tool.js';

import Product from '@/mod/render/product/h5/1.0/index.vue';
export default {
    name: 'productTps',
    components: {
        Product
    },
    computed: {},
    props: {
        options: {
            type: Object,
            default: () => {
                return {};
            }
        },
        getSkuNum: {
            type: Object,
            default: () => {
                return {};
            }
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
// 1行2列和1行3列公用样式
/deep/ .product-tps-2,
/deep/ .product-tps-3 {
    padding: 0 12px/@p;
    .sales-pro-list {
        margin: 0 -3px/@P;
        width: 100%;
        overflow: hidden;
        .sales-pro-item {
            box-sizing: border-box;
            padding: 0 3px/@p;
            a {
                position: relative;
                display: block;
                padding: 79px/@p 22px/@p 22px/@p 22px/@p;
                background: #fff;
            }
        }
    }
    // 商品图片
    .pro-img {
        margin: 0 auto;
        width: 180px/@p;
        height: 180px/@P;
    }
    // 优惠券信息
    .coupon-info {
        position: absolute;
        top: 230px/@p;
        left: 0;
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
    // 商品名
    .pro-name {
        margin-top: 20px/@p;
        height: 64px/@p;
        color: #454545;
        font-weight: 700;
        font-size: 24px/@p;
        line-height: 32px/@p;

        .text-of-more(2);
    }
    // 商品价格
    .pro-price {
        margin-top: 26px/@p;

        .flex(jsb);
        // 价格
        .real-amount {
            white-space: nowrap;
            font-weight: 400;
            font-size: 20px/@p;
            .num {
                font-weight: 700;
                font-size: 30px/@p;
            }
        }
        // 原价
        .mart-amount {
            padding-top: 4px/@P;
            color: #454545;
            text-align: right;
            white-space: nowrap;
            font-size: 20px/@p;
        }
    }
}

// 1行2列
/deep/ .product-tps-2 {
    .sales-pro-item {
        &:nth-child(n+3) {
            margin-top: 6px/@p;
        }
    }
}
// 1行3列
/deep/ .product-tps-3 {
    .sales-pro-item {
        &:nth-child(n+4) {
            margin-top: 6px/@p;
        }
    }
}

</style>

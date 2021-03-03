<template>
    <swiper-product
        :pid="options.plate_id"
        :sku-num="getSkuNum[options.plate_id] || 1"
        :event-type="11"
        class="product-common-more">
        <template slot="default" slot-scope="slot">
            <div class="leka-info" v-if="slot.product.blackInfo && slot.product.blackInfo.maxFreeNum">{{slot.product.blackInfo.maxFreeNum}}期免息</div>
            <div class="pro-img">
                <img v-lazy="slot.product.goodsImg" class="imgauto">
            </div>
            <template v-if="configTips && slot.product.activeInfo">
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
                    <span class="real-amount">&yen;<span class="num">{{slot.product.realAmount}}</span></span>
                    <span class="mart-amount" v-if="slot.product.martAmount > slot.product.realAmount">&yen;{{slot.product.martAmount}}</span>
                </div>
                <div class="mon-pay">
                    月供:&yen;<span class="num">{{slot.product.monPay}}</span>起
                </div>
            </div>
        </template>
    </swiper-product>
</template>
<script>
/**
 * @author melody
 * @des 6周年1行多列商品组件
 * @params options：楼层配置
 * @params getSkuNum：板块sku数量
 * @params configTips：促销tag
 */
import Product from '@/mod/render/product/h5/1.0/index.vue';
import SwiperProduct from '@/mod/render/swiperProduct/h5/1.0/index.vue';
export default {
    name: 'productSwiper',
    components: {
        Product,
        SwiperProduct
    },
    props: {
        // 精选大牌
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
    }
};
</script>
<style lang="less" scoped>
@import '~@/inc/sales/style/mixin/fn.less';
@import '../style/common.less';

.product-common-more {
    /deep/ .sales-more-pro {
        overflow: hidden;
        padding-left: 12px/@p;
        padding-right: 12px/@p;
        .sales-pro-list {
            padding: 0;
            .swiper-wrapper {
                .sales-pro-item.swiper-pro-item {
                    box-sizing: border-box;
                    padding: 0;
                    width: 40%;
                    a {
                        position: relative;
                        display: block;
                        padding: 60px/@p 10px/@p 15px/@p 10px/@p;
                        background-color: #fff;
                    }
                }
            }
        }
        // 商品图
        .pro-img {
            margin: 0 auto;
            width: 180px/@p;
            height: 180px/@p;
        }
        // 商品名
        .pro-name {
            margin-top: 30px/@p;
            height: 68px/@p;
            color: #4f4f4f;
            font-size: 26px/@p;
            line-height: 34px/@p;

            .text-of-more(2);
        }
        // 商品价格
        .pro-price {
            margin-top: 15px/@p;
            .flex(ac, jsb);
            .real-amount {
                .fx(1);
                color: #000;
                font-size: 20px/@p;
                .num {
                    font-size: 26px/@p;
                }
            }
            .mart-amount {
                .fx(1);
                text-align: right;
                color: #a4a4a4;
                text-decoration: line-through;
                font-size: 20px/@p;
            }
        }
        // 优惠券信息
        .coupon-info {
            position: absolute;
            top: 207px/@p;
            left: 10px/@p;
            z-index: 4;
            padding: 0 20px/@p;
            height: 40px/@p;
            border-radius: 0 10px/@p 10px/@p 0;
            background-color: rgba(234,21,52,.9);
            color: #fff;
            text-align: center;
            font-size: 20px/@p;
            line-height: 40px/@p;
        }
        // 月供
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

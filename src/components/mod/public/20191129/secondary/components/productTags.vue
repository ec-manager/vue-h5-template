<template>
    <div>
        <product
            :cols="options.cols || 3"
            :event-type="11"
            :pid="options.plate_id"
            :skuNUm="getSkuNum[options.plate_id] || 3"
            class="product-tags">
            <template slot="default" slot-scope="slot">
                <div class="leka-info" v-if="slot.product.blackInfo && slot.product.blackInfo.maxFreeNum">{{slot.product.blackInfo.maxFreeNum}}期免息</div>
                <div class="pro-img img-link-wrap">
                    <img v-lazy="slot.product.goodsImg" class="imgauto">
                </div>
                <h3 class="pro-name">{{slot.product.goodsName}}</h3>
                <div class="pro-tags">
                    <span v-for="(i,k) in slot.product.skuLabelList" :key="k">
                        {{i.text_single}}
                    </span>
                </div>
                <div class="pro-price">
                    &yen;<span class="num">
                    <!-- 单品促销 -->
                    <template v-if="palteGoodsProperty.palteGoodsProperty === 1">{{slot.product.realAmount}}</template>
                    <!-- 秒杀 -->
                    <template v-else-if="palteGoodsProperty.palteGoodsProperty === 2">{{slot.product.activeInfo.activeAmount ? slot.product.activeInfo.activeAmount : slot.product.realAmount}}</template>
                    <template v-else>{{slot.product.realAmount}}</template>
                    </span>
                </div>
                <div class="price-info" >
                    <span class="mon-pay">&yen;{{slot.product.monPay}}</span>X{{slot.product.fqNum}}期
                </div>
            </template>
        </product>
    </div>
</template>
<script>
/**
 * @author melody
 * @des 双11含label list 商品组件，只支持2列、3列
 * @params options：楼层配置
 * @params getSkuNum：板块sku数量
 * @params configTips：促销tag
 * @params plateList：板块列表
 */
import Product from '@/mod/render/product/h5/1.0/index.vue';
export default {
    name: 'productTags',
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
    }
};
</script>
<style lang="less" scoped>
@import '~@/inc/sales/style/mixin/fn.less';
@import '../style/common.less';

/* 热卖大牌 */
/deep/ .product-tags {
    .sales-pro {
        .pro-wrap {
            position: relative;
            padding: 45px/@p 10px/@p 17px/@p;
        }
    }
    // 商品名
    .pro-name {
        margin-top: 4px/@p;
        height: 64px/@p;
        color: #474747;
        font-size: 24px/@p;
        line-height: 32px/@p;

        .text-of-more(2);
    }
    // 标签
    .pro-tags {
        margin-top: 15px/@P;
        height: 23px/@p;
        span {
            display: inline-block;
            margin-right: 5px/@p;
            padding: 0 3px/@p;
            height: 23px/@p;
            border-radius: 3px/@p;
            font-size: 20px/@p;
            line-height: 23px/@p;
            &:last-child {
                margin-right: 0;
            }
        }
    }
    // 商品价格
    .pro-price {
        margin-top: 12px/@P;
        color: #000;
        font-size: 20px/@p;
        .num {
            margin-left: 2px;
            font-size: 30px/@p;
        }
    }
    // 价格信息
    .price-info {
        margin-top: 10px/@p;
        font-size: 22px/@p;
        // 月供
        .mon-pay {
            margin-right: 6px/@p;
            font-size: 26px/@p;
        }
    }
    // 1行2列+1行3列共用样式
    .sales-pro.sales-two-pro ,
    .sales-pro.sales-three-pro {
        padding: 0 12px/@p;
        .sales-pro-list {
            margin: 0 -3px/@p;
        }
        .sales-pro-item {
            padding: 0 3px/@p;
            &:nth-child(n+4) {
                margin-top: 6px/@p;
            }
        }
    }
    // 1行两列
    .sales-pro.sales-two-pro {
        .pro-wrap {
            padding-left: 15px/@p;
            padding-right: 15px/@p;
        }
        .pro-img {
            height: 260px/@p;
        }
    }
    // 1行3列
    .sales-pro.sales-three-pro {
        .pro-img {
            height: 180px/@p;
        }
    }
}
</style>

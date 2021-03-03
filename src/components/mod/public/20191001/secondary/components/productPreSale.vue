<template>
    <product
        :cols="cols || 3"
        :pid="pid"
        :skuNum="skuNum"
        :type="8"
        :class="['pro-cols-' + cols, 'product-pre-sale']">
        <template slot="default" slot-scope="slot">
            <div class="pro-img-wrap">
                <img v-lazy="slot.product.goodsImg" class="imgauto">
                <span class="pre-sale-tag" v-if="slot.extraInfo.productOrder && !!getPreSaleInfo(slot, 'pre_sale_price')">{{getPreSaleInfo(slot, 'activity_inventory') - getPreSaleInfo(slot, 'current_inventory') + baseSold(slot) > 0 ? '已预售' + (getPreSaleInfo(slot, 'activity_inventory') - getPreSaleInfo(slot, 'current_inventory') + baseSold(slot)) + '件' : '火爆预售中'}}</span>
            </div>
            <div class="pro-info-btm">
                <h3 class="pro-name">{{slot.product.goodsName}}</h3>
                <div class="ft-info-wrap" :class="!!getPreSaleInfo(slot, 'pre_sale_price') ? '' : 'no-pre'">
                    <p class="pro-price" v-if="slot.extraInfo.productOrder && !!getPreSaleInfo(slot, 'pre_sale_price')">预售价<span class="per">&yen;</span><span class="price" >{{getPreSaleInfo(slot, 'pre_sale_price')}}</span></p>
                    <p class="pro-price" v-else><span class="per">&yen;</span><span class="price">{{slot.product.realAmount}}</span></p>
                    <div class="pre-sale-info" v-if="slot.extraInfo.productOrder && !!getPreSaleInfo(slot, 'deposit_amount') && !!getPreSaleInfo(slot, 'deduction_amount')">
                        <span class="info-deposit info">定金{{getPreSaleInfo(slot, 'deposit_amount')}}</span>
                        <span class="info-deduction info">抵{{getPreSaleInfo(slot, 'deduction_amount')}}</span>
                    </div>
                    <div class="pre-sale-info" v-else>
                        <span class="info info-deduction">月供 &yen;<span class="price">{{slot.product.monPay}}</span> 起</span>
                    </div>
                </div>
            </div>
        </template>
    </product>
</template>
<script>
import Product from '@/mod/render/product/h5/1.0/index.vue';
/**
 * @author melody
 * @des 6周年预售商品组件
 * @params pid：板块id
 * @params skuNum：板块sku数量
 * @params cols：列数，当前仅支持3或2，表示1行3列或1行2列
 */
export default {
    name: 'productPreSale',
    components: {
        Product
    },
    props: {
        pid: {
            type: String,
            default: ''
        },
        skuNum: {
            type: Number,
            default: 1
        },
        cols: {
            type: Number,
            default: 3
        }
    },
    methods: {
        getPreSaleInfo (slot, key) {
            if (slot && slot.extraInfo.productOrder && slot.extraInfo.productOrder[slot.product.skuId]) {
                return slot.extraInfo.productOrder[slot.product.skuId][key];
            }
        },
        baseSold (slot) {
            let num = 0;
            if (slot && slot.product && !!slot.product.customLabelOne) {
                num = +slot.product.customLabelOne;
            }
            return num;
        }
    }
};
</script>
<style lang="less" scoped>
@import '~@/inc/sales/style/mixin/fn.less';
// 公用样式
.product-pre-sale {
    /deep/.sales-pro.sales-two-pro ,
    /deep/.sales-pro.sales-three-pro {
        padding: 0 12px/@p;
        .sales-pro-list {
            margin-left: -3px/@p;
            margin-right: -3px/@p;
        }
    }
}

// 图片
.pro-img-wrap {
    position: relative;
    box-sizing: border-box;
    .pre-sale-tag {
        position: absolute;
        bottom: 0;
        left: 0;
        padding: 0 19px/@p 0 14px/@p;
        max-width: 80%;
        height: 36px/@p;
        border-radius: 0 18px/@p 18px/@p 0;
        background-color: #ff6c3f;
        color: #fff;
        font-size: 20px/@p;
        line-height: 36px/@p;
        .text-of();
    }
}
// 底部信息
.pro-info-btm {
    // 商品名
    .pro-name {
        color: #393b3e;
        word-break: break-all;

        .text-of-more(2);
    }
    // 商品价格
    .pro-price {
        color: #f8023c;
        word-break: break-all;
        font-size: 20px/@p;

        .text-of();
        .per {
            font-weight: 500;
            font-size: 24px/@p;
        }
        .price {
            font-weight: 500;
            font-size: 36px/@p;
        }
    }
    // 预售信息
    .pre-sale-info {
        text-align: center;
        font-size: 22px/@p;
        .info {
            word-break: break-all;

            .text-of();
        }
        .info-deposit {
            box-sizing: border-box;
            border: 2px/@p solid #f8023c;
            color: #f8023c;;
        }
        .info-deduction {
            background: #f8023c;
            color: #fff;
        }
    }
}
// 1行3列
.pro-cols-3 {
    // 图片
    .pro-img-wrap {
        padding: 22px/@p 22px/@p 0;
        height: 212px/@p;
        img {
            height: 190px/@p;
        }
    }
    .pro-info-btm {
        padding: 10px/@p 0 10px/@p;
        .pro-name {
            margin: 0 19px/@p;
            height: 60px/@p;
            font-size: 22px/@p;
            line-height: 30px/@p;
        }
        .pro-price {
            margin: 18px/@p 19px/@p 0;
        }
        .pre-sale-info {
            margin: 12px/@p 10px/@p 0;
            height: 42px/@p;

            .flex(h, ac, jc);
            .info {
                height: 100%;

                .fx(1);
            }
            .info-deposit {
                border-radius: 5px/@p 0 0 5px/@p;
                line-height: 38px/@p;
            }
            .info-deduction {
                line-height: 40px/@p;
            }
        }
    }
}
// 1行2列
.pro-cols-2 {
    // 图片
    .pro-img-wrap {
        padding: 20px/@p 0;
        height: 290px/@p;
        img {
            height: 270px/@p;
        }
    }
    .pro-info-btm {
        padding: 18px/@p 20px/@p 22px/@p;
        .pro-name {
            height: 68px/@p;
            font-size: 24px/@p;
            line-height: 34px/@p;
        }
        .ft-info-wrap {
            margin-top: 15px/@p;
            height: 84px/@p;

            .flex(h, ac, jsb);
            &.no-pre {
                .flex(v);
                .pro-price {
                    width: 100%;
                }
                .pre-sale-info {
                    width: 100%;
                    .info {
                        width: 100%;
                    }
                }
            }
        }
        .pro-price {
            .fx(1);
        }
        .pre-sale-info {
            .flex(v, ac, jc);

            .info {
                width: 110px/@p;
                height: 42px/@p;
            }
            .info-deposit {
                border-radius: 5px/@p 5px/@p 0 0;
                line-height: 38px/@p;
            }

            .info-deduction {
                line-height: 40px/@p;
            }
        }
    }
}

</style>

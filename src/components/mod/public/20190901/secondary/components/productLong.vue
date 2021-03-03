<template>
    <product :cols="options.css || 3" :pid="options.plate_id" :skuNum="getSkuNum[options.plate_id] || 3" wrapClass="pro-row-three" :event-type="11" :type="1">
        <template slot="default" slot-scope="slot">
            <div class="leka-i" v-if="slot.product.blackInfo && slot.product.blackInfo.maxFreeNum">
                <div class="hk-ico"></div><template v-if="slot.product.blackInfo.maxFreeNum">{{slot.product.blackInfo.maxFreeNum}}期免息</template>				
            </div>
            <div class="quan-info" v-if="!isEmptyObejct(slot.extraInfo.maxDiscount[slot.product.skuId])">{{ slot.extraInfo.maxDiscount[slot.product.skuId].tps_name }}</div>
            <div class="pro-img">
                <img v-lazy="slot.product.goodsImg" class="imgauto">
            </div>
            <h3 class="title">{{slot.product.goodsName}}</h3>
            <div class="price-d">
                <div class="amount">&yen;<strong>{{slot.product.realAmount}}</strong></div>
                <div class="mon-pay">
                    <del v-if="slot.product.martAmount > slot.product.realAmount">&yen;{{slot.product.martAmount}}</del>
                </div>
            </div>
        </template>
    </product>
</template>
<style lang="less" scoped>
@import "../../../../../inc/sales/style/mixin/fn.less";
@p: 75px/1rem;
@P: 75px/1rem;
/deep/.pro-row-three{
    .sales-pro-list{
        padding:0 0;
        margin: 0 -5px/@P;
        .sales-pro-item{
            box-sizing: border-box;
            padding:0 5px/@p;
            a{
                display:block;
                background:#fff;
                padding:79px/@p 22px/@p 22px/@p 22px/@p;
                margin-top:10px/@p;
                position:relative;
                .tag-i{
                    position:absolute;
                    font-size:20px/@p;
                    color:#fff;
                    border-radius: 5px/@p 0 25px/@p 0;
                    background:#ecaf44;
                    left:0;
                    top:0;
                    line-height:40px/@p;
                    padding:0 10px/@p;
                }
                .pro-img{
                    width: 180px/@p;
                    height: 180px/@P;
                    margin: 0 auto;
                }
            }
        }
    }
}
.quan-info{
    text-align: center;
    color: #fff;
    font-size: 24px/@p;
    position: absolute;
    z-index: 4;
    height: 40px/@p;
    line-height: 40px/@p;
    background-color:rgba(234,21,52,0.9);
    border-radius: 0 10px/@p 10px/@p 0;
    left:0;
    top:230px/@p;
    padding:0 20px/@p;
}
.pro-row-three{
    .title{
        margin-top:20px/@p;
        color:#454545;
        .text-of-more(2);
        font-size:24px/@p;
        line-height:32px/@p;
        height:64px/@p;
        font-weight:700;
        color:#454545;
    }
    .price-d{
        margin-top:26px/@p;
        .flex(jsb);
        .amount{
            white-space: nowrap;
            color:#df5748;
            font-size:30px/@p;
            font-weight:700;
            em{
                font-size:20px/@p;
                font-weight:400;
            }
        }
        .mon-pay{
            white-space: nowrap;
            text-align:right;
            font-size:20px/@p;
            color:#454545;
            padding-top:4px/@P;
        }
    }
}
</style>
<script>
import Product from '@/mod/render/product/h5/1.0/index.vue';
export default {
    name: 'product-long',
    components: {
        Product
    },
    computed: {},
    props: {
        // 精选大牌
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
    methods: {
        isEmptyObejct (obj) {
            if (!obj) {
                return true;
            }
            return JSON.stringify(obj) === '{}';
        }
    },
    data () {
        return {};
    }
};
</script>

<template>
    <div>
        <product :cols="options.css || 3" :event-type="11" :pid="options['plate_id']" :skuNUm="getSkuNum[options['plate_id']] || 3" class="select-product">
            <template slot="default" slot-scope="slot">
                <div class="leka-i" v-if="slot.product.blackInfo && slot.product.blackInfo.maxFreeNum">
                    <div class="hk-ico"></div><template v-if="slot.product.blackInfo.maxFreeNum">{{slot.product.blackInfo.maxFreeNum}}期免息</template>
                </div>
                <div class="pro-img">
                    <img v-lazy="slot.product.goodsImg" class="imgauto">
                </div>
                <div>
                    <h3 class="title">{{slot.product.goodsName}}</h3>
                    <div class="price-f">
                        <span v-for="(i,k) in slot.product.skuLabelList" :key="k">
                            {{i.text_single}}
                        </span>
                    </div>
                    <div class="price-b">
                        {{slot.product.customLabelOne ? slot.product.customLabelOne : (configTips ? configTips : '')}}
                        &yen;<strong>
                        <template v-if="palteGoodsProperty.palteGoodsProperty === 1">{{slot.product.realAmount}}</template>
                        <template v-else-if="palteGoodsProperty.palteGoodsProperty === 2">{{slot.product.activeInfo.activeAmount ? slot.product.activeInfo.activeAmount : slot.product.realAmount}}</template>
                        <template v-else>{{slot.product.realAmount}}</template>
                        </strong>
                    </div>
                    <div class="price-c" >
                        <strong>&yen;{{slot.product.monPay}}</strong>X{{slot.product.fqNum}}期
                    </div>
                </div>
            </template>
        </product>
    </div>
</template>
<style lang="less" scoped>
@import "../../../../../inc/sales/style/mixin/fn.less";
@p: 75px/1rem;
@P: 75px/1rem;
/* 热卖大牌 */
/deep/.select-product{
    margin-top: 10px/@p;
    .sales-pro.sales-three-pro{
        padding:0 10px/@p;
        .sales-pro-list{
            margin: 0 -5px/@p;
        }
        .sales-pro-item{
            padding:0 5px/@p;
            &:nth-child(n+4){
                margin-top: 10px/@p;
            }
        }
    }
    .sales-pro .pro-wrap{
        position: relative;
        padding:45px/@p 10px/@p 17px/@p;
        .title{
            margin-top: 4px/@p;
            .text-of-more(2);
            font-size:24px/@p;
            line-height:28px/@p;
            height:56px/@p;
            color:#000000;
        }
    }
    .price-b{
        margin-top: 12px/@P;
        color:#000000;
        font-size: 20px/@p;
        strong{
            font-size: 30px/@p;
            margin-left: 2px;
        }
    }
    .price-c{
        margin-top: 10px/@p;
        color: #4576d0;
        font-size: 22px/@p;
        strong{
            font-size: 26px/@p;
            margin-right: 6px/@p;
        }
    }
    .price-f{
        margin-top: 15px/@P;
        height: 23px/@p;
        span{
            border:1px solid #4576d0;
            display: inline-block;
            height: 23px/@p;
            line-height: 23px/@p;
            margin-right: 5px/@p;
            border-radius: 3px/@p;
            padding:0 3px/@p;
            color: #4576d0;
            font-size: 20px/@p;
            &:last-child{margin-right: 0;}
        }
    }
}
</style>
<script>
import Product from '@/mod/render/product/h5/1.0/index.vue';
export default {
    name: 'product-other',
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
        },
        configTips: {
            type: String,
            default: ''
        },
        plateList: {
            type: Array,
            default: () => {
                return [];
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

<template>
    <product :cols="1" :event-type="11" :type="1" :pid="options.plate_id" :skuNum="getSkuNum[options.plate_id] || 1" wrapClass="pro-row-three">
        <template slot="default" slot-scope="slot">
            <div class="leka-i" v-if="slot.product.blackInfo && slot.product.blackInfo.maxFreeNum">
                <div class="hk-ico"></div><template v-if="slot.product.blackInfo.maxFreeNum">{{slot.product.blackInfo.maxFreeNum}}期免息</template>
            </div>
            <div class="pro-img">
                <img v-lazy="slot.product.goodsImg" class="imgauto">
            </div>
            <div class="quan-info" v-if="!isEmptyObejct(slot.extraInfo.maxDiscount[slot.product.skuId])">{{ slot.extraInfo.maxDiscount[slot.product.skuId].tps_name }}</div>
            <div>
                <h3 class="title">{{slot.product.goodsName}}</h3>
                <p class="desc">{{slot.product.goodsDesc}}</p>
                <div class="price-d">
                    <span>月供:&yen;<strong>{{slot.product.monPay}}</strong>起</span>
                    <del v-if="slot.product.martAmount > slot.product.realAmount">&yen;{{slot.product.martAmount}}</del>
                </div>
                <div class="price-a">
                    {{slot.product.customLabelOne ? slot.product.customLabelOne : (configTips ? configTips : '')}}
                    &yen;<strong>
                    <template v-if="palteGoodsProperty.palteGoodsProperty === 1">{{slot.product.realAmount}}</template>
                    <template v-else-if="palteGoodsProperty.palteGoodsProperty === 2">{{slot.product.activeInfo.activeAmount ? slot.product.activeInfo.activeAmount : slot.product.realAmount}}</template>
                    <template v-else>{{slot.product.realAmount}}</template>
                    </strong>
                    <div class="text-a">立即加购</div>
                </div>
            </div>
        </template>
    </product>
</template>
<style lang="less" scoped>
@import "../../../../../inc/sales/style/mixin/fn.less";
@p: 75px/1rem;
@P: 75px/1rem;

/* 一行一个商品 */
/deep/.sales-one-pro{
    margin-top: 10px/@p;
    .sales-pro-list{
        padding:0 10px/@p;
        .sales-pro-item{
            width: 100%;
            padding:0;
            &:nth-child(n+2){
                margin-top: 10px/@p;
            }
            a{
                background:#fff;
                padding:38px/@p 38px/@p;
                padding-left: 276px/@p;
                position:relative;
                min-height: 276px/@p;
                border-radius: 0;
                box-sizing: border-box;
                display: block;
                .leka-i{
                    z-index: 3;
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
        top:225px/@p;
        padding:0 20px/@p;
    }
    .pro-img{
        width: 200px/@p;
        height: 200px/@p;
        position: absolute;
        top:55px/@p;
        left:38px/@p;
        z-index: 2;
    }
    .title{
        .text-of();
        font-size:26px/@p;
        line-height:1.2;
        font-weight:700;
        color:#5753c8;
        width: 100%;
    }
    .desc{
        margin-top:15px/@p;
        color:#3a3935;
        .text-of-more(2);
        font-size:24px/@p;
        line-height:32px/@p;
        height:64px/@p;
        width: 100%;
    }
    .price-a{
        margin-top: 15px/@p;
        border-radius: 10px/@p;
        position: relative;
        border:1px solid #746dff;
        color: #746dff;
        font-size: 20px/@p;
        height: 56px/@p;
        box-sizing: border-box;
        padding-right: 140px/@p;
        .flex(vm);
        strong{
            font-size: 30px/@p;
        }
        .text-a{
            font-size: 24px/@p;
            background-color: #746dff;
            color: #fff;
            position: absolute;
            right: -1px;
            top: -1px;
            height: 56px/@p;
            line-height: 56px/@p;
            text-align: center;
            border-radius:0 10px/@p 10px/@p 0;
            width: 140px/@p;
        }
    }
    .price-d{
        margin-top: 22px/@p;
        span{
            color:#5753c8;
            font-size: 22px/@p;
            strong{
                font-size: 27px/@p;
            }
        }
        del{
            margin-left: 20px/@p;
            text-decoration: line-through;
            color: #8d8d8d;
            font-size: 22px/@p;
        }
    }
}
</style>
<script>
import Product from '@/mod/render/product/h5/1.0/index.vue';
export default {
    name: 'product-normal',
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

<template>
    <swiper-product :pid="options.plate_id" :sku-num="getSkuNum[options.plate_id] || 1" :event-type="11" :type="1">
        <template slot="default" slot-scope="slot">
            <div class="leka-i" v-if="slot.product.blackInfo && slot.product.blackInfo.maxFreeNum">
                <div class="hk-ico"></div><template v-if="slot.product.blackInfo.maxFreeNum">{{slot.product.blackInfo.maxFreeNum}}期免息</template>
            </div>
            <div class="pro-img">
                <img v-lazy="slot.product.goodsImg" class="imgauto">
            </div>
            <template v-if="configTips && slot.product.activeInfo">
                <template v-if="slot.product.customLabelOne">
                    <div class="quan-info">{{slot.product.customLabelOne}}&yen;{{slot.product.activeInfo.activeAmount}}</div>
                </template>
                <template v-else-if="configTips">
                    <div class="quan-info">{{configTips}}&yen;{{slot.product.activeInfo.activeAmount}}</div>
                </template>
            </template>
            <template v-else-if="slot.product.customLabelTwo">
                <div class="quan-info">{{customLabelTwo}}</div>
            </template>
            <div>
                <h3 class="title">{{slot.product.goodsName}}</h3>
                <div class="price-d">
                    <span>&yen;<strong>{{slot.product.realAmount}}</strong></span>
                    <del v-if="slot.product.martAmount > slot.product.realAmount">&yen;{{slot.product.martAmount}}</del>
                </div>
                <div class="price-a">
                    月供:&yen;<strong>{{slot.product.monPay}}</strong>起
                </div>
            </div>
        </template>
    </swiper-product>

</template>
<style lang="less" scoped>
@import "../../../../../inc/sales/style/mixin/fn.less";
@p: 75px/1rem;
@P: 75px/1rem;
/deep/.sales-two-pro,
/deep/.sales-three-pro,
/deep/.sales-more-pro{
    margin-top: 10px/@p;
    padding:0 10px/@p;
    .sales-pro-list{
        margin:0 -5px/@p;
        padding:0;
        .sales-pro-item{
            padding:0 5px/@p;
            box-sizing: border-box;
            a{
                background-color: #fff;
                padding:60px/@p 10px/@p 15px/@p 10px/@p;
                display: block;
                position: relative;
                .title{
                    margin-top:30px/@p;
                    color:#4f4f4f;
                    .text-of-more(2);
                    font-size:26px/@p;
                    line-height:32px/@p;
                    height:64px/@p;
                }
                .price-d{
                    .fn-clear();
                    margin-top: 15px/@p;
                    span{
                        float: left;
                        color:#000000;
                        font-size: 20px/@p;
                        strong{
                            font-size: 26px/@p;
                        }
                    }
                    del{
                        float:right;
                        text-decoration: line-through;
                        color: #a4a4a4;
                        font-size: 20px/@p;
                    }
                }
                .quan-info{
                    text-align: center;
                    color: #fff;
                    font-size: 20px/@p;
                    position: absolute;
                    z-index: 4;
                    height: 40px/@p;
                    line-height: 40px/@p;
                    background-color:rgba(234,21,52,0.9);
                    border-radius: 0 10px/@p 10px/@p 0;
                    left:10px/@p;
                    top:207px/@p;
                    padding:0 20px/@p;
                }
                .price-a{
                    margin-top: 10px/@p;
                    border-radius: 5px/@p;
                    height: 45px/@p;
                    line-height: 45px/@p;
                    text-align: center;
                    color: #fff;
                    font-size: 20px/@p;
                    background-color: #746dff;
                    strong{
                        font-size: 32px/@p;
                    }
                }
            }
        }
    }
    .pro-img{
        width: 180px/@p;
        height: 180px/@p;
        margin: 0 auto;
    }
}
/deep/.sales-more-pro{
    margin-top: 0;
    overflow: hidden;
    padding: 10px/@p 0;
        .sales-pro-list{
            /deep/.swiper-wrapper{
                .sales-pro-item.swiper-pro-item{width:40%;margin-left: 0;}
        }
    }

}
</style>
<script>
import Product from '@/mod/render/product/h5/1.0/index.vue';
import SwiperProduct from '@/mod/render/swiperProduct/h5/1.0/index.vue';
export default {
    name: 'product-diy',
    components: {
        Product,
        SwiperProduct
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
        },
        configTips: {
            type: String,
            default: ''
        }
    },
    methods: {},
    data () {
        return {};
    }
};
</script>

<template>
    <swiper-product :pid="parames.plate_id" :skuNum="skuNum" wrapClass="swiper-newer-pro" :eventType="11" v-if="isNewer">
        <template slot="default" slot-scope="item">
            <div class="pro-img">
                <div class="square">
                    <img v-lazy="item.product.goodsImg">
                </div>
                <p class="lehei-tag" v-if="item.product.blackInfo && item.product.blackInfo.maxFreeNum">
                    <span class="lh-icon"></span>
                    <span>{{item.product.blackInfo.maxFreeNum}}期免息</span>
                </p>
                <div v-if="item.product.activeInfo" class="pro-tag-radius" :style="{color: parames.tag_color, backgroundColor: parames.tag_bg}"><span>新人价</span><strong><em>&yen;</em>{{item.product.activeInfo.activeAmount}}</strong></div>
            </div>
            <div class="pro-btm">
                <h3 class="pro-tit">{{item.product.goodsName}}</h3>
                <!-- <div class="price">
                    <div class="mon-pay" :style="{color: parames.mon_pay_color}">月供 &yen;<span>{{item.product.monPay}}</span> 起</div>
                    <div class="mart-amount" v-if="item.product.martAmount > item.product.realAmount">&yen;{{item.product.martAmount | toInt}}</div>
                </div> -->
                <div class="pro-btn"
                    :style="{color: parames.btn_color, backgroundColor: parames.btn_bg}">月供 &yen;<span>{{item.product.monPay}}</span> 起</div>
            </div>
        </template>
    </swiper-product>
</template>

<script>
import Tool from '@/mod/util/tool/1.0/tool.js';
import SwiperProduct from '@/mod/render/swiperProduct/h5/1.0/index.vue';

export default {
    name: 'newer-product',
    components: {
        SwiperProduct
    },
    filters: {
        // 市场价取整
        toInt (value) {
            return ~~value;
        }
    },
    props: {
        parames: {
            type: Object,
            default: () => {}
        },
        skuNum: {
            type: Number,
            default: 3
        },
        isNewer: {
            type: Boolean,
            default: false
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
@import "~@/inc/sales/style/mixin/fn.less";

/* 商品方形占位框 */
.square{
    position: relative;
    padding-bottom: 100%;
    >img{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        margin: auto;
    }
}

/deep/.swiper-newer-pro {
    .pro-wrap {
        display: block;
        background-color: #fff;
    }
    .swiper-pro-item {
        width: 40%;
        &:nth-child(n+2){
            margin-left: 2px;
        }
        .lehei-tag{
            position: absolute;
            top: 0;
            left: 0;
            max-width: 80%;
            padding-left: 0.13333333rem;
            padding-right: 0.24rem;
            font-size: 10px;
            line-height: 16px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #424242;
            border-bottom-right-radius: 8px;
            background-image: -webkit-gradient(linear, left top, left bottom, from(#ffd1a6), to(#ffe8c2));
        }
        .lh-icon{
            content: '';
            display: inline-block;
            width: 11px;
            height: 7px;
            /* 注意这里不是less，所以图片不会被自动编译加后缀，需手动修改 */
            background-image: url(../img/lehei.png);
            background-size: cover;
        }
        .pro-img{
            position: relative;
            padding: 0.46666667rem 0.46666667rem 0.26666667rem;
        }
        .pro-tag-radius{
            position: absolute;
            right: 0.32rem;
            bottom: 0.2rem;
            z-index: 1;
            .flex(v);
            .flex(vm);
            width: 114px/@P;
            height: 114px/@P;
            line-height: 1.2;

            letter-spacing: 2px;
            border-radius: 50%;
            text-align: center;
            span{
                font-size: 18px/@p;
            }
            strong{
                font-size: 28px/@p;
                em{font-size: 18px/@p;}
            }
            // transform: rotate(-15deg);
        }
        .pro-btm{padding: 0 0.2rem 0.2rem;}
        .pro-tit{
            // margin-bottom: 2px;
            // font-size: 12px;
            // color: #7b7b7b;
            // word-break: break-all;
            // overflow: hidden;
            // text-overflow: ellipsis;
            // white-space: nowrap;

            color: #5e5e5e;
            font-size: 24px/@p;
            word-break: break-all;
            line-height: 1.3;
            height: 62.4px/@p;
            .text-of-more(2);
        }
        .price{
            display: -webkit-box;
            -webkit-box-pack: justify;
            -webkit-box-align: end;
            height: 14px;
        }
        .mon-pay{
            font-size: 10px;
            font-weight: 700;
            > span{
                font-size: 12px;
                font-weight: 700;
            }
        }
        .mart-amount{
            color: #c4c4c4;
            font-size: 10px;
            text-decoration: line-through;
        }
        .pro-btn{
            margin-top: 5px;
            font-size: 12px;
            font-weight: 700;
            line-height: 26px;
            text-align: center;
            > span{
                font-size: 14px;
            }
        }
    }
}
</style>

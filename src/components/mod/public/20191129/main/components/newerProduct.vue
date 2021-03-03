<template>
    <swiper-product :pid="parames.plate_id" :skuNum="skuNum" wrapClass="swiper-newer-pro" class="newer-pro-wrap" :eventType="11" :style="{background: parames.bg_color, border: borderColor}" v-if="isNewer">
        <template slot="default" slot-scope="item">
            <div class="pro-img">
                <div class="square">
                    <img v-lazy="item.product.goodsImg">
                </div>
                <span class="leka-info" v-if="item.product.blackInfo && !!item.product.blackInfo.maxFreeNum">{{item.product.blackInfo.maxFreeNum}}期免息</span>
            </div>
            <div class="pro-btm">
                <div class="pro-tag-radius">
                    <template v-if="!tool.isEmptyObject(item.product.activeInfo)">
                        <span class="tag" :style="{color: parames.tag_color, backgroundColor: parames.btn_bg}">新人价</span>
                        <span class="amount">&yen;{{item.product.activeInfo.activeAmount}}</span>
                    </template>
                </div>
                <h3 class="pro-tit">{{item.product.goodsName}}</h3>
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
    },
    computed: {
        borderColor () {
            return '0.08rem solid ' + this.parames.border_color;
        }
    }
};
</script>

<style lang="less" scoped>
@import '~@/inc/sales/style/mixin/fn.less';
@import '~@/mod/public/20191129/secondary/style/common.less';

/* 商品方形占位框 */
.square {
    position: relative;
    padding-bottom: 100%;
    > img {
        position: absolute;
        top: 0;
        left: 0;
        margin: auto;
        width: 100%;
        height: 100%;
    }
}

.newer-pro-wrap {
    border-radius: 10px/@p;
    overflow: hidden;
}

/deep/ .swiper-newer-pro {
    padding: 30px/@p;
    .pro-wrap {
        display: block;
        background-color: #fff;
    }
    .swiper-pro-item {
        width: 230px/@p;
        border-radius: 10px/@p;
        &:nth-child(n+2) {
            margin-left: 20px/@p;
        }
        .pro-img {
            position: relative;
            padding: 35px/@p 25px/@p 20px/@p;
        }
        .pro-tag-radius {
            margin-top: 13px/@p;
            .flex(h, jc);
            height: 30px/@p;
            .tag {
                width: 80px/@P;
                height: 30px/@P;
                border-radius: 5px/@p;
                letter-spacing: 2px;
                font-size: 20px/@p;
                .flex(vm);
            }
            .amount {
                font-size: 30px/@p;
                color: #2e2e2e;
                margin-left: 18px/@p;
            }
        }
        .pro-btm {
            padding: 0 15px/@p 15px/@p;
        }
        .pro-tit {
            color: #5e5e5e;
            word-break: break-all;
            font-size: 24px/@p;
            line-height: 32px/@p;
            height: 64px/@p;

            .text-of-more(2);
            margin-top: 10px/@p;
        }
        .price {
            display: -webkit-box;
            height: 14px;

            -webkit-box-pack: justify;
            -webkit-box-align: end;
        }
        .mon-pay {
            font-weight: 700;
            font-size: 10px;
            > span {
                font-weight: 700;
                font-size: 12px;
            }
        }
        .mart-amount {
            color: #c4c4c4;
            text-decoration: line-through;
            font-size: 10px;
        }
        .pro-btn {
            margin-top: 5px;
            text-align: center;
            font-weight: 700;
            font-size: 12px;
            line-height: 26px;
            > span {
                font-size: 14px;
            }
        }
    }
}

</style>

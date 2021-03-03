<template>
    <section class="pad" v-if="options['is_show']">
        <global-title :options="options"></global-title>
        <div class="big-killer">
            <tab v-model="currentIndex" :head-list="options['headList']">
                <tab-pane :index="index" v-for="(item, index) in options['headList']" :key="item.pid">
                    <swiper-skill-product :pid="item.pid" :event-type="11" :sku-num="getSkuNum[item.pid] || 3">
                        <template slot="default" slot-scope="item">
                            <div class="leka-i" v-if="item.product.blackInfo && item.product.blackInfo.maxFreeNum">
                                <div class="hk-ico"></div>
                                <template v-if="item.product.blackInfo.maxFreeNum">
                                {{item.product.blackInfo.maxFreeNum}}期免息
                                </template>
                            </div>
                            <div class="kill-ico" v-if="item.product.activeInfo.activeAmount">
                                <div>秒杀价</div>
                                <div>&yen;<strong>{{item.product.activeInfo.activeAmount}}</strong></div>
                            </div>
                            <div class="pro-img">
                                <img v-lazy="item.product.goodsImg" class="imgauto">
                            </div>
                            <div class="price-d">
                                <h3 class="title">{{item.product.goodsName}}</h3>
                                <div class="money">
                                    <span>月供&yen;<strong>{{item.product.monPay}}</strong></span>
                                    <del v-if="item.product.martAmount > item.product.realAmount">&yen;{{item.product.martAmount}}</del>
                                </div>
                            </div>
                            <div class="price-a price-a-1" v-if="item.product.activeInfo.activeStatus && item.product.activeInfo.activeStatus === 1">
                                即将开始
                            </div>
                            <div class="price-a price-a-2" v-else-if="item.product.activeInfo.activeStatus && item.product.activeInfo.activeStatus === 2">
                                立即秒杀
                            </div>
                            <div class="price-a price-a-3" v-else>
                                秒杀结束
                            </div>
                        </template>
                    </swiper-skill-product>
                </tab-pane>
            </tab>
        </div>
    </section>
</template>
<style lang="less" scoped>
@import "../../../../../inc/sales/style/mixin/fn.less";
@p: 75px/1rem;
@P: 75px/1rem;
/deep/.big-killer{
    .seckill-more-pro .sales-pro-list .sales-pro-item + .sales-pro-item{
        margin-left: 10px/@p;
    }
    .seckill-more-pro .sales-pro-list{
        padding:0;
    }
    .tab-head .swiper-slide{
        background: #7462ff;
        height: 98px/@p;
        font-size: 26px/@p;
        width: 20%;
    }
    .tab-head .swiper-slide > .title{
        color: #c1dfff;
    }
    .tab-head .swiper-slide.on{
        background: linear-gradient(#e98af8, #b954d3); /* 标准的语法 */
    }
    .tab-pane{
        margin-top: 30px/@p;
    }
    .pro-img{
        width: 180px/@p;
        height: 180px/@p;
        margin: 0 auto;
    }
    .price-d{
        padding-top: 45px/@p;
        .title{
            .text-of-more(2);
            font-size:25px/@p;
            line-height:32px/@p;
            height:64px/@p;
            color:#4f4f4f;
        }
        .money{
            .flex(jsb);
            margin-top: 14px/@p;
            span{
                font-size: 20px/@p;
                color: #ed1c46;
                strong{
                    font-size: 29px/@p;
                }
            }
            del{
                color: #4f4f4f;
                font-size: 24px/@p;
                text-decoration: line-through;
                line-height: 30px/@p;
            }
        }
    }
    .kill-ico{
        width: 92px/@p;
        height: 99px/@p;
        background: url(https://cimg1.fenqile.com/product5/M00/C3/80/LtEHAF1I8X6APdTzAAAJjWKr88o172.png) no-repeat;
        background-size: 100% 100%;
        position: absolute;
        top:143px/@P;
        left: 18px/@p;
        z-index: 3;
        text-align: center;
        font-size: 22px/@p;
        .flex(v);
        .flex(vm);
        color: #fff;
        strong{
            font-size: 28px/@p;
        }
    }
    .price-a{
        height: 45px/@p;
        line-height: 45px/@p;
        text-align: center;
        font-size: 24px/@p;
        border-radius: 5px/@p;
        margin-top: 13px/@p;
    }
    .price-a-1{
        color: #aca1ff;
        background-color: #746dff;
    }
    .price-a-2{
        color: #fff;
        background: linear-gradient(#e889f7, #bb57d4); /* 标准的语法 */
    }
    .price-a-3{
        color: #7462ff;
        background-color: #393693;
    }
    .seckill-pro .pro-wrap{
        padding:60px/@p 25px/@p 13px/@p 25px/@p;
        position: relative;
    }
}
</style>
<script>
import Tool from '@/mod/util/tool/1.0/tool.js';
import Tab from '@/mod/render/tab/h5/1.0/index.vue';
import TabPane from '@/mod/render/tab/h5/1.0/tabPane.vue';
import SwiperSkillProduct from '@/mod/render/swiperSkillProduct/h5/1.0/index.vue';
import GlobalTitle from '@/mod/public/20190901/secondary/components/globalTitle.vue';
/**
 * @author melody
 * @des 19年9月大促大牌秒杀组件
 * @params pid：板块id
 * @params skuNum：板块sku数量
 * @params cols：列数，当前仅支持3或2，表示1行3列或1行2列
 * @params baseSold: 基准已预售件数
 */
export default {
    name: 'big-kill',
    components: {
        Tab,
        TabPane,
        SwiperSkillProduct,
        GlobalTitle
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
        getCurrentIndex () {
            this.options['headList'].forEach((item, index) => {
                if (Tool.isActiveDate(item) === 1) {
                    this.currentIndex = index;
                }
            });
        }
    },
    data () {
        return {
            tool: Tool,
            currentIndex: 0
        };
    },
    created () {
        this.getCurrentIndex();
    }
};
</script>

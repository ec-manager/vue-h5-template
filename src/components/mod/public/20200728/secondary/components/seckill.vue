<template>
    <section class="seckill-section">
        <global-title :options="options"></global-title>
        <div class="seckill-box">
            <tab v-model="currentIndex" :head-list="options.headList">
                <tab-pane
                    v-for="(item, index) in options.headList"
                    :key="item.pid"
                    :index="index"
                    class="tab-pane">
                    <!-- 虚拟商品，eventType传1 -->
                    <swiper-skill-product
                        :pid="item.pid"
                        :event-type="eventType"
                        :sku-num="getSkuNum[item.pid] || 1">
                        <template slot="default" slot-scope="item">
                            <div class="seckill-price" v-if="item.product.activeInfo.activeAmount">
                                <div class="top-info">秒杀价</div>
                                <div class="btm-price">&yen;<span class="amount">{{item.product.activeInfo.activeAmount}}</span></div>
                            </div>
                            <div class="pro-img">
                                <img v-lazy="item.product.goodsImg" class="imgauto">
                            </div>
                            <div class="pro-info-btm">
                                <h3 class="pro-name">{{item.product.goodsName}}</h3>
                                <div class="price-info">
                                    <template v-if="item.product.activeInfo.activeStatus && item.product.activeInfo.activeStatus === 2">
                                    <!-- 秒杀中显示剩余件数和martAmount -->
                                        <span class="left-num color-stress">仅剩{{item.product.activeInfo.activeLeftNum}}件</span>
                                        <span class="mart-amount" v-if="item.product.martAmount > item.product.activeInfo.activeAmount">&yen;{{item.product.martAmount}}</span>
                                    </template>

                                    <template v-else>
                                    <!-- 已秒完和即将开始显示realAmount和限量 -->
                                        <span class="real-amount">&yen;<span class="amount">{{item.product.realAmount}}</span></span>
                                        <span class="limit-num color-stress" v-if="item.product.activeInfo.activeLimitNum">限量{{item.product.activeInfo.activeLimitNum}}个</span>
                                    </template>
                                </div>
                                <div class="pro-btn pre" v-if="item.product.activeInfo.activeStatus && item.product.activeInfo.activeStatus === 1">
                                    即将开始
                                </div>
                                <div class="pro-btn running" v-else-if="item.product.activeInfo.activeStatus && item.product.activeInfo.activeStatus === 2">
                                    立即秒杀
                                </div>
                                <div class="pro-btn out" v-else>
                                    秒杀结束
                                </div>
                            </div>
                        </template>
                    </swiper-skill-product>
                </tab-pane>
            </tab>
        </div>
    </section>
</template>
<script>
/**
 * @author melody
 * @des 双11秒杀组件
 * @params options：楼层配置
 * @params getSkuNum：页面属性
 * @params eventType：接口类型
 */
import Tool from '@/mod/util/tool/1.0/tool.js';
import Tab from '@/mod/render/tab/h5/1.0/index.vue';
import TabPane from '@/mod/render/tab/h5/1.0/tabPane.vue';
import SwiperSkillProduct from '@/mod/render/swiperSkillProduct/h5/1.0/index.vue';
import globalTitle from '@/mod/public/20200217/secondary/components/globalTitle';

export default {
    name: 'seckill',
    components: {
        Tab,
        TabPane,
        SwiperSkillProduct,
        globalTitle
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
        eventType: {
            type: Number,
            default: 1
        }
    },
    methods: {
        getCurrentIndex () {
            this.options['headList'].forEach((item, index) => {
                if (this.tool.isActiveDate(item) === 1) {
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
<style lang="less" scoped>
@import '~@/inc/sales/style/mixin/fn.less';
@import '../style/common.less';
/deep/ .seckill-box {
    .tab-head {
        .swiper-slide {
            width: 20%;
            height: 98px/@p;
            font-size: 26px/@p;
            &.on {
                font-weight: 500;
            }
        }
    }
    .tab-pane {
        margin-top: 30px/@p;
        min-height: 428px/@p;
    }
    // 改写继承样式
    .seckill-more-pro {
        margin-left: 12px/@p;
        margin-right: 12px/@p;
        .sales-pro-list {
            padding: 0;
            .sales-pro-item {
                position: relative;
                height: 428px/@p;
                &.swiper-pro-item {
                    width: 280px/@p;
                }
            }
        }
    }

    // 商品图片
    .pro-img {
        padding: 40px/@p 0;
        img {
            height: 180px/@p;
        }
    }
    // 秒杀价，分会场统一采用同一个样式，包括背景和字颜色等
    .seckill-price {
        position: absolute;
        top: 143px/@P;
        left: 18px/@p;
        z-index: 3;
        width: 107px/@p;
        height: 107px/@p;
        border-radius: 50%;
        background: url(https://cimg1.fenqile.com/product5/M00/C3/80/LtEHAF1I8X6APdTzAAAJjWKr88o172.png) no-repeat;
        background-size: 100% 100%;
        color: #ffd0d8;
        text-align: center;
        font-size: 22px/@p;

        .flex(v, vm);
        .top-info {
            width: 100%;
            word-break: break-all;

            .text-of();
        }
        .btm-price {
            width: 100%;
            color: #fff;
            word-break: break-all;
            font-weight: 500;

            .text-of();
        }
        .amount {
            font-size: 28px/@p;
        }
    }
    // 显示名称和特殊信息
    .pro-info-btm {
        padding: 0 14px/@p 14px/@p;
        .pro-name {
            height: 60px/@p;
            color: #3a3935;
            word-break: break-all;
            font-size: 22px/@p;
            line-height: 30px/@p;

            .text-of-more(2);
        }
    }
    // 区分状态显示的信息
    .price-info {
        margin-top: 6px/@p;
        height: 34px/@p;
        color: #3a3935;
        font-size: 22px/@p;
        .flex(h, jsb, ac);
        // 原价
        .mart-amount {
            color: #787878;
            text-decoration: line-through;
        }
        // 活动价
        .real-amount {
            font-size: 24px/@p;
            .amount {
                font-size: 30px/@p;
            }
        }
    }

    .pro-btn {
        margin-top: 8px/@p;
        height: 50px/@p;
        border-radius: 5px/@p;
        text-align: center;
        font-weight: 500;
        font-size: 24px/@p;
        line-height: 50px/@p;
    }
}

</style>

<template>
    <section class="banner">
        <!-- header[[ -->
        <header class="head" v-if="header.is_show">
            <!-- logo -->
            <div class="fql-logo" v-if="logo.is_show">
                <img v-lazy="tool.addDomain(logo.img)">
            </div>
            <!-- 时间线 -->
            <div class="time-line-box">
                <swiper class="time-line-nav"
                    ref="timeLineSwiper"
                    :options="timeLineOptions"
                    v-if="this.header.time_line.is_show">
                    <swiper-slide v-for="(item, index) of timeLine"
                        :key="index"
                        :class="{on: activeIndex === index}">
                        <div class="date">{{item.date}}</div>
                        <div class="info">{{item.info}}</div>
                    </swiper-slide>
                </swiper>
                <div class="line"></div>
            </div>
            <!-- 活动规则，分会场logo中没有做取消活动规则 -->
            <div class="rule-btn" data-fql-stat="BTN_RULE" @click="togglePopRuleStatus()" v-if="header.is_show_rule">活动规则</div>
        </header>
        <!-- header]] -->

        <!-- banner主图[[ -->
        <template v-for="(item, index) of bannerImgList">
            <img class="covimg imgauto"
                v-lazy="tool.addDomain(item.img)"
                v-if="tool.isActiveDate(item) === 1"
                :style="{height: tool.toRem(item.height)}"
                :key="index">
        </template>
        <!-- banner主图]] -->
    </section>
</template>
<script>
/**
 * @author melody
 * @des 双11顶部banner组件 含logo 时间线 活动规则按钮 banner
 * @params options：楼层配置
 */
import Tool from '@/mod/util/tool/1.0/tool.js';
import { swiper, swiperSlide } from 'vue-awesome-swiper';

export default {
    name: 'headerTop',
    props: {
        options: {
            type: Object,
            default: () => {}
        }
    },
    components: {
        swiper,
        swiperSlide
    },
    data () {
        return {
            tool: Tool,
            activeIndex: 0,
            timeLineOptions: {
                slidesPerView: 'auto'
            }
        };
    },
    computed: {
        header () {
            return this.options.header;
        },
        logo () {
            let logoArr = this.header.logo.filter(item => {
                if (this.tool.isActiveDate(item) === 1) {
                    return item;
                }
            });
            return logoArr[0];
        },
        // 过滤出进行中的和未开始的时间线，已结束的时间线回自动隐藏
        timeLine () {
            let arr = this.header.time_line.list.filter(item => {
                if (this.tool.isActiveDate(item) < 2) {
                    return item;
                }
            });
            return arr;
        },
        bannerImgList () {
            return this.options.banner_img_list;
        }
    },
    methods: {
        // 高亮当前时间轴
        setTimeLine () {
            this.timeLine.forEach((item, index) => {
                if (Tool.isActiveDate(item) === 1) {
                    this.$refs.timeLineSwiper.swiper.slideTo(index, 1000, false);
                    this.activeIndex = index;
                }
            });
        },
        togglePopRuleStatus () {
            this.$emit('togglePopRuleStatus');
        }
    },
    mounted () {
        this.setTimeLine();
        console.log(this.options);
    }
};
</script>
<style lang="less" scoped>
@import '~@/inc/sales/style/mixin/fn.less';
.head {
    overflow: hidden;
    height: 72px/@p;

    .flex(h, ac, jsb);
    // logo
    .fql-logo {
        padding-right: 10px/@p;
        width: 194px/@p;
        height: 100%;
        text-align: center;
        line-height: 72px/@p;

        -webkit-clip-path: polygon(100% 0, 184px/@p 100%, 0 100%, 0 0);
        > img {
            height: 55px/@p;
            vertical-align: middle;
        }
    }
    // 时间线
    // 活动规则按钮
    .rule-btn {
        margin-right: 16px/@p;
        margin-left: 16px/@p;
        width: 130px/@p;
        height: 40px/@p;
        border-radius: 20px/@p;
        text-align: center;
        font-size: 10px;
        line-height: 40px/@p;
    }
    .time-line-box {
        position: relative;
        overflow: hidden;
        height: 100%;
        .fx(1);
    }
    // 时间轴导航
    .time-line-nav {
        position: relative;
        z-index: 2;
        box-sizing: border-box;
        padding: 8px/@p;
        height: 100%;
        font-size: 10px;

        .flex(ac);
        /deep/ .swiper-wrapper {
            height: 100%;
        }
        .swiper-slide {
            position: relative;
            padding: 0 23px/@p;
            text-align: center;

            .flex(jsb, v);
            &::after {
                position: absolute;
                top: 50%;
                left: 50%;
                z-index: 2;
                box-sizing: border-box;
                width: 10px/@p;
                height: 10px/@p;
                border-radius: 50%;
                content: '';
                transform: translate(-50%, -50%);
            }
        }
        .date {
            font-style: italic;
        }
    }
    // 线
    .line {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 2px/@p;
        transform: translate(-50%, -50%);
    }
}

</style>

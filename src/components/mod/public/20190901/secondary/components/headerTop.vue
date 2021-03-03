<template>
    <div class="header-top" v-if="optionsConfig['is_show']">
        <div class="header-logo-bg"></div>
        <div class="header-logo">
            <img class="imgauto" v-lazy="optionsConfig['logo']">
        </div>
        <div class="top-li">
            <div class="line"></div>
            <swiper :options="swiperOption" ref="top-swiper">
                <swiper-slide  v-for="(item,index) in optionsConfig['logo-nav']" :key="index" :class="['ui-li', {'on':topSwiperClass === index}]">
                    <div class="p2" v-html="item.p1"></div>
                    <div class="yuan"></div>
                    <div class="p2" v-html="item.p2"></div>
                </swiper-slide>
            </swiper>
        </div>
        <a href="javascript:;" @click="showRuleLayer" class="btn-rule" v-stat="'BTN_RULE'">活动规则</a>
    </div>
</template>
<style lang="less" scoped>
@import "../../../../../inc/sales/style/mixin/fn.less";
@p: 75px/1rem;
@P: 75px/1rem;

.header-top{
    height: 70px/@p;
    background-color: #423ea8;
    width: 100%;
    overflow: hidden;
    position: relative;
    .header-logo-bg{
        height: 270px/@p;
        width: 210px/@P;
        margin-top: -100px/@P;
        margin-left: -20px/@p;
        background-color: #423ea8;
        background-image: -webkit-linear-gradient(55deg, #423ea8, #5b4ae0); /* Chrome 10-25, iOS 5+, Safari 5.1+ */
        background-image:         linear-gradient(55deg, #423ea8, #5b4ae0); /* Chrome 26, Firefox 16+, IE 10+, Opera */

        -webkit-transform: rotate(15deg);  /* Chrome, Opera 15+, Safari 3.1+ */
      -ms-transform: rotate(15deg);  /* IE 9 */
          transform: rotate(15deg);  /* Firefox 16+, IE 10+, Opera */
    }
    .header-logo{
        position: absolute;
        left: 22px/@p;
        top:50%;
        width: 140px/@p;
        height: 55px/@p;
        margin-top: -27.5px/@p;
    }
    .btn-rule{
        width: 129px/@p;
        height: 40px/@p;
        border-radius: 30px/@p;
        color: #fff;
        text-align: center;
        background-color: #7966ff;
        font-size: 22px/@p;
        line-height: 40px/@p;
        position: absolute;
        top:15px/@p;
        right: 20px/@p;
    }
    .top-li{
        position: absolute;
        top:0px;
        left:242px/@P;
        height: 70px/@p;
        overflow: hidden;
        width: 340px/@p;
        .ui-li{
            text-align: center;
            color: #fff;
            font-size: 20px/@p;
            font-style: italic;
            line-height: 36px/@p;
            position: relative;
            &.on{
                color: #f6ccf2;
                .yuan{
                    border:3px/@p solid #f6ccf2
                }
            }
            .yuan{
                box-sizing: border-box;
                width: 10px/@p;
                height: 10px/@p;
                border-radius: 50%;
                background-color: #fff;
                position: absolute;
                left:50%;
                top: 50%;
                margin-left: -5px/@p;
                margin-top: -5px/@p;
            }
            .p2{
                white-space:nowrap;
            }
        }
        .line{
            height: 3px/@P;
            background-color: #b3b2dc;
            width: 100%;
            position: absolute;
            top:34px/@P;
            left:0px/@P;
        }
    }
}
</style>
<script>
import Tool from '@/mod/util/tool/1.0/tool.js';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
export default {
    name: 'big-kill',
    components: {
        swiper,
        swiperSlide
    },
    computed: {},
    props: {
        // 精选大牌
        optionsConfig: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    methods: {
        gettopSwiperIndex () {
            this.optionsConfig['logo-nav'].forEach((item, index) => {
                if (Tool.isActiveDate(item) === 1) {
                    this.$refs['top-swiper'].swiper.slideTo(index, 1000, false);
                    this.topSwiperClass = index;
                }
            });
        },
        showRuleLayer () {
            this.$emit('showRuleLayer');
        }
    },
    data () {
        return {
            tool: Tool,
            topSwiperClass: 0,
            swiperOption: {
                slidesPerView: 2
            }
        };
    },
    created () {},
    mounted () {
        this.gettopSwiperIndex();
    }
};
</script>

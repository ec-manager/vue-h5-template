<template>
    <div class="bubble-swiper" :style="{top: tool.toRem(options.height)}">
        <!-- swiper -->
        <swiper :options="swiperOption" class="swiper-wrap">
            <swiper-slide v-for="(item, index) in showList" :key="index+item.link" :style="{
                background:`rgba(${options.r}, ${options.g}, ${options.b},${options.percent})`}">
                <a v-href="item.link" class="bubble" v-stat="'BTN_BUBBLE'+ index" :style={color:options.textColor}>
                    <span class="text">{{item.title}}</span>
                    <span class="text">{{item.subhead}}</span>
                </a>
            </swiper-slide>
        </swiper>
    </div>
</template>
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import Tool from '@/mod/util/tool/1.0/tool.js';
export default {
    name: 'marquee',
    props: {
        options: {
            type: Object,
            defualt: () => {}
        }
    },
    data () {
        return {
            swiperOption: {
                direction: 'vertical',
                autoplay: 3000,
                loop: true
            },
            tool: Tool
        };
    },
    computed: {
        showList () {
            let arr = this.options.showList.filter(item => {
                if (this.tool.isActiveDate(item) === 1) {
                    return item;
                }
            });
            return arr;
        }
    },
    components: {
        swiper,
        swiperSlide
    }
};
</script>
<style lang="less" scoped>
@import '~@/inc/sales/style/mixin/fn.less';
/deep/ .swiper-wrapper{
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
            margin-left: auto;
            margin-right: auto;
    }
.bubble-swiper{
    width: 200px/@p;
    height: 100px/@p;
    position: absolute;
    right: 0;
    overflow: hidden;
    .swiper-wrap{
        width: 200px/@p;
        height: 100px/@p;
        margin-left: auto;
        margin-right: auto;
        .swiper-wrapper{
            width: 200px/@p;
            height: 80px/@p;
            .swiper-slide{
                width: 200px/@p;
                height: 80px/@p;
                // background-color: pink;
                border-radius:20px/@p;
                -webkit-border-radius:20px/@p;
                padding: 10px/@p;
                box-sizing: border-box;
                .bubble{
                    display: block;
                    width: 180px/@p;
                    height: 60px/@p;
                    color: #fff;
                    margin-top: 10px/@p;
                    .text{
                        display: block;
                        width: 100%;
                        height: 50%;
                        line-height: 30px/@p;
                        text-align: center;
                        font-weight: 700;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis
                    }
                }
            }
        }
    }
}
</style>

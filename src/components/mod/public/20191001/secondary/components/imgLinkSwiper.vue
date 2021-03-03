<template>
<!-- 提供图片+链接 轮播 组件模板，图片间的间隔，由页面自行控制，组件只控制布局 -->
    <div class="img-link" :class="'img-link-' + options.cols">
        <swiper ref="interest_swiper" :options="swiperOption">
            <swiper-slide v-for="(item, index) in options.img_list" :key="'img_link_' + index">
                <a
                    v-href="item.link"
                    v-stat="'BTN_' + statPrefix + 'IMG_LINK_SWIPER_' + index"
                    :style="{height: tool.toRem(options.height)}"
                    class="img-link-wrap">
                    <img v-lazy="tool.addDomain(item.img)">
                </a>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
    </div>
</template>
<script>
/**
 * @author melody
 * @des 6周年 图片+链接 swiper 组件
 * @params options：楼层配置
 * @params statPrefix：埋点统计前缀
 */
import Tool from '@/mod/util/tool/1.0/tool.js';
import { swiper, swiperSlide } from 'vue-awesome-swiper';

export default {
    name: 'imgLinkSwiper',
    props: {
        options: {
            type: Object,
            default: () => {}
        },
        statPrefix: {
            type: String,
            default: ''
        }
    },
    components: {
        swiper,
        swiperSlide
    },
    data () {
        return {
            tool: Tool,
            swiperOption: {
                slidesPerView: 'auto',
                autoplay: 3000,
                pagination: '.swiper-pagination'
            }
        };
    }
};
</script>
<style lang="less" scoped>
@import '~@/inc/sales/style/mixin/fn.less';
@import '../style/common.less';

.img-link {
    .flex(h, jsb, wrap);
    position: relative;
    z-index: 5;
    /deep/.swiper-container {
        width: 100%;
        overflow: hidden;
        padding-bottom: 20px;
    }
    /deep/.swiper-wrapper {
        width: 100%;
        .swiper-slide {
            width: 100%;
        }
    }
    .swiper-pagination {
        position: absolute;
        bottom: 0;
        height: 6px;
        left: 0;
        right: 0;
        .flex(vm);
    }
    /deep/.swiper-pagination-bullet {
        width: 6px;
        height: 6px;
        border-radius: 6px;
        margin: 0 3px;
    }
}

</style>

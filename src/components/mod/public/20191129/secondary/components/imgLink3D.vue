<template>
<!-- 提供图片+链接 3D 组件模板，图片间的间隔，由页面自行控制，组件只控制布局 -->
    <section class="img-link-3d">
        <Slide3d
            :startIndex="0"
            :count="options.img_list.length"
            :is-show-pagination="true"
            :active-background="{'backgroundColor':options.dot_color_on}"
            :basic-background="{'backgroundColor':options.dot_color}"
            :auto-play="3000"
            :style="{height: tool.toRem(options.height + 30)}">
            <slide v-for="(item,index) in options.img_list" :index="index" :key="index">
                <a
                    v-href="item.link"
                    v-stat="'BTN_' + statPrefix + 'IMG_LINK_3D_'+index"
                    class="img-link-wrap"
                    :style="{height: tool.toRem(options.height)}">
                    <img v-lazy="tool.addDomain(item.img)" class="imgauto">
                </a>
            </slide>
        </Slide3d>
    </section>
</template>
<script>
/**
 * @author melody
 * @des 双11图片+链接 3D组件
 * @params options：楼层配置
 * @params statPrefix：埋点统计前缀
 */
import Tool from '@/mod/util/tool/1.0/tool.js';
import { Slide3d, Slide } from '@/mod/render/slide3d/h5/1.0/index.js';
import GlobalTitle from '@/mod/public/20191129/secondary/components/globalTitle';

export default {
    name: 'imgLink3D',
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
        Slide3d,
        Slide,
        GlobalTitle
    },
    data () {
        return {
            tool: Tool
        };
    }
};
</script>
<style lang="less" scoped>
@import '~@/inc/sales/style/mixin/fn.less';
@import '../style/common.less';
/deep/.slide3d {
    padding-bottom: 50px/@p;
    box-sizing: border-box;
    .slide-box {
        height: 100%;
    }
    .slide-pagination {
        bottom: 0;
    }
}
</style>

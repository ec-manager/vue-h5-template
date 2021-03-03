<template>
<!-- 提供图片+链接组件模板，图片间的间隔，由页面自行控制，组件只控制布局 -->
    <div class="img-link-container" :class="'img-link-' + options.cols">
        <a
            v-href="item.link"
            v-for="(item, index) in options.img_list"
            v-stat="'BTN_' + statPrefix + 'IMG_LINK_' + index"
            :key="'img_link_' + index"
            :style="{height: tool.toRem(options.height)}"
            class="img-link-wrap">
            <img v-lazy="tool.addDomain(item.img)" class="imgauto">
        </a>
    </div>
</template>
<script>
/**
 * @author melody
 * @des 6周年图片+链接组件
 * @params options：楼层配置
 * @params statPrefix：埋点统计前缀
 */
import Tool from '@/mod/util/tool/1.0/tool.js';

export default {
    name: 'imgLink',
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
.img-link-container {
    .flex(h, wrap);
    position: relative;
    z-index: 2;
}

</style>

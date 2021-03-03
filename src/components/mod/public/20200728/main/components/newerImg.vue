<template>
    <div v-if="Object.keys(imgInfo).length" class="newer-img-wrap">
        <img v-href="imgInfo.link" v-lazy="tool.addDomain(imgInfo.img)" v-stat="`LINK_NEWER_BANNER`" :style="{
                width: tool.toRem(imgInfo.width),
                height: tool.toRem(imgInfo.height),
                marginTop: tool.toRem(imgInfo.margin_top ? imgInfo.margin_top : 0),
                marginBottom: tool.toRem(imgInfo.margin_bottom ? imgInfo.margin_bottom : 0)
            }" />
    </div>
</template>
<script>
import Tool from '@/mod/util/tool/1.0/tool.js';
export default {
    name: 'newerImg',
    props: {
        options: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            tool: Tool
        };
    },
    computed: {
        imgInfo () {
            let obj = Object.assign({}, this.options.new_img, this.options.new_img_diff);
            return obj;
        }
    }
};
</script>
<style scoped lang="less">
.newer-img-wrap {
    overflow: hidden;
}

img {
    display: block;
    margin: 0 auto;
}

</style>

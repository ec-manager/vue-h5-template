<template>
    <div class="lxt-wrap">
        <div class="lxt-content" :style="{backgroundColor: options.color}">
            <div class="title">
                <a class="linkTo" v-href="options.title_link" v-stat="'BTN_TO_LXT'">
                    <img class="imgauto" v-lazy="tool.addDomain(options.title_img)">
                </a>
            </div>
            <div class="product">
                <div class="product-content" v-for="(item, index) in options.img_info" :key="index">
                    <a class="linkTo" v-href="item.link" v-stat="'BTN_LXT_' + index">
                        <img class="imgauto" v-lazy="tool.addDomain(item.src)">
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Tool from '@/mod/util/tool/1.0/tool.js';
export default {
    name: 'lxt',
    data () {
        return {
            tool: Tool
        };
    },
    props: {
        options: {
            type: Object,
            default: () => {}
        }
    }
};
</script>
<style lang="less" scoped>
@import '~@/inc/sales/style/mixin/fn.less';
.lxt-wrap{
    margin: 15px/@p auto;
    border-radius: 5px/@p;
    overflow: hidden;
    width: 690px/@p;
    height: 428px/@p;
    background: transparent;
}
.lxt-content{
    background: #fff;
    width: 100%;
    border-radius: 5px/@p;
}
.title{
    width: 100%;
    height: 68px/@p;
    .linkTo{
        display: inline-block;
    }
}
.product{
    width: 689px/@p;
    height: 331px/@p;
    display: flex;
    justify-content: space-between;
    padding-bottom: 14px/@p;
    .product-content{
        height: 100%;
        .linkTo{
            display: inline-block;
            height: 100%;
            .imgauto{
                height: 100%;
            }
        }
    }
}
</style>

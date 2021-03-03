<template>
    <section class="advertise">
        <div class="wrap" v-for="(item,index) in options.img_info" :key="index" :style="{height:tool.toRem(item.img_height)}">
            <a class="linkTo" v-href="item.link" >
                <img class="images" v-lazy="tool.addDomain(item.img)" alt="" v-stat="'BTN_ADD_' + index">
            </a>
        </div>
    </section>
</template>

<script>
import Tool from '@/mod/util/tool/1.0/tool.js';
export default {
    name: 'advertisingSpace',
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
    }
};
</script>

<style lang="less" scoped>
    @import '~@/inc/sales/style/mixin/fn.less';
    .advertise{
        box-sizing: border-box;
        .wrap{
            margin-top: 12px/@p;
            .linkTo{
                display: block;
                width: 726px/@p;
                height: 100%;
                .images{
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
</style>

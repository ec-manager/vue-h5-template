<template>
    <div>
        <template v-for="(dateItem, dateIndex) of params.list">
            <div class="nav-bottom"
                :key="dateIndex"
                v-if="tool.isActiveDate(dateItem) === 1"
                :style="{height: tool.toRem(dateItem.icon_height)}">
                <nav class="fix-btm-nav">
                    <ul class="btm-nav-list">
                        <li v-for="(item, index) of dateItem.link_list"
                            :key="index"
                            class="link-item"
                            :style="{
                                backgroundImage: `url(${addDomain(dateItem.spr_img)})`,
                                backgroundSize: `10rem ${dateItem.icon_height*2/75}rem`,
                                backgroundPosition: `-${index / dateItem.link_list.length * 10}rem ${dateItem.selected === index ? 'bottom' : 0}`
                            }">
                            <a class="nav-item"
                                v-href="item.href"
                                v-stat="'LINK_FIXBTM_'+index"
                                :style="{height: tool.toRem(dateItem.icon_height)}"></a>
                        </li>
                    </ul>
                </nav>
            </div>
        </template>
    </div>
</template>

<script>
import Tool from '@/mod/util/tool/1.0/tool.js';

export default {
    name: 'slide-bar',
    components: {

    },
    computed: {

    },
    props: {
        params: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            tool: Tool
        };
    },
    methods: {
        // 图片增加ip地址
        addDomain (str) {
            return `https://cimg1.fenqile.com${str}`;
        }
    },
    created () {

    }
};
</script>

<style lang="less" scoped>
@import "~@/inc/sales/style/mixin/fn.less";

.fix-btm-nav {
    position: fixed;
    z-index: 9;
    bottom: 0;
    left: 50%;
    width: 100%;
    max-width: 10rem;
    transform: translateX(-50%);
    background-color: #fff;
    .btm-nav-list{
        .flex();
    }
    .link-item {
        width: 100%;
        .fx();
        background-repeat: no-repeat;
    }
    .nav-item{
        display: block;
    }
    .item-on {
        background-position: 0 bottom;
    }
}
</style>

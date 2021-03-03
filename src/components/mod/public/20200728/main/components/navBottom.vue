<template>
    <div v-if="params && params.list">
        <template v-for="(dateItem, dateIndex) of params.list">
            <div class="nav-bottom"
                :key="dateIndex"
                :style="{height: tool.toRem(dateItem.icon_height)}"
                v-if="tool.isActiveDate(dateItem) === 1">
                <nav class="fix-btm-nav">
                    <ul class="btm-nav-list">
                        <li v-for="(item, index) of dateItem.link_list"
                            :key="index"
                            class="link-item"
                            :style="{
                                backgroundImage: `url(${tool.addDomain(dateItem.spr_img)})`,
                                backgroundSize: `10rem ${dateItem.icon_height*2/75}rem`,
                                backgroundPosition: `-${index / dateItem.link_list.length * 10}rem ${dateItem.select === index + 1 ? 'bottom' : 0}`
                            }">
                            <a class="nav-item"
                                @click="isSameLink(item)"
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
    name: 'navBottom',
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
        isSameLink (link) {
            let reg = new RegExp(window.location.href);
            if (!reg.test(link)) this.$href(link);
        }
    }
};
</script>

<style lang="less" scoped>
@import '~@/inc/sales/style/mixin/fn.less';

.nav-bottom {
    margin-top: 20px/@p;
}

.fix-btm-nav {
    position: fixed;
    bottom: -1px;
    left: 50%;
    z-index: 9;
    max-width: 10rem;
    width: 100%;
    transform: translateX(-50%);
    .btm-nav-list {
        .flex();
    }
    .link-item {
        width: 100%;
        background-repeat: no-repeat;

        .fx();
    }
    .nav-item {
        display: block;
    }
    .item-on {
        background-position: 0 bottom;
    }
}

</style>

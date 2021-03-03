<template>
    <div :class="{'aside-unfold': isShowDialog}">
        <div class="aside-layer"></div>
        <aside class="aside" :style="{width: tool.toRem(params.width)}">
            <a v-if="params.top.is_show && tool.isActiveDate(params.top)"
                class="aside-theme-img"
                v-href="params.top.link"
                v-stat="'COMMON_TOP_BTN'"
                :style="{height: tool.toRem(params.top.height)}">
                <img class="covimg" v-lazy="tool.addDomain(params.top_img)">
            </a>

            <div class="aside-nav-list" :style="{backgroundColor: params.nav_list.bg_color}">
                <ul class="aside-nav-ul">
                    <template v-for="(item, index) of params.nav_data_list">
                    <li :class="['aside-nav-item', {'full': item.full_switch}]"
                        :key="index"
                        v-if="!item.start_time || tool.isActiveDate(item) === 1">
                        <a class="vm item-block"
                            :style="isTargetVenue(item.link) ? toSetStyle(params.nav_list.item_on_color, params.nav_list.item_on_bg_color) : toSetStyle(params.nav_list.item_color, params.nav_list.item_bg_color)"
                            v-href="item.link"
                            v-stat="'COMMON_NAV_BTN_'+index">
                            {{item.name}}
                        </a>
                    </li>
                    </template>
                </ul>

                <a class="aside-avt-img"
                    :style="{height: tool.toRem(params.ad_img.height)}"
                    v-if="params.ad_img.is_show && tool.isActiveDate(params.ad_img) === 1"
                    @click="isSameLink(params.ad_img.link)">
                    <img class="covimg" v-lazy="tool.addDomain(params.ad_src_img)">
                </a>
            </div>

            <div class="aside-btn"
                :style="{backgroundImage: `url(${tool.addDomain(params.side_bar_img)})`}"
                @click="toggleDialog('navDialog', true)">
            </div>
        </aside>
    </div>
</template>

<script>
import Tool from '@/mod/util/tool/1.0/tool.js';

export default {
    name: 'slide-bar',
    components: {
        tool: Tool
    },
    computed: {

    },
    data () {
        return {
            tool: Tool,
            isShowDialog: false
        };
    },
    props: {
        params: {
            type: Object,
            default: () => {}
        }
    },
    methods: {
        toSetStyle (color, background) {
            return {
                color,
                backgroundColor: background
            };
        },
        toggleDialog () {
            this.isShowDialog = !this.isShowDialog;
        },
        isSameLink (link) {
            let reg = new RegExp(window.location.pathname);
            if (!reg.test(link)) this.$href(link);
        },
        isTargetVenue (link) {
            let reg = new RegExp(window.location.pathname);
            return reg.test(link);
        }
    },
    created () {

    }
};
</script>

<style lang="less" scoped>
@import '~@/inc/sales/style/mixin/fn.less';

.aside-layer {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 8;
    display: none;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.6);
    mask-image: url(../img/mask_bg.png);
    mask-size: 4000% 100%;
}
.aside {
    position: fixed;
    top: 50%;
    left: 10px/@p;
    z-index: 8;
    transition: transform .4s;
    transform: translate(-284px/@p, -50%);
    .aside-theme-img {
        display: block;
    }
    .aside-nav-list {
        position: relative;
        margin-top: -10px/@p;
        padding: 8px/@p;
        border-radius: 10px/@p;
    }
    .aside-nav-ul {
        margin-right: -1px;

        .flex(wrap);
    }
    .aside-nav-item {
        box-sizing: border-box;
        margin-top: 1px;
        padding-right: 1px;
        width: 50%;
        .item-block {
            height: 54px/@p;
            text-align: center;
            font-size: 24px/@p;
        }
    }
    .full {
        width: 100%;
    }
    .aside-btn {
        position: absolute;
        top: 50%;
        left: 100%;
        z-index: -1;
        margin-left: -24px/@p;
        width: 99px/@p;
        height: 245px/@p;
        background-size: 200% 100%;
        background-repeat: no-repeat;
        transform: translateY(-50%);

        -webkit-tap-highlight-color: rgba(0,0,0,0);
    }
}

.aside-avt-img {
    display: block;
    margin-top: 5px/@p;
}
.aside-unfold {
    .aside-layer {
        display: block;
        animation: mask .6s steps(39) both;
    }
    .aside {
        transform: translate(0,-50%);
    }
    .aside-btn {
        background-position: right 0;
    }
}

.covimg {
    display: block;
    width: 100%;
    height: 100%;
}

@keyframes mask {
    from {
        mask-position: 100% 0;
    }
    to {
        mask-position: 0 0;
    }
}

</style>

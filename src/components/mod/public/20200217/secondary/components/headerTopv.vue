<template>
    <section>
        <div class="head-wrap" v-if="header.is_show">
            <div class="head-search-image">
                <!-- logo -->
                <div class="fql-logo">
                    <img v-lazy="tool.addDomain(logo.img)">
                </div>
                <!-- 搜索框 -->
                <div class="search-image" v-if="search.is_show">
                    <a class="btn-search" v-href="search.link" data-fql-stat="BTN_SEARCH">
                        <img v-lazy="tool.addDomain(search.img_link)">
                    </a>
                </div>
                <!-- 购物车 -->
                <div class="shopping-icon" v-if="shopping.is_show">
                    <a class="btn-shopping" v-href="shopping.link" data-fql-stat="BTN_TO_SHOPPING">
                        <img v-lazy="tool.addDomain(shopping.img_link)">
                    </a>
                </div>
            </div>
            <div class="head-time-line" v-if="header.time_line.is_show">
                <img class="time-lines" v-lazy="tool.addDomain(timeLine.img_link)">
                <!-- 活动规则，分会场logo中没有做取消活动规则 -->
                <div class="btn" data-fql-stat="BTN_RULE" @click="togglePopRuleStatus()" v-if="header.is_show_rule"></div>
            </div>
        </div>
        <!-- banner主图[[ -->
        <template v-for="(item, index) of bannerImgList">
            <img class="covimg imgauto"
                v-lazy="tool.addDomain(item.img)"
                v-if="tool.isActiveDate(item) === 1"
                :style="{height: tool.toRem(item.height)}"
                :key="index">
            <div :key="index + 'btn'" class="btn-five" data-fql-stat="BTN_RULE" @click="togglePopRuleStatus()" v-if="header.is_show_rule"></div>
        </template>
         <!-- banner主图]] -->
    </section>
</template>
<script>
/**
 * @author darius
 * @des 3月大促顶部banner组件 含logo 时间线 活动规则按钮 banner
 * @params options：楼层配置
 */
import Tool from '@/mod/util/tool/1.0/tool.js';
export default {
    name: 'headerTopv',
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
    },
    computed: {
        logo () {
            let logoArr = this.header.logo.filter(item => {
                if (this.tool.isActiveDate(item) === 1) {
                    return item;
                }
            });
            return logoArr[0];
        },
        header () {
            return this.options.header;
        },
        bannerImgList () {
            return this.options.banner_img_list;
        },
        search () {
            return this.options.header.search;
        },
        shopping () {
            return this.options.header.shopping_icon;
        },
        timeLine () {
            let timeLineArr = this.header.time_line.list.filter(item => {
                if (this.tool.isActiveDate(item) === 1) {
                    return item;
                }
            });
            return timeLineArr[0];
        }
    },
    methods: {
        togglePopRuleStatus () {
            this.$emit('togglePopRuleStatus');
        }
    }
};
</script>
<style lang="less" scoped>
@import '~@/inc/sales/style/mixin/fn.less';
.head-wrap{
    width: 710px/@p;
    height: 160px/@p;
    margin: 33px/@p 20px/@p 0;
}
.head-search-image{
    width: 710px/@p;
    height: 73px/@p;
    display: flex;
    justify-content: space-between;
}
.fql-logo{
    height: 73px/@p;
    width: 151px/@p;
    display: flex;
    align-items: center;
    justify-content: center;
    img{
        background-size: 121px/@p;
        height: 52px/@p;
    }
}
.search-image{
    height: 73px/@p;
    width: 451px/@p;
    img{
        background-size: 451px/@p;
        height: 73px/@p;
    }
}
.btn-search{
    display: block;
    height: 73px/@p;
    width: 451px/@p;
}
.shopping-icon{
    height: 73px/@p;
    width: 81px/@p;
    display: flex;
    align-items: center;
    justify-content: center;
    img{
        background-size: 42px/@p;
        height: 42px/@p;
    }
}
.head-time-line{
    width: 710px/@p;
    height: 73px/@p;
    display: flex;
    margin-top: 22px/@p;
    background-size: 710px/@p 73px/@p;
    position: relative;
}
.time-lines{
    width: 710px/@p;
    height: 73px/@p;
}
.btn{
    width: 122px/@p;
    height: 73px/@p;
    position: absolute;
    right: 0;
    top: 0;
    background-color: transparent;
}
.btn-five{
    width: 99px/@p;
    height: 90px/@p;
    position: absolute;
    right: 0;
    top: 0;
    background-color: transparent;
}
</style>

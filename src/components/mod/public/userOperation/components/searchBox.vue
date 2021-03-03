<template>
    <div class="search-box">
        <a class="search-input"
             v-href="url"
             v-stat="'BTN_SEARCH_BAR'"
            :style="{backgroundImage: 'url('+tool.addDomain(img)+')'}">
        <span class="placeholder">{{text}}</span>
        </a>
    </div>
</template>

<script>
/**
 * @author krisli
 * @des 用户运营公共组件：搜索框跳转到H5搜索页面
 * @params text：搜索框内文字
 * @params img：搜索框左边LOGO
 * @params height：选传，默认44px高
 */
import Tool from '@/mod/util/tool/1.0/tool.js';
export default {
    name: 'searchBox',
    props: {
        text: {
            type: String,
            default: '搜索更多商品'
        },
        img: {
            type: String,
            default: '/product5/M00/B8/D0/LtEHAF1D1CiAETMnAAAI-sEkMyo481.png'
        },
        url: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            tool: Tool
        };
    },
    methods: {
    }
};
</script>

<style lang="less" scoped>
@import '~@/inc/sales/style/mixin/fn.less';

.search-box {
    .flex(ac);
    width: 100%;
    height: 100%;
    padding: 0 32px/@p;
    box-sizing: border-box;
    background-color: #FFFFFF;
    box-shadow: 0 4px/@p 8px/@p 0 rgba(0,0,0,0.05);
}
.search-input {
    .flex(ac);
    width: 100%;
    height: 64px/@p;
    background: #F3F3F3;
    background-repeat: no-repeat;
    background-position: 24px/@p center;
    border-radius: 8px/@p;
    background-size: 36px/@p;
    padding-left: 76px/@p;
}
.placeholder {
    font-size: 26px/@p;
    line-height: 30px/@p;
    color: #AEAEAE;
}
</style>

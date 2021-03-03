<template>
    <section class="product-img">
        <template v-for="(item,index) in options.sku_list">
            <a
                :key="'img_' + index"
                :style="{height: tool.toRem(options.img_height)}"
                v-stat="'BTN_PRODUCT_IMG_'+index"
                v-href="item.link"
                v-if="item.img"
                class="img-link-wrap">
                <img class="imgauto" v-lazy="tool.addDomain(item.img)">
            </a>
            <product-all
                :options="item"
                :getSkuNum="getSkuNum"
                :configTips="options.config_tips"
                :plateList="plateList"
                :key="'product_' + index"
                class="product-all"></product-all>
        </template>
    </section>
</template>
<script>
/**
 * @author melody
 * @des 双11 1行1列图片+sku 组件
 * @params options：楼层配置
 * @params getSkuNum：sku数量
 * @params configTips：促销标签
 * @params plateList: 板块列表
 */
import Tool from '@/mod/util/tool/1.0/tool.js';
import GlobalTitle from '@/mod/public/20191129/secondary/components/globalTitle.vue';
import ProductAll from '@/mod/public/20191129/secondary/components/productAll.vue';
export default {
    name: 'productImg',
    components: {
        GlobalTitle,
        ProductAll
    },
    computed: {},
    props: {
        options: {
            type: Object,
            default: () => {
                return {};
            }
        },
        getSkuNum: {
            type: Object,
            default: () => {
                return {};
            }
        },
        configTips: {
            type: String,
            default: ''
        },
        plateList: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    methods: {},
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
.product-img {
    .img-link-wrap {
        margin-bottom: 6px/@p;
    }
    .product-all {
        & + .img-link-wrap {
            margin-top: 6px/@p;
        }
    }
}
</style>

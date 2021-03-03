<template>
    <div class="hot-floor-class">
        <global-title :options="options"></global-title>
        <div v-for="(i,k) in options.time_list" :key="k">
            <template v-if="tool.isActiveDate(i) === 1">
                <div v-for="(item,index) in i.sku_list" :key="index">
                    <template v-if="item.type === 2">
                        <product-other :options="item" :plateList="plateList" :configTips="configTips" :getSkuNum="getSkuNum"></product-other>
                    </template>
                    <template v-else>
                        <div v-if="item.css === 1">
                            <product-hot :options="item" :plateList="plateList" :configTips="configTips" :getSkuNum="getSkuNum"></product-hot>
                        </div>
                        <div v-else-if="item.css === 2 || item.css === 3">
                            <product-normal :options="item" :configTips="configTips" :getSkuNum="getSkuNum"></product-normal>
                        </div>
                        <div v-else>
                            <product-swiper :options="item" :configTips="configTips" :getSkuNum="getSkuNum"></product-swiper>
                        </div>
                    </template>
                </div>
            </template>
        </div>
    </div>
</template>
<style lang="less" scoped>
@import "../../../../../inc/sales/style/mixin/fn.less";
@p: 75px/1rem;
@P: 75px/1rem;
</style>
<script>
import Tool from '@/mod/util/tool/1.0/tool.js';
import Product from '@/mod/render/product/h5/1.0/index.vue';
import ProductNormal from '@/mod/public/20190901/secondary/components/productNormal.vue';
import ProductSwiper from '@/mod/public/20190901/secondary/components/productSwiper.vue';
import ProductOther from '@/mod/public/20190901/secondary/components/productOther.vue';
import ProductHot from '@/mod/public/20190901/secondary/components/productHot.vue';
import GlobalTitle from '@/mod/public/20190901/secondary/components/globalTitle.vue';
export default {
    name: 'product-diy',
    components: {
        Product,
        ProductNormal,
        ProductSwiper,
        ProductOther,
        ProductHot,
        GlobalTitle
    },
    computed: {},
    props: {
        // 精选大牌
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
    methods: {
        isEmptyObejct (obj) {
            if (!obj) {
                return true;
            }
            return JSON.stringify(obj) === '{}';
        }
    },
    data () {
        return {
            tool: Tool
        };
    }
};
</script>

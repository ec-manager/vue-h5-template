<template>
    <section class="">
        <div v-for="(i, k) in options['time_list']" :key="k">
            <template  v-if="tool.isActiveDate(i) === 1">
                <global-title :options="options"></global-title>
                <div v-for="(item,index) in i['sku_list']" :key="index" class="part-li">
                    <div class="select-big-list" v-if="item.pic">
                        <a v-stat="'SELECT_BIG_'+index" :key="index" href="javascript:;" v-href="item.pic.link"><img class="imgauto" v-lazy="item.pic.img"></a>
                    </div>
                    <div>
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
                </div>
            </template>
        </div>
    </section>
</template>
<style lang="less" scoped>
@import "../../../../../inc/sales/style/mixin/fn.less";
@p: 75px/1rem;
@P: 75px/1rem;
/* 热卖大牌 */
.part-li{
    padding-top: 10px/@p;
    &:first-child{
        padding-top: 0;
    }
}
.select-big-list{
    margin-bottom: 6px/@p;
    padding:0 10px/@P;
    a{
        width: 100%;
        margin-bottom: 10px/@p;
        display: block;
    }
}
</style>
<script>
import Tool from '@/mod/util/tool/1.0/tool.js';
import ProductNormal from '@/mod/public/20190901/secondary/components/productNormal.vue';
import ProductSwiper from '@/mod/public/20190901/secondary/components/productSwiper.vue';
import ProductOther from '@/mod/public/20190901/secondary/components/productOther.vue';
import GlobalTitle from '@/mod/public/20190901/secondary/components/globalTitle.vue';
export default {
    name: 'select-big',
    components: {
        ProductNormal,
        ProductSwiper,
        ProductOther,
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
    methods: {},
    data () {
        return {
            tool: Tool
        };
    }
};
</script>

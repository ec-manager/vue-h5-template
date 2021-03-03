<template>
    <div>
        <template v-if="options.type === 'tags'">
            <!-- 带tags商品，支持1行2列、1行3列 -->
            <product-tags
                :options="options"
                :getSkuNum="getSkuNum"
                :configTips="configTips"
                :plateList="plateList"></product-tags>
        </template>
        <template v-else-if="options.type === 'hot'">
            <!-- 爆款商品，支持1行1列、1行2列、1行3列 -->
            <product-hot
                :options="options"
                :getSkuNum="getSkuNum"
                :configTips="configTips"
                :plateList="plateList"
                ></product-hot>
        </template>
        <template v-else-if="options.type === 'tps'">
            <!-- 带优惠券信息商品，支持1行2列、1行3列 -->
            <product-tps
                :options="options"
                :getSkuNum="getSkuNum"></product-tps>
        </template>
        <template v-else>
            <!-- 普通商品的type为common，不填写type或type为 common ，均为普通商品 -->
            <template v-if="options.cols === 2 || options.cols === 3">
                <!-- 普通1行2列、1行3列商品，2、 3代表列数 -->
                <product-common
                    :options="options"
                    :getSkuNum="getSkuNum"
                    :configTips="configTips"></product-common>
            </template>
            <template v-else-if="options.cols > 3">
                <!-- 普通多列商品 -->
                <product-swiper
                    :options="options"
                    :getSkuNum="getSkuNum"
                    :configTips="configTips"></product-swiper>
            </template>
        </template>
    </div>
</template>
<script>
/**
 * @author melody
 * @des 双11 总sku，根据type为more_info，分为展示tags或不展示tags，根据cols，展示不同的列
 * @params options：楼层配置
 * @params getSkuNum：sku数量
 * @params configTips：促销标签
 * @params plateList：板块列表
 */

// 带tags list sku，2或3列
import ProductTags from '@/mod/public/20191129/secondary/components/productTags';
// 爆款 sku，1、 2、 3列
import ProductHot from '@/mod/public/20191129/secondary/components/productHot';
// 优惠券信息，2列或3列
import ProductTps from '@/mod/public/20191129/secondary/components/productTps';
// 普通sku，2或3列，展示配置促销信息，如9月1日价等
import ProductCommon from '@/mod/public/20191129/secondary/components/productCommon';
// 1行多列sku，普通sku，不展示tags 和 tps信息，展示促销配置信息，如9月1日价等
import ProductSwiper from '@/mod/public/20191129/secondary/components/productSwiper';
export default {
    name: 'productAll',
    props: {
        options: {
            type: Object,
            default: () => {}
        },
        getSkuNum: {
            type: Object,
            default: () => {}
        },
        configTips: {
            type: String,
            default: ''
        },
        plateList: {
            type: Array,
            default: () => []
        }
    },
    components: {
        ProductCommon,
        ProductTags,
        ProductHot,
        ProductTps,
        ProductSwiper
    }
};
</script>

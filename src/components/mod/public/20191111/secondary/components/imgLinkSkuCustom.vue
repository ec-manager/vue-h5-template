<template>
    <div class="g-large-section">
        <!-- 1+2 -->
        <div class="img-link-section box-wrap" :style="{height: tool.toRem(imgHeight)}">
            <a class="img-link-wrap" v-href="options.main_link">
                <img v-lazy="tool.addDomain(options.main_img_src)">
            </a>
            <template v-for="(adItem, adKey) of options.main_list" >
                <a class="img-link-wrap" v-href="adItem.link ? adItem.link : ''" :key="adKey+'top'">
                    <img class="covimg" v-lazy="tool.addDomain(adItem.img_src)">
                </a>
            </template>
        </div>
        <!-- 1行4列 -->
        <ul class="img-link-section box-wrap" :style="{height: tool.toRem(imgHeight)}">
            <template v-for="(adItem, adKey) of options.brand_list" >
                <a class="img-link-wrap" v-href="adItem.link ? adItem.link : ''" :key="adKey + 'btm'">
                    <img class="covimg" v-lazy="tool.addDomain(adItem.img_src)">
                </a>
            </template>
        </ul>
        <!-- sku -->
        <product-all
            :options="options"
            :getSkuNum="getSkuNum"
            :configTips="configTips"
            :plateList="plateList"
            class="box-wrap"
            v-if="!!options.plate_id"></product-all>
    </div>
</template>
<script>
/**
 * @author melody
 * @des 双11 2+4+sku楼层
 * @params options：楼层配置
 * @params getSkuNum：sku数量
 * @params plateList: 板块列表
 * @params configTips: 模块整体促销价标签
 * @params imgHeight: 广告位图片高度
 */
import Tool from '@/mod/util/tool/1.0/tool.js';

// 商品总览
import productAll from '@/mod/public/20191111/secondary/components/productAll';
export default {
    name: 'imgLinkSkuCustom',
    props: {
        options: {
            type: Object,
            default: () => {}
        },
        getSkuNum: {
            type: Object,
            default: () => {}
        },
        plateList: {
            type: Array,
            default: () => []
        },
        configTips: {
            type: String,
            default: ''
        },
        imgHeight: {
            type: [String, Number],
            default: 175
        }
    },
    components: {
        productAll
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
@import '../style/common.less';
.g-large-section {
    margin-top: 12px/@p;
}
.img-link-section {
    .flex(h);
    /deep/.img-link-wrap {
        height: 100%;
        & + .img-link-wrap {
            margin-left: 10px/@p;
        }
    }
}
.box-wrap {
    & + .box-wrap {
        margin-top: 10px/@p;
    }
    /deep/ .product-common-more {
        .sales-more-pro {
            padding: 0;
        }
    }
    /deep/ .sales-pro.sales-three-pro {
        padding: 0;
    }
}

</style>

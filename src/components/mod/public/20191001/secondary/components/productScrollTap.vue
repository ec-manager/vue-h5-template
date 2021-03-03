<template>
    <div class="product-scroll-tap">
        <div class="placeholder-wrap">
            <div class="fix-bar-wrap" v-fixed>
                <scroll-tap :navList="options.sku_list" :floorId="'floor_nav_'" :isShowBtn="true" navClass="scroll-tap-nav">
                    <template slot="nav" slot-scope="navName">
                        <div class="nav-text"><div class="ico-dw"></div>{{navName.nav.nav_btn}}</div>
                    </template>
                </scroll-tap>
            </div>
        </div>
        <div :id="'floor_nav_'+index" v-for="(item, index) of options.sku_list" :key="index" class="floor-pro">
            <global-title :options="item"></global-title>
            <product-all
                :options="item"
                :getSkuNum="getSkuNum"
                :configTips="options.config_tips"
                :plateList="plateList"></product-all>
        </div>
    </div>
</template>
<script>
/**
 * @author melody
 * @des 6周年长尾商品组件
 * @params options：楼层配置
 * @params getSkuNum：板块sku数量
 * @params configTips：促销标签
 * @params plateList: 板块列表
 */
import ScrollTap from '@/mod/render/scrollTap/h5/1.0/index.vue';
// 商品总览
import productAll from '@/mod/public/20191001/secondary/components/productAll';
// 全局标题
import globalTitle from '@/mod/public/20191001/secondary/components/globalTitle';

export default {
    name: 'productScrollTap',
    components: {
        ScrollTap,
        productAll,
        globalTitle
    },
    computed: {},
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
        }
    }
};
</script>
<style lang="less" scoped>
@import '~@/inc/sales/style/mixin/fn.less';
@import '../style/common.less';
.product-scroll-tap {
    margin-top: 6px/@p;
    .placeholder-wrap {
        height: 80px/@p;
    }
}
/deep/ .scroll-tap-nav {
    position: relative;
    z-index: 4;
    margin: 0 12px/@p;
    padding-right: 85px/@p;
    background: #fff;
    .swiper-container {
        overflow: hidden;
    }
    .ico-dw {
        position: absolute;
        top: 50%;
        left: 20px/@p;
        margin-top: -15px/@p;
        width: 20px/@p;
        height: 30px/@p;
        background: url(https://cimg1.fenqile.com/product5/M00/DA/16/LtEHAF1M13mAKyY9AAAGqGurk50745.png) no-repeat;
        background-size: 100% 100%;
        opacity: 0;
    }
    .nav-text {
        position: relative;
        padding-left: 50px/@p;
        height: 80px/@p;
        text-align: left;
    }
    .tips {
        position: absolute;
        top: 0;
        z-index: 1;
        box-sizing: border-box;
        padding-left: 36px/@p;
        width: 100%;
        background-color: #fff;
        line-height: 80px/@p;
        opacity: 0;
        pointer-events: none;
    }
    .swiper-container {
        background-color: #fff;
    }
    .swiper-slide {
        display: block;
        color: #000;
        text-align: center;
        font-size: 28px/@p;
        line-height: 80px/@p;
    }
    .on {
        background-color: #fff;
        color: #e95e56;
        .ico-dw {
            opacity: 1;
        }
    }
    .toggle-btn {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 2;
        width: 80px/@p;
        height: 80px/@p;
        background-color: #fff;
        &::after {
            position: absolute;
            top: 0;
            left: 0;
            width: 80px/@P;
            height: 80px/@p;
            background: url(https://cimg1.fenqile.com/product5/M00/C3/95/L9EHAF1I8aOAYqIyAAAFFq9nmj0065.png) no-repeat;
            background-size: 100% 100%;
            content: '';
        }
    }
    &.open {
        .swiper-container {
            position: absolute;
            top: 80px/@p;
            width: 100%;
        }
        .swiper-wrapper {
            -webkit-box-lines: multiple;
            flex-wrap: wrap;
        }
        .toggle-btn::after {
            transform: translateY(0px) rotate(180deg);
        }
        .tips {
            opacity: 1;
        }
    }
}
.floor-pro {
    padding-top: 80px/@p;
    margin-top: -80px/@p;
    & + .floor-pro {
        margin-top: -74px/@p;
    }
}
</style>

<template>
    <div class="product-scroll-tap">
        <!-- 吸顶tab -->
        <div class="fix-bar-wrap">
            <div class="fix-bar" v-fixed>
                <scroll-tap
                    :navList="options.sku_list"
                    :floorId="'floor_nav_'"
                    :isShowBtn="true"
                    navClass="nav-top">
                    <template slot="nav" slot-scope="navName">
                        {{ navName.nav.nav_btn }}
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
 * @des 双11长尾商品组件
 * @params options：楼层配置
 * @params getSkuNum：板块sku数量
 * @params plateList: 板块列表
 */
import ScrollTap from '@/mod/render/scrollTap/h5/1.0/index.vue';
// 商品总览
import productAll from '@/mod/public/20191129/secondary/components/productAll';
// 全局标题
import globalTitle from '@/mod/public/20191129/secondary/components/globalTitle';

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
/* 吸顶导航条
***********************************/
/deep/.fix-bar-wrap{
    height: 40px;
    margin-bottom: 6px/@p;
    .swiper-container {
        overflow: hidden;
    }
    .nav-top{
        position: relative;
        z-index: 2;
        padding-right: 40px;
    }
    .tips{
        position: absolute;
        z-index: 1;
        width: 100%;
        padding-left: 34px/@p;
        opacity: 0;
        box-sizing: border-box;
        line-height: 40px;
        color: #aaa;
        background-color: #fff;
    }
    .swiper-container{
        background-color: #fff;
    }
    .swiper-slide{
        display: block;
        padding: 0 25px/@p;
        font-size: 12px;
        text-align: center;
        line-height: 40px;
        color: #333;
        background-color: #fff;
        &:before{
            content: '';
            display: inline-block;
            width: 20px/@p;
            height: 30px/@p;
            margin-right: 9px/@p;
            vertical-align: -7%;
            opacity: 0;
            background: url(https://cimg1.fenqile.com/product5/M00/DA/16/LtEHAF1M13mAKyY9AAAGqGurk50745.png) no-repeat;
            background-size: 100% 100%;
        }
    }
    .on{
        color: #fe514e;
        &:before{opacity: 1;}
    }
    .toggle-btn{
        position: absolute;
        z-index: 2;
        top: 0;
        right: 0;
        .flex(vm);
        .size(40px);
        background-color: #fff;
        &::after{
            content: '';
            display: block;
            border-width: 8px 5px 0;
            border-style: solid;
            border-color: #333 transparent transparent transparent;
        }
    }
    .open{
        .swiper-container{
            position: absolute;
            top: 40px;
            width: 100%;
        }
        /deep/.swiper-wrapper{
            -webkit-box-lines: multiple;
            flex-wrap: wrap;
        }
        .swiper-slide{
            padding: 0;
            width: 25%;
            &::after{
                opacity: 1;
            }
        }
        .toggle-btn::after{
            transform: rotate(180deg);
        }
        .tips{opacity: 1;}
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

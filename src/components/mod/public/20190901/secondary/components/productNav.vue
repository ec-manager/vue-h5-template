<template>
    <div>
        <div class="placeholder-wrap">
            <div class="fix-bar-wrap" v-fixed>
                <scroll-tap :navList="options" :floorId="'floor_nav_'" :isShowBtn="true" navClass="nav-top-long">
                    <template slot="nav" slot-scope="navName">
                        <div class="nav-text"><div class="ico-dw"></div>{{navName.nav.nav_btn}}</div>
                    </template>
                </scroll-tap>
            </div>
        </div>
        <div :id="'floor_nav_'+index" v-for="(item, index) of options" :key="index">
            <product-long :options="item" :getSkuNum="getSkuNum"></product-long>
        </div>
    </div>
</template>
<style lang="less" scoped>
@import "../../../../../inc/sales/style/mixin/fn.less";
@p: 75px/1rem;
@P: 75px/1rem;
/* 一行一个商品 */
/deep/.nav-top-long{
    .swiper-container{
        overflow: hidden;
    }
    .ico-dw{
        width:20px/@p;
        height:30px/@p;
        background:url(https://cimg1.fenqile.com/product5/M00/DA/16/LtEHAF1M13mAKyY9AAAGqGurk50745.png) no-repeat;
        background-size:100% 100%;
        position:absolute;
        left:20px/@p;
        top:50%;
        margin-top:-15px/@p;
        opacity:0;
    }
    .nav-text{
        position:relative;
        height:80px/@p;
        padding-left:50px/@p;
        text-align:left;
    }
    position:relative;
    padding-right: 80px/@p;
    .tips{
        position: absolute;
        z-index: 1;
        top: 0;
        width: 100%;
        padding-left: 36px/@p;
        opacity: 0;
        box-sizing: border-box;
        pointer-events: none;
        line-height: 36px;
        color: #3c6e96;
        background-color: #fff;
    }
    .swiper-container{
        background-color: #ffffff;
    }
    .swiper-slide{
        display: block;
        font-size: 28px/@p;
        text-align: center;
        line-height: 80px/@p;
        color: #000;
    }
    .on{
        color: #e95e56;
        background-color: #fff;
        .ico-dw{opacity: 1;}
    }
    .toggle-btn{
        position: absolute;
        z-index: 2;
        top: 0;
        right: 0;
        width: 80px/@p;
        height: 80px/@p;
        background-color: #fff;
        &::after{
            position: absolute;
            top: 0px;
            left: 0px;
            content: '';
            width: 80px/@P;
            height: 80px/@p;
            background:url(https://cimg1.fenqile.com/product5/M00/C3/95/L9EHAF1I8aOAYqIyAAAFFq9nmj0065.png) no-repeat;
            background-size:100% 100%;
        }
    }
    &.open{
        .swiper-container{
            position: absolute;
            top: 36px;
            width: 100%;
        }
        .swiper-wrapper{
            -webkit-box-lines: multiple;
            flex-wrap: wrap;
        }
        .toggle-btn::after{
            transform: translateY(0px) rotate(180deg);
        }
        .tips{opacity: 1;}
    }
}
</style>
<script>
import ScrollTap from '@/mod/render/scrollTap/h5/1.0/index.vue';
import ProductLong from '@/mod/public/20190901/secondary/components/productLong.vue';
export default {
    name: 'product-nav',
    components: {
        ScrollTap,
        ProductLong
    },
    computed: {},
    props: {
        // 精选大牌
        options: {
            type: Array,
            default: () => {
                return [];
            }
        },
        getSkuNum: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    methods: {},
    data () {
        return {};
    }
};
</script>

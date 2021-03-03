<template>
    <section class="pad" v-if="options['is_show']">
        <div class="top-swiper" :class="['big'+swicthClass]">
            <swiper ref="swiper-banner" :options="swiperOption">
                <div class="swiper-slide" v-for="(item,index) in options['list']" :key="index">
                    <div class="four-li">
                        <div class="item four-a" v-for="(item2,index2) in item" :key="index2" ><a href="javascript:;" v-href="item2.link"><img class="imgauto" v-lazy="item2.img"></a></div>
                    </div>
                </div>
            </swiper>
        </div>
    </section>
</template>
<style lang="less" scoped>
@import "../../../../../inc/sales/style/mixin/fn.less";
@p: 75px/1rem;
@P: 75px/1rem;
/* 热卖大牌 */
.top-swiper{
    overflow: hidden;
    margin-top: 26px/@p;
    .swiper-slide{
        width: 25%;
        padding:0 3px/@P;
        box-sizing: border-box;
        .four-a{border-radius: 20px/@p;overflow: hidden;}
        &:nth-child(odd){
            .four-a{
                &:nth-child(even){
                    transform: scale(0.9);
                    margin-top: 20px/@p;
                }
            }
        }
        &:nth-child(even){
            .four-a{
                &:nth-child(odd){
                   transform: scale(0.9);
                    margin-bottom: 20px/@p;
                }
            }
        }
    }
    &.big1{
        .swiper-slide{
            &:nth-child(even){
                .four-a{
                    &:nth-child(even){
                        animation:scSmall 1s forwards;
                    }
                    &:nth-child(odd){
                        animation:scBig 1s forwards;
                    }
                }
            }
            &:nth-child(odd){
                .four-a{
                    &:nth-child(even){
                        animation:scBig 1s forwards;
                    }
                    &:nth-child(odd){
                        animation:scSmall 1s forwards;
                    }
                }
            }
        }
    }
    &.big2{
        .swiper-slide{
            &:nth-child(even){
                .four-a{
                    &:nth-child(even){
                        animation:scBig 1s forwards;
                    }
                    &:nth-child(odd){
                        animation:scSmall 1s forwards;
                    }
                }
            }
            &:nth-child(odd){
                .four-a{
                    &:nth-child(even){
                        animation:scSmall 1s forwards;
                    }
                    &:nth-child(odd){
                        animation:scBig 1s forwards;
                    }
                }
            }
        }
    }
     @keyframes scSmall
    {
        from{
            transform:scale(1);
        }
        to {
            transform: scale(0.9);
        }
    }
    @keyframes scBig
    {
        from{
            transform:scale(0.9);
        }
        to {
            transform: scale(1);
        }
    }
}
</style>
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper';
export default {
    name: 'banner-swiper',
    components: {
        swiper,
        swiperSlide
    },
    computed: {
        swiperOption () {
            return {
                slidesPerView: 'auto',
                autoplay: 5000,
                onSlideChangeStart: this.getTest
            };
        }
    },
    props: {
        // 精选大牌
        options: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    methods: {
        getTest () {
            if (this.swicthClass === 1) {
                this.swicthClass = 2;
            } else {
                this.swicthClass = 1;
            }
        }
    },
    data () {
        return {
            swicthClass: 1
        };
    },
    created () {}
};
</script>

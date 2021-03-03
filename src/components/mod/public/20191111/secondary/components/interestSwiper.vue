<template>
    <section class="interest-swiper" :class="'mode-first-'+firstItemMode">
        <swiper ref="interest_swiper" :options="swiperOption">
            <swiper-slide
                class="swiper-slide"
                v-for="(item, index) in options['list']"
                :key="index">
                <a
                    v-href="colItem.link"
                    v-for="(colItem, colIndex) in item"
                    :key="colIndex"
                    v-stat="'BTN_INTEREST_SWIPER_'+ index + '_' +colIndex"
                    class="img-link-wrap">
                    <img class="imgauto" v-lazy="tool.addDomain(colItem.img)">
                </a>
            </swiper-slide>
        </swiper>
    </section>
</template>
<script>
/**
 * @author melody
 * @des 双11或大或小利益点组件
 * @params options：楼层配置
 */
import Tool from '@/mod/util/tool/1.0/tool.js';
import { swiper, swiperSlide } from 'vue-awesome-swiper';

export default {
    name: 'interestSwiper',
    components: {
        swiper,
        swiperSlide
    },
    props: {
        options: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        swiperOption () {
            return {
                slidesPerView: 'auto',
                autoplay: 5000,
                onSlideChangeStart: this.scaleItem
            };
        }
    },
    methods: {
        scaleItem () {
            this.firstItemMode = this.firstItemMode === 'big' ? 'small' : 'big';
        }
    },
    data () {
        return {
            tool: Tool,
            firstItemMode: 'big'
        };
    }
};
</script>
<style lang="less" scoped>
@import '~@/inc/sales/style/mixin/fn.less';
@import '../style/common.less';

.interest-swiper {
    position: relative;
    z-index: 5;
    .swiper-slide {
        box-sizing: border-box;
        width: 25%;
        .img-link-wrap {
            overflow: hidden;
            border-radius: 20px/@p;
            .flex(vm);
        }
        &:nth-child(odd) {
            .img-link-wrap {
                &:nth-child(even) {
                    margin-top: 17px/@p;
                    transform: scale(.87);
                }
            }
        }
        &:nth-child(even) {
            .img-link-wrap {
                &:nth-child(odd) {
                    margin-bottom: 17px/@p;
                    transform: scale(.87);
                }
            }
        }
    }
    &.mode-first-big {
        .swiper-slide {
            &:nth-child(even) {
                .img-link-wrap {
                    &:nth-child(even) {
                        animation: scSmall 1s forwards;
                    }
                    &:nth-child(odd) {
                        animation: scBig 1s forwards;
                    }
                }
            }
            &:nth-child(odd) {
                .img-link-wrap {
                    &:nth-child(even) {
                        animation: scBig 1s forwards;
                    }
                    &:nth-child(odd) {
                        animation: scSmall 1s forwards;
                    }
                }
            }
        }
    }
    &.mode-first-small {
        .swiper-slide {
            &:nth-child(even) {
                .img-link-wrap {
                    &:nth-child(even) {
                        animation: scBig 1s forwards;
                    }
                    &:nth-child(odd) {
                        animation: scSmall 1s forwards;
                    }
                }
            }
            &:nth-child(odd) {
                .img-link-wrap {
                    &:nth-child(even) {
                        animation: scSmall 1s forwards;
                    }
                    &:nth-child(odd) {
                        animation: scBig 1s forwards;
                    }
                }
            }
        }
    }
    @keyframes scSmall {
        from {
            transform: scale(1);
        }
        to {
            transform: scale(.87);
        }
    }
    @keyframes scBig {
        from {
            transform: scale(.87);
        }
        to {
            transform: scale(1);
        }
    }
}

</style>

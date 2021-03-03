import ProductBase from '@/mixins/product/1.0/productBase.js';
// 参考：https://github.com/surmon-china/vue-awesome-swiper
import { swiper, swiperSlide } from 'vue-awesome-swiper';
export default {
    name: 'swiperProduct',
    extends: ProductBase,
    components: {
        swiper,
        swiperSlide
    },

    props: {
        // 是否循环播放
        loop: {
            type: Boolean,
            default: false
        },
        // 是否自动播放
        autoplay: {
            type: [Boolean, Object],
            default: false
        },
        wrapClass: {
            type: String,
            default: 'sales-pro'
        }
    },

    data () {
        return {
            // 和swiper官网配置一致
            swiperOption: {
                slidesPerView: 'auto',
                loop: this.loop,
                autoplay: this.autoplay
            }
        };
    }
};

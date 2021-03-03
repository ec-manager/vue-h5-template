import { swiper, swiperSlide } from 'vue-awesome-swiper';
export default {
    name: 'tab',

    components: {
        swiper,
        swiperSlide
    },

    data () {
        return {
            swiperOption: {
                slidesPerView: 'auto'
            }
        };
    },

    watch: {
        value () {
            this.swiper.slideTo(this.value - 1, 1000, false);
        }
    },

    computed: {
        // swiper实例
        swiper () {
            return this.$refs.swiper.swiper;
        }
    },

    props: {
        // 头部列表
        headList: {
            type: Array,
            default: () => {
                return [];
            }
        },

        // 高亮索引值
        value: {
            type: [Number, String],
            default: 0
        },
        customStyle: {}
    },

    methods: {
        handleClick (index) {
            this.$emit('input', index);
            // 获取页面滚动高度
            let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
            if (document.documentElement.scrollTop) {
                document.documentElement.scrollTop = scrollTop - 1;
                document.documentElement.scrollTop = scrollTop;
            } else {
                document.body.scrollTop = scrollTop - 1;
                document.body.scrollTop = scrollTop;
            }
        }
    },

    mounted () {
        this.$nextTick(function () {
            this.swiper.slideTo(this.value - 1, 1000, false);
        });
    }
};

import Slide from '../slide/index.vue';
export default {
    name: 'slide3d',
    components: {
        Slide
    },
    props: {
        // slide的个数
        count: {
            type: [Number, String],
            default: 0
        },

        // 开始显示的slide下标，从0开始
        startIndex: {
            type: Number,
            default: 0
        },

        // 最小移动距离
        minSwipeDistance: {
            type: Number,
            default: 10
        },

        // 激活状态分页器背景色
        activeBackground: {
            type: Object
        },

        // 常显状态分页器背景色
        basicBackground: {
            type: Object
        },

        // 是否显示分页器
        isShowPagination: {
            type: Boolean,
            default: false
        },

        // 自动轮播
        autoPlay: {
            type: Number,
            default: 0
        }
    },
    data () {
        return {
            // 当前的slide下标值
            currentIndex: 0,
            total: 0,
            dragOffset: 0,
            dragStartX: 0,
            mousedown: false
        };
    },
    watch: {
        count () {
            this.computeData();
        }
    },
    computed: {
        // 是否是最后一个slide
        isLastSlide () {
            return this.currentIndex === this.total - 1;
        },
        // 是否是第一个slide
        isFirstSlide () {
            return this.currentIndex === 0;
        }
    },
    methods: {
        // 去下一个slide
        goNext () {
            this.isLastSlide ? this.goSlide(0) : this.goSlide(this.currentIndex + 1);
        },
        // 去上一个slide
        goPrev () {
            this.isFirstSlide ? this.goSlide(this.total - 1) : this.goSlide(this.currentIndex - 1);
        },
        // 去指定下标的slide
        goSlide (index) {
            this.currentIndex = (index < 0 || index > this.total - 1) ? 0 : index;
            this.$emit('beforeSlideChange', this.currentIndex);
        },
        // touchstart事件函数
        handleEventStart (e) {
            if (!e.touches) {
                e.preventDefault();
            }
            this.clearTimer();
            this.mousedown = true;
            this.dragStartX = e.touches[0].clientX;
        },
        // touchmove事件函数
        handleEventMove (e) {
            if (!this.mousedown) {
                return;
            }
            let eventPosX = e.touches[0].clientX;
            let deltaX = (this.dragStartX - eventPosX);
            this.dragOffset = deltaX;
            if (this.dragOffset > this.minSwipeDistance) {
                this.handleEventEnd();
                this.goNext();
            } else if (this.dragOffset < -this.minSwipeDistance) {
                this.handleEventEnd();
                this.goPrev();
            }
        },

        // touchend操作事件
        handleEventEnd () {
            this.mousedown = false;
            this.dragOffset = 0;
            this.clearTimer();
            this.startAutoPlay();
        },

        // 获取slide的数量
        getSlideCount () {
            if (this.$slots.default !== undefined) {
                return this.$slots.default.filter((value) => {
                    return value.tag !== void 0;
                }).length;
            }
            return 0;
        },
        // 重新计算currentIndex值
        computeData (firstRun) {
            this.total = this.getSlideCount();
            if (firstRun || this.currentIndex >= this.total) {
                this.currentIndex = parseInt(this.startIndex) > this.total - 1 ? this.total - 1 : parseInt(this.startIndex);
            }
        },
        // 自动轮播
        autoPlayEvent () {
            this.goNext();
            this.timer = setTimeout(() => {
                this.autoPlayEvent();
            }, this.autoPlay);
        },
        // 清除定时器
        clearTimer () {
            typeof this.timer === 'number' && clearTimeout(this.timer);
            delete this.timer;
        },
        // 开始自动轮播
        startAutoPlay () {
            if (this.autoPlay) {
                this.timer = setTimeout(() => {
                    this.autoPlayEvent();
                }, this.autoPlay);
            }
        }
    },
    mounted () {
        this.computeData(true);
        this.$el.addEventListener('touchstart', this.handleEventStart);
        this.$el.addEventListener('touchmove', this.handleEventMove);
        this.$el.addEventListener('touchend', this.handleEventEnd);
        this.startAutoPlay();
    },
    beforeDestroy () {
        this.$el.removeEventListener('touchstart', this.handleEventStart);
        this.$el.removeEventListener('touchmove', this.handleEventMove);
        this.$el.removeEventListener('touchend', this.handleEventEnd);
    }
};

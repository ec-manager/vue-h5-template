import { swiper } from 'vue-awesome-swiper';
import { G_SCROLL_LIGHTHEIGHT } from '@/mod/util/scroll/h5/1.0/type.js';

export default {
    name: 'scrollTap',
    components: {
        swiper
    },
    props: {
        /* 导航条数据 */
        navList: {
            type: Array,
            required: true
        },
        /* swiper属性 */
        options: {
            type: Object,
            default: () => {}
        },
        floorId: { // 是否需要内部帮助生成楼层ID
            type: String,
            default: ''
        },
        isShowBtn: { // 是否为可展示更多导航条
            type: Boolean,
            default: false
        },
        toggleTips: { // 展示更多提示语
            type: String,
            default: '请选择楼层'
        },
        navClass: { // 导航条完全自定义样式
            type: String,
            default: 'swiper-nav'
        }
    },
    computed: {
        /* 固定swiper不可拖动 */
        lockSwiper () {
            if (this.navList.length <= 1) {
                return 'swiper-no-swiping'; 
            }
        },
        /* 获取对应swiper实例 */
        swiper () {
            return this.$refs.swiperNav.swiper;
        },
        /* 合并swiper属性 */
        swiperOption () {
            return Object.assign({slidesPerView: 'auto'}, this.options);
        }
    },
    data () {
        return {
            realNavList: [], // 去除无效楼层后的navList
            realStat: [], // 生成hot-tag上报字段
            floorSaveID: [], // 对应楼层ID储存数组
            floorSaveArr: [], // 对应楼层HtmlElement储存数组
            floorNum: 0, // 当前激活楼层
            lockFlag: false, // 标记展开状态，锁定swiper
            isShowBtnFlag: this.isShowBtn // 是否具备展示更多标记
        };
    },
    methods: {
        /**
         * @methods getFloors
         * @description 获取对应楼层 ID 写入数组缓存
         */
        getFloors () {
            // 不需要内部生成楼层id，item自带floor_id字段
            if (!this.floorId) {
                this.floorSaveID = this.navList.map((item) => {
                    return `#${item.floor_id}`;
                });
            } else {
                let [i, len] = [0, this.navList.length];
                for (i; i < len; i++) {
                    this.floorSaveID.push(`#${this.floorId}${i}`);
                }
            }
        },

        /**
         * @methods saveFloors
         * @description 去除无效按钮，并暴露在控制台上
         */
        saveFloors () {
            this.floorSaveID.forEach((item, i) => {
                let elm = document.querySelector(item);

                if (elm) {
                    this.floorSaveArr.push(elm);
                } else {
                    delete this.floorSaveID[i];
                    console.log(`${item} is not found`);
                }
            });
        },

        /**
         * @methods resetNavList
         * @description 重置按钮数据，获取有效按钮
         */
        resetNavList () {
            // 抽离原navList中的有效按钮
            this.realNavList = this.navList.filter((item, i) => {
                if (this.floorSaveID[i]) {
                    return item; 
                }
            });

            // 去除无效楼层id
            this.floorSaveID = this.floorSaveID.filter(Boolean);

            // 有效按钮生成hot-tag上报字段
            this.realStat = this.floorSaveID.map(item => {
                let str = item.toLocaleUpperCase();
                return str.replace('#', 'NAV_BTN_');
            });
        },

        /**
         * @methods judgeBtnFlex
         * @description 判断按钮是否需要设置为flex: 1
         */
        judgeBtnFlex () {
            this.$nextTick(function () {
                let lastBtnLeft = this.swiper.slidesGrid[this.swiper.slidesGrid.length - 1];
                let lastBtnWidth = this.swiper.slidesSizesGrid[this.swiper.slidesSizesGrid.length - 1];

                if (this.swiper.slides.length && lastBtnLeft + lastBtnWidth <= this.swiper.width) {
                    this.swiper.lockSwipes();
                    let slides = Array.prototype.slice.apply(this.swiper.slides);

                    slides.map(item => {
                        item.classList.add('fx1');
                    });

                    // 有展开更多按钮，删除按钮并把空间释放出来
                    if (this.isShowBtnFlag) {
                        this.isShowBtnFlag = false;
                        this.$refs.scrollTapElm.style.paddingRight = 0;
                    }
                }
            });
        },

        /**
         * @methods lightHeight
         * @description 按钮高亮事件
         */
        lightHeight () {
            this.$nextTick(() => {
                let instance = this.$scrollFn();
                let params = Array.from(this.swiper.slides);
                let hash = instance.createHash();

                // 初始化第一个按钮高亮
                params[0].classList.add('on');

                this.floorSaveArr.forEach((item, index) => {
                    // 区间类型，需要以G_SCROLL_LIGHTHEIGHT开头设置滚动类型，使用_hash方式进行分组
                    instance.addSubscribes(item, `${G_SCROLL_LIGHTHEIGHT}_${hash}`, signal => {
                        if (signal && this.floorNum !== index) {
                            params[this.floorNum].classList.remove('on');
                            params[index].classList.add('on');
                            this.floorNum = index;
                            this.swiper.slideTo(index - 1);
                        }
                    });
                });
            });
        },

        /**
         * @methods toggleSwiper
         * @description 导航条点击事件
         */
        toggleSwiper () {
            if (!this.isShowBtnFlag) {
                return; 
            }

            let showMoreBtn = this.$refs.showMoreNavBtn;
            let scrollTapElm = this.$refs.scrollTapElm;
            let swiperWrapper = this.swiper.wrapper[0];

            // 展开更多按钮事件
            showMoreBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                scrollTapElm.classList.toggle('open');

                if (!this.lockFlag) {
                    this.lockFlag = true;
                    this.swiper.setWrapperTranslate(0);
                    this.swiper.lockSwipes();
                    this.swiper.activeIndex = 0;
                } else {
                    this.recoverSwiper();
                }
            });

            // 导航条点击收起更多事件
            swiperWrapper.addEventListener('click', (e) => {
                e.stopPropagation();

                if (this.lockFlag) {
                    this.swiper.update(false);
                    scrollTapElm.classList.remove('open');
                    this.recoverSwiper();
                }
            });
        },

        /**
         * @methods recoverSwiper
         * @description 收起，还原最初状态，并滚动swiper
         */
        recoverSwiper () {
            this.lockFlag = false;
            this.swiper.unlockSwipes();
            this.swiper.update(true);
            this.swiper.slideTo(this.floorNum - 1, 0, false);
        },

        init () {
            this.getFloors();
            this.saveFloors();
            this.resetNavList();
            this.lightHeight();
            this.judgeBtnFlex();
            this.toggleSwiper();
        }
    },
    mounted () {
        this.init();
    }
};

export default {
    name: 'dish',
    data () {
        return {
            // 总的旋转角度
            sumAngle: 0,
            // 是否正在抽奖
            running: false,
            // 上一次抽奖的索引值
            prevPrizeIndex: 0,
            // 中奖商品索引
            prizeIndex: 0
        };
    },

    props: {
        // 礼物个数
        prizeNumber: {
            type: Number,
            default: 8
        },
        // 旋转总圈数
        sumCircle: {
            type: Number,
            default: 8
        },
        // 旋转时间
        durationTime: {
            type: Number,
            default: 5
        },
        // 奖品图
        prizeImage: {
            type: String,
            required: true
        },
        // 按钮图
        buttonImage: {
            type: String,
            required: true
        },
        wrapClass: {
            type: String,
            default: ''
        }
    },

    computed: {
        // 旋转总的弧度
        fixedRadian () {
            return 360 * parseInt(this.sumCircle);
        },
        // 每个礼物所占的弧度
        everyRadian () {
            return parseInt(360 / this.prizeNumber);
        },
        // 旋转动画样式计算
        animateStyle () {
            return {
                'transform': 'rotate(' + this.sumAngle + 'deg)',
                'transition': 'transform ' + this.durationTime + 's ease-in-out'
            };
        }
    },

    methods: {
        // 计算需要旋转的总角度
        computerAngle () {
            this.sumAngle += this.fixedRadian + this.everyRadian * this.prizeIndex + this.everyRadian * (this.prizeNumber - this.prevPrizeIndex);
        },

        // 开始旋转
        startRotate () {
            if (!this.running) {
                this.running = true;
                this.computerAngle();
                this.startAnimate();
            }
        },

        // 开始动画
        startAnimate () {
            let stopFn = () => {
                if (this.running) {
                    this.running = false;
                    setTimeout(() => {
                        // 保存当前的中奖下标
                        this.prevPrizeIndex = this.prizeIndex;
                        // 发布抽奖停止事件
                        this.$emit('stop', this);
                    }, 600);
                }
            };

            this.$el.querySelector('.js-dish-btn').removeEventListener('webkitTransitionEnd', stopFn, false);
            this.$el.querySelector('.js-dish-btn').addEventListener('webkitTransitionEnd', stopFn, false);
        },

        // 开始抽奖
        handleStart () {
            if (!this.running) {
                this.$emit('start', this);
            }
        }
    }
};

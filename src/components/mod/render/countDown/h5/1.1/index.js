module.exports = {
    name: 'countDown',
    props: {
        // 倒计时结束时间
        end: {
            type: String,
            default: ''
        },
        // 倒计时开始时间
        begin: {
            type: String,
            default: ''
        },
        // 当前时间传入，可以用服务器时间，或本地时间
        nowTime: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            now: 0,
            day: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            isIntervalEnd: false,
            timer: null
        };
    },

    computed: {
        // 格式化开始时间
        endTime () {
            return this.end.replace(/-/g, '/');
        },

        // 格式化结束时间
        beginTime () {
            return this.begin.replace(/-/g, '/');
        },

        // 活动是否开始
        isStart () {
            return this.now < this.getTime(this.beginTime);
        },

        // 获取倒计时时间
        getCountDownTime () {
            if (this.now < this.getTime(this.beginTime)) {
                return this.getTime(this.beginTime);
            } else {
                return this.getTime(this.endTime);
            }
        },

        // 活动是否结束
        isEnd () {
            return this.now > this.getTime(this.endTime);
        },

        getTimeData () {
            return {
                day: this.day,
                hours: this.hours,
                minutes: this.minutes,
                seconds: this.seconds
            };
        }
    },

    methods: {
        // 获取指定时间的时间戳
        getTime (str) {
            if (str && typeof str === 'string') {
                return (new Date(str)).getTime();
            } else {
                return (new Date()).getTime();
            }
        },
        // 计算天、时、分、秒
        computedTime () {
            if (this.isIntervalEnd) {
                return false; 
            }
            let endTime = this.getCountDownTime;
            let diff = 0;
            if (this.now < endTime) {
                diff = (endTime - this.now) / 1000;
            } else {
                this.isIntervalEnd = true;
                this.$emit('handleCountDownEnd'); // 倒计时结束
                clearTimeout(this.timer);
            }

            // 计算天
            this.day = this.addPreZero(Math.floor(diff / (24 * 60 * 60)));
            diff -= this.day * 24 * 60 * 60;

            // 计算时
            this.hours = this.addPreZero(Math.floor(diff / (60 * 60)));
            diff -= this.hours * 60 * 60;

            // 计算分
            this.minutes = this.addPreZero(Math.floor(diff / 60));
            diff = Math.floor(diff - this.minutes * 60);

            // 计算秒
            this.seconds = this.addPreZero(diff);

            this.now = (new Date(this.now + 1000)).getTime();
        },
        // 开始倒计时
        start () {
            this.computedTime();

            this.timer = setTimeout(() => {
                this.start();
            }, 1000);
        },
        // 增加前缀0
        addPreZero (number) {
            return number <= 9 ? `0${number}` : number;
        }
    },

    created () {
        this.now = this.getTime(this.nowTime.replace(/-/g, '/'));
        if (!this.isEnd) {
            this.start();
        }
    }
};

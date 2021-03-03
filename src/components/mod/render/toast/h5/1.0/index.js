export default {
    name: 'toast',
    props: {
        // 是否自动关闭
        autoClose: {
            type: Boolean,
            default: true
        },
        // 自动关闭延迟时间
        delay: {
            type: Number,
            default: 2000
        },
        // 需要显示的信息
        message: {
            type: String,
            default: ''
        },
        // 显示的位置
        position: {
            type: String,
            default: 'middle',
            validator (value) {
                return ['top', 'bottom', 'middle'].indexOf(value) >= 0;
            }
        },
        // 是否需要放大（用于canvas游戏，页面固定750，需要将toast放大两倍）
        isScale: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        enterToast () {
            return {[`position-${this.position}`]: true};
        }
    },

    methods: {
        // 关闭toast
        close () {
            this.$el.remove();
            this.$emit('close');
            this.$destroy();
        }
    },
    mounted () {
        if (this.autoClose) {
            setTimeout(() => {
                this.close();
            }, this.delay);
        }
    }
};

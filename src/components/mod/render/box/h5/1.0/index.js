export default {
    name: 'box',
    props: {
        // 需要显示的信息
        message: {
            type: String,
            required: true
        },

        // 需要显示的按钮组
        button: {
            type: Array,
            required: true
        }
    },

    methods: {
        // 关闭box
        close () {
            this.$el.remove();
            this.$emit('close');
            this.$destroy();
        },

        // 点击按钮回调事件
        handleClick (handleFn) {
            if (typeof handleFn === 'function') {
                // 把当前实例传回
                handleFn(this);
            } else {
                throw new Error('handle is not function');
            }
        }
    }
};

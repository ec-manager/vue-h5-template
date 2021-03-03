import Floating from './floating.js';
export default {
    name: 'floating',

    props: {
        // 图片地址
        src: {
            type: String,
            required: true
        },

        // 跳转地址
        href: {
            type: String,
            default: ''
        },

        // 点击流
        stat: {
            type: String,
            default: 'BTN_FLOATING'
        }
    },

    methods: {
        handleClick () {
            // 有配置跳转链接则直接跳转，
            if (this.href) {
                this.$href(this.href);
            }
            this.$emit('handlerFloatingLink');
                
        }
    },

    mounted () {
        this.$nextTick(function () {
            // 实例化Floating
            let drag = new Floating(this.$el);
            drag.init();
        });
    }
};

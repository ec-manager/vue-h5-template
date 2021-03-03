export default {
    name: 'gotop',

    data () {
        return {
            isShow: false
        };
    },

    props: {
        imgUrl: {
            type: String,
            default: 'https://cimg1.fenqile.com/product/M00/E5/84/hhoGAFq09LeAZz_rAAAEWqqaz7w590.png'
        }
    },

    methods: {
        // 点击事件处理函数
        handleClick () {
            // 获取页面滚动高度
            let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
            let offsetHeight = document.documentElement.offsetHeight || document.body.offsetHeight;
            let delta = offsetHeight * 0.032;

            let handle = setInterval(() => {
                if (scrollTop <= 0) {
                    clearInterval(handle);
                } else {
                    scrollTop -= delta;
                    if (document.documentElement.scrollTop) {
                        document.documentElement.scrollTop = scrollTop;
                    } else {
                        document.body.scrollTop = scrollTop;
                    }
                }
            }, 16);
        },

        // 滚动事件处理函数
        handleScroll () {
            // 获取页面滚动高度
            let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
            if (scrollTop > 800) {
                this.isShow = true;
            } else {
                this.isShow = false;
            }
        }
    },

    mounted () {
        this.$nextTick(function () {
            // 监听滚动事件
            document.addEventListener('scroll', () => {
                this.handleScroll();
            });
        });
    },

    destroyed () {
        document.removeEventListener('scroll');
    }
};

import Tool from '@/mod/util/tool/1.0/tool';
import App from '@/mod/util/app/h5/2.1/app.js';
/**
 * 头部：非app环境自己实现头部，app环境使用原始的头部
 * @param content 右边部分的内容，默认右边按钮
 * @param textColor 文案的颜色，默认黑色
 * @param bgColor 头部背景颜色，默认是白色
 * @param slotBgColor web自定义头部的占位元素，默认是白色
 * @param transformTextColor 滚动后的文案颜色，默认白色
 * @param transformBgColor 滚动后的头部背景颜色，默认蓝色
 * @param title 头部标题
 * @param type 右边部分的类型 包含两种 text|url，不填默认是文案
 * @param arrowIcon 左边返回键的icon，默认是黑色
 * @param transformArrowIcon 滚动后左边返回键的icon，默认是白色
 * @param needTransform 是否需要滚动时变背景和文案颜色
 * @param needScroll 是否需要滚动事件，如果不需要的话需手动设置为false，默认是需要的
 * @param needSlot 是否需要头部底部占位，默认是false
 * @param stat 上报的hottag
 * @param limit 距离底部limit高度时，触发到底函数，一般要大于0
 * eg:
 *  <modHeader
        :content="'测试'"
        @rightBtnCallBack="xxx"
        leftBtnPreventDefault="true"
        @leftBtnCallback="xxx"
        :stat="'xxx'"
        needScroll="true"
        @scrollBottom="scrollBottom"
    ></modHeader>
    注：如果需要直接使用对象的话可以尝试v-bind="xxx"
 */
export default {
    name: 'modHeader',
    props: {
        content: {
            type: String,
            default: ''
        },
        textColor: {
            type: String,
            default: '#000000'
        },
        bgColor: {
            type: String,
            default: '#ffffff'
        },
        slotBgColor: {
            type: String,
            default: '#ffffff'
        },
        transformTextColor: {
            type: String,
            default: '#fffffff'
        },
        transformBgColor: {
            type: String,
            default: '#626BF9'
        },
        title: {
            type: String,
            default: ''
        },
        titleFont: {
            type: String
        },
        type: {
            type: String,
            default: ''
        },
        arrowIcon: {
            type: String,
            default: '//cimg1.fenqile.com/product5/M00/08/D7/L9EHAF0cVuSAUNcVAAACYK1H6qs010.png'
        },
        transformArrowIcon: {
            type: String,
            default: '//cimg1.fenqile.com/product5/M00/2C/C0/MdEHAF3R-xuALRqVAAABz27Q59A993.png'
        },
        needTransform: {
            type: Boolean,
            default: true
        },
        needScroll: {
            type: Boolean,
            default: true
        },
        stat: {
            type: String,
            default: ''
        },
        limit: {
            type: Number,
            default: 10
        },
        leftBtnPreventDefault: {
            type: Boolean,
            default: false
        },
        needSlot: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            tool: Tool,
            scrollTop: 0,
            statusBarHeight: 0
        };
    },
    computed: {
        // 是否在app环境内
        isInApp () {
            return Tool.isInApp();
        },
        // 是否改变背景&&文案颜色&&左边按钮
        isTransformColor () {
            return this.needTransform && this.scrollTop > 0;
        }
    },
    methods: {
        // 右边部分的点击回调方法
        rightBtnCallBack () {
            this.$emit('rightBtnCallBack');
        },
        // 滚动事件
        scroll (opt) {
            this.$emit('scroll', opt);
        },
        // 滚动到底部
        scrollBottom () {
            this.$emit('scrollBottom');
        },
        // 左侧按钮点击
        leftBtnClick () {
            // 阻止默认返回
            if (this.leftBtnPreventDefault) {
                this.$emit('leftBtnCallback');
            } else {
                this.goBack();
            }
        },
        // h5的返回上一页
        goBack () {
            if (this.isInApp) {
                App.jsBridgeReady(() => {
                    App.invokeJsBridge('goBack');
                });
            } else {
                history && history.go(-1);
            }

        },
        // 滚动到底部加载
        scrollHandler () {
            // 使用scheduledAnimationFrame目的是防止重复绘制
            let scheduledAnimationFrame = false;
            const onScroll = () => {
                // 在还没绘制完成下一帧时不触发
                if (scheduledAnimationFrame) {
                    return;
                }
                scheduledAnimationFrame = true;
                // requestAnimationFrame方法让我们可以在下一帧开始时调用指定函数
                window.requestAnimationFrame(() => {
                    scheduledAnimationFrame = false;
                    let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                    let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
                    let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
                    this.scrollTop = scrollTop;
                    this.scroll({scrollTop, clientHeight, scrollHeight});
                    // 滚动到距离底部{limit}}px的位置
                    if (scrollHeight > clientHeight && scrollTop + clientHeight + this.limit >= scrollHeight) {
                        this.scrollBottom();
                    }
                });
            };
            window.addEventListener('scroll', onScroll);
        },
        // 设置头部高度，以便外部获取
        setHeadHeight () {
            this.$nextTick(function () {
                this.$emit('getHeadHeight', this.$refs.immersive_header.offsetHeight);
            });
        }
    },
    mounted () {
        if (this.isInApp) {
            App.jsBridgeReady(() => {
                App.invokeJsBridge('hideTitle');
                try {
                    App.invokeJsBridge('getStateBarHeight', {
                        onReturn: (data) => {
                            let statusBarHeight = data.statusBarHeight || 0;
                            if (statusBarHeight) {
                                this.statusBarHeight = (this.tool.isAppIos() ? statusBarHeight : statusBarHeight / window.devicePixelRatio) + 'px';
                            } else {
                                // 兼容处理，防止没有获取到安全区高度导致页面有问题
                                this.statusBarHeight = this.tool.toRem(this.tool.isIphoneX() ? 88 : 44);
                            }
                            this.setHeadHeight();
                        }
                    });
                } catch (err) {
                    // 兼容getStateBarHeight不可用，导致没有获取到安全区高度
                    this.statusBarHeight = this.tool.toRem(this.tool.isIphoneX() ? 88 : 44);
                    this.setHeadHeight();
                }
            });
        } else {
            this.setHeadHeight();
        }
    },
    created () {
        if (this.isInApp) {
            // 兼容处理，防止没有获取到安全区高度导致页面有问题
            this.statusBarHeight = this.tool.toRem(this.tool.isIphoneX() ? 88 : 44);
            this.setHeadHeight();
        }

        if (this.needScroll) {
            this.scrollHandler();
        }
    }
};

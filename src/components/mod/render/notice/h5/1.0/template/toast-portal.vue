<!--业务样式-->
<style scoped lang="less">
    @import '../../../../../../inc/sales/style/mixin/fn.less';
    .toast-wrap {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, .7);
        z-index: 100;
    }
    .toast-content {
        position: relative;
        background-size: cover;
    }
    .btn-wrap {
        display: flex;
        flex-direction: row;
    }
    .btn {
        display: flex;
        justify-content: center;
        align-items: center;
        .text {
            background: #bbb;
            color: #000;
            font-size: 30px;
        }
    }
</style>
<!--业务结构-->
<template>
    <div class="toast-wrap" v-expose="ht_tag">
        <img :src="picture_url" class="imgauto" :style="toast_style" @click="clickAction({action: action})" v-stat="ht_tag"/>
        <!-- 整图引导 重设点击区域 -->
        <div class="btn-wrap">
            <div v-if="positive_btn.text || positive_btn.src" :style="positive_btn_style" class="btn btn-left" @click="clickAction(positive_btn)" v-stat="positive_btn.ht_tag" v-expose="positive_btn.ht_tag">
                <!-- 图片 -->
                <template v-if="positive_btn.src">
                    <img class="imgauto btn-img" :src="positive_btn.src"/>
                </template>
                <!-- 文本 -->
                <template v-else>
                    <p class="text">{{positive_btn.text}}</p>
                </template>
            </div>
            <div v-if="negative_btn.text || negative_btn.src" :style="negative_btn_style" class="btn btn-left" @click="clickAction(negative_btn)" v-stat="negative_btn.ht_tag" v-expose="negative_btn.ht_tag">
                <!-- 图片 -->
                <template v-if="negative_btn.src">
                    <img class="imgauto btn-img" :src="negative_btn.src"/>
                </template>
                <!-- 文本 -->
                <template v-else>
                    <p class="text">{{negative_btn.text}}</p>
                </template>
            </div>
        </div>
        
    </div>
</template>
<!--业务逻辑-->
<script>
import Tool from '@/mod/util/tool/1.0/tool.js';

// 由于组件数据依赖奇门配置，奇门配置都使用下划线命名，这里统一以下划线进行命名
export default {
    data () {
        return {
            tool: Tool
        };
    },

    computed: {
        // 使用computed缓存计算结果 而非 method
        positive_btn_style() {
            var style = this.positive_btn.b_style || {};
            return this.transformStylePx(style);
        },
        // 右侧按钮
        negative_btn_style() {
            var style = this.negative_btn.b_style || {};
            return this.transformStylePx(style);
        },
        // 弹层外部样式
        toast_style(){
            var style = this.transformStylePx(this.t_style || {});
            style = Object.assign({}, style, this.t_custom_style);
            return style;
        }
    },

    // 此处属性都为奇门系统上配置，配置变量统一以下划线命名，这里不用驼峰
    props: {
        // 标题
        title: {
            type: String,
            default: '搜索挽留弹层'
        },

        // 默认点击图片行为是消失
        action: {
            type: String,
            default: 'dismiss'
        }, 
        // 自定义样式
        t_custom_style: {
            type: Object
        },
        // 弹层样式
        /**
            "height": 397,
            "top": 88
         */
        t_style: {
            type: Object,
            default: function () {
                return {};
            }
        },
        // 确定按钮
        /**
            ht_tag: 'ht_tag2',
            color: '#fffff',
            action: 'dismiss|url|goBack',
            text: '狠心拒绝'
         */
        positive_btn: {
            type: Object,
            default: function () {
                return {};
            }
        },
        // 取消/关闭按钮
        /**
            ht_tag: 'ht_tag2',
            color: '#fffff',
            action: 'dismiss|url|goBack',
            text: '狠心拒绝'
         */
        negative_btn: {
            type: Object,
            default: function () {
                return {};
            }
        },

        // 图片url
        picture_url: {
            type: String,
            default: ''
        },
        // 弹框hottag
        ht_tag: {
            type: String,
            default: ''
        }
    },

    methods: {
        // 按钮点击
        clickAction (data) {
            this.$emit('noticeAction', data);
        },

        // 转化单位
        transformStylePx (style = {}){
            for(var i in style){
                if(style[i] && String(style[i]).indexOf('rem') < 0){
                    style[i] = Tool.toRem(style[i]);
                }
            }
            return style;
        }
    },

    mounted () {
    }
};
</script>

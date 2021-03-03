
<!--业务样式-->
<style scoped lang="less">
    @import '../../../../../../inc/sales/style/mixin/fn.less';
    
    .ad-picture-box-wrap {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, .7);
        z-index: 100;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .ad-picture-content {
            position: relative;
            text-align: center;
        }
        .picture {
            width: 80%;
        }

        .ui-close {
            position: relative;
            margin: 30px/@p auto;
            width: 50px/@p;
            height: 50px/@p;
            border: 4px/@p solid #ededee;
            border-radius: 50%;
            opacity: 0.6;
        }

        .close-left {
            position: absolute;
            width: 30px/@p;
            height: 4px/@p;
            top: 23px/@p;
            left: 10px/@p;
            background-color: #ededee;
            transform: rotate(45deg);
        }

        .close-right {
            position: absolute;
            width: 30px/@p;
            height: 4px/@p;
            top: 23px/@p;
            left: 10px/@p;
            background-color: #ededee;
            transform: rotate(-45deg);
        }
    }
    
</style>

<!--业务结构-->
<template>
    <div class="ad-picture-box-wrap" v-expose="config.ht_tag">
        <div class="ad-picture-content">
            <img :src="picture_url" class="picture"  
                    @click="clickAction(config)" v-stat="config.ht_tag"/>
            <div class="ui-close" @click="clickAction({action: 'dismiss'})" v-stat="'ICON_CLOSE_ADS_BOX'">
                <div class="close-left" ></div>
                <div class="close-right" ></div>
            </div>
        </div>
    </div>
</template>

<!--业务逻辑-->
<script>
export default {
    data () {
        return {};
    },

    // 此处属性都为奇门系统上配置，配置变量统一以下划线命名，这里不用驼峰
    props: {
        // 图片url
        picture_url: {
            type: String,
            default: ''
        },
        // 扩展字段
        config: {
            type: Object,
            default: function () {
                return {};
            }
        }
    },

    methods: {
        // 按钮点击
        clickAction (data) {
            this.$emit('noticeAction', data);
        }
    },

    mounted () {
    }
};
</script>
<template>
    <div class="dialog-bg vm">
        <div class="dialog rule">
            <div class="rule-top">
                <h3>活动规则</h3>
                <ol class="list-rules">
                    <li v-for="(item,index) in options" :key="index">
                        <p v-html="item"></p>
                    </li>
                </ol>
            </div>
            <a href="javascript:;" @click="togglePopRuleStatus" class="dialog-btn" v-stat="'BTN_CLOSE_RULE'">
                我知道了
            </a>
        </div>
    </div>
</template>
<script>
/**
 * @author melody
 * @des 6周年活动规则
 * @params options：楼层配置
 */
export default {
    name: 'popRule',
    props: {
        // 配置信息
        options: {
            type: Array,
            default: () => {}
        }
    },
    methods: {
        togglePopRuleStatus () {
            this.$emit('togglePopRuleStatus');
        }
    }
};
</script>
<style lang="less" scoped>
@import '~@/inc/sales/style/mixin/fn.less';
@import '../style/dialogBg.less';
// 活动规则弹窗
.rule {
    padding: 20px/@p 0 40px/@p;
}
.rule-top {
    position: relative;
    margin-bottom: 30px/@p;
    color: #454545;
    line-height: 32px/@p;
    h3 {
        margin-top: 30px/@p;
        text-align: center;
        font-weight: 700;
        font-size: 32px/@p;
    }
    .list-rules {
        overflow-y: auto;
        margin-top: 30px/@p;
        padding-right: 20px/@p;
        padding-left: 60px/@p;
        max-height: 420px/@p;
        font-size: 12px;
        line-height: 1.5;
    }
    li {
        margin-top: 4px;
        text-align: left;
        word-break: break-all;
    }
}

</style>

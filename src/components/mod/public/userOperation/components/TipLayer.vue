<template>
    <div class="layer high">
        <div class="tip-layer-box">
            <p v-for="(tip, tipKey) in options.tips" class="tips" :key="tipKey">{{tip}}</p>
            <!-- todo 在小程序中可支持跳转到小程序中，当前仅支持h5 -->
            <a v-href="options.btn.link_h5" class="btn" v-stat="'BTN_LAYER_' + tipKey">{{options.btn.words}}</a>
        </div>
    </div>
</template>

<script>
/**
 * @author melody
 * @des 异常类遮罩
 */
export default {
    name: 'tipLayer',
    props: {
        options: {
            type: Object
        }
    },
    data () {
        return {
        };
    },
    methods: {
    }
};
</script>

<style lang="less" scoped>
@import '~@/inc/sales/style/mixin/fn.less';
@fontWeightMedium: 600;

.layer {
    &.high {
        z-index: 11;
    }
}

.tip-layer-box {
    width: 100%;
    text-align: center;
    font-size: 20px;
    color: #FFFFFF;
    .tips {
        line-height: 30px;
        font-weight: @fontWeightMedium;
    }
    .btn {
        width: 280px/@p;
        height: 88px/@p;
        color: #fff;
        background: #EB262D;
        border-radius: 44px/@p;
        margin-top: 38px/@p;
        font-weight: @fontWeightMedium;
        .margin-auto();
        .flex(vm)
    }
}
</style>

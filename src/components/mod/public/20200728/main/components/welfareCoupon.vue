<template>
    <div class="welfare-coupon" v-if="Object.keys(couponInfo) !== 0">
        <ul v-if="Object.keys(couponInfo) !== 0">
            <template v-for="couponId in cidList">
                <template v-if="couponInfo[couponId]">
                    <coupon-item
                        class="component-item"
                        v-for="(item,index) in getDiscountData(couponInfo[couponId].discount)"
                        :cid="couponId"
                        :coupon-info="couponInfo[couponId]"
                        :style="{height: tool.toRem(coupHeight)}"
                        :is-login="isLogin"
                        :key="couponId + index"
                        :item="item"
                        @success="handleSuccess">
                        <template slot="default" slot-scope="slot">
                        <div class="fn-wrap">
                            <img class="covimg"
                                v-lazy="tool.addDomain(authImg)"
                                :key="couponId + index">
                            <div :class="['btn-text', {'scale': slot.status !== 3}]"
                                :style="{color: btnColor, backgroundImage: `url(${tool.addDomain(btnBg)})`}"
                                v-html="changeText(slot.status)"></div>
                        </div>
                        </template>
                    </coupon-item>
                </template>
            </template>
        </ul>
    </div>
</template>

<script>
import CouponBase from '@/mixins/coupon/1.0/couponBase.js';
import CouponItem from '@/mod/render/couponItem/h5/1.0/index.vue';
import Tool from '@/mod/util/tool/1.0/tool.js';

export default {
    name: 'welfareCoupon',
    extends: CouponBase,
    components: {
        CouponItem
    },
    props: {
        isLogin: {
            type: Boolean,
            required: true
        },
        coupHeight: {
            type: [Number, String],
            default: 0
        },
        options: {
            type: Object,
            default: () => {}
        },
        cid: {
            type: [String, Array],
            required: true
        }
    },
    data () {
        return {
            toast: {
                1: '抢券时间还未开始呢，先去逛逛会场',
                2: '恭喜您，领取成功',
                3: '',
                4: '该场次的神券已抢完，去逛逛会场'
            },
            btnText: {
                1: '立即领取',
                2: '立即领取',
                3: '已领取',
                4: '成功领券'
            },
            hasGot: false, // 是否已领取优惠券
            tool: Tool
        };
    },
    computed: {
        // 领取按钮的字体颜色
        btnColor () {
            return this.options.btn_color;
        },
        // 领取按钮的背景图
        btnBg () {
            return this.options.btn_img;
        },
        // 新人引导授信图片，需与优惠券领取图片一致
        authImg () {
            return this.options.src_img;
        }
    },
    methods: {
        changeText (status) {
            return this.btnText[status];
        },
        handleSuccess ({status, discountEventId, serialNo}) {
            if (status !== 3) this.$toast(this.toast[status]);

            if (status === 2) {
                this.$toast(this.toast[status]);
                if (this.couponInfo[discountEventId].obtainType === 10) {
                    this.couponInfo[discountEventId].discountStatus[serialNo] = 3;
                } else {
                    this.couponInfo[discountEventId].status = 3;
                }
            }
        }
    },
    mounted () {
        this.getMultCoupon();
    }
};
</script>

<style lang="less" scoped>
@import '~@/inc/sales/style/mixin/fn.less';

.welfare-coupon {
    & + .welfare-coupon {
        margin-top: 20px/@p;
    }
}
.component-item {
    /deep/ a {
        position: relative;
        display: block;
        height: 100%;
    }
    /deep/ .fn-wrap {
        height: 100%;
    }
}

.coupon-item {
    position: relative;
}

.covimg {
    display: block;

    .size(100%);
}

// 按钮
.btn-text {
    position: absolute;
    right: 20px/@p;
    bottom: 20px/@p;
    .flex(vm);
    width: 187px/@p;
    height: 68px/@p;
    font-weight: 500;
    font-size: 28px/@p;
    background-repeat: no-repeat;
    background-size: contain;
}

.scale {
    animation: scale .6s infinite alternate;
}

@keyframes scale {
    to {
        transform: scale(1.05);
    }
}

</style>

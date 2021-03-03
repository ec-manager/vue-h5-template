<template>
    <div>
        <!-- 新人用户，未授信，展示开通广告位，引导授信 -->
        <a class="coupon-box"
            v-if="isNewer && !isAuth"
            :key="1"
            :style="{height: tool.toRem(coupHeight)}"
            v-href="authLink"
            v-stat="'BTN_LINK_AUTH'">
            <img class="covimg" v-lazy="tool.addDomain(authImg)"/>
            <div class="btn-text scale" :style="{color: btnColor, backgroundImage: `url(${tool.addDomain(btnBg)})`}">立即开通</div>
        </a>

        <!-- 新人授信用户未领取展示优惠券信息 -->
        <template v-else-if="isNewer && isAuth && !hasGot">
            <ul class="coupon-box" v-if="Object.keys(couponInfo).length">
                <template v-for="couponId in cidList">
                    <template v-if="couponInfo[couponId]">
                        <coupon-item
                            class="component-item"
                            v-for="(item,index) in getDiscountData(couponInfo[couponId].discount)"
                            :cid="couponId"
                            :couponInfo="couponInfo[couponId]"
                            :style="{height: tool.toRem(coupHeight)}"
                            :is-login="isLogin"
                            :key="couponId + index"
                            :item="item"
                            @success="handleSuccess">
                            <template slot="default" slot-scope="slot">
                            <div class="fn-wrap">
                                <img class="covimg" v-lazy="tool.addDomain(authImg)"/>
                                <div :class="['btn-text', {'scale': slot.status !== 3}]" :style="{color: btnColor, backgroundImage: `url(${tool.addDomain(btnBg)})`}" v-html="changeText(slot.status)"></div>
                            </div>
                            </template>
                        </coupon-item>
                    </template>
                </template>
            </ul>
        </template>

        <!-- 非新人，且已授信用户，可选择展示可配置的老用户广告位 -->
        <template v-else-if="!isNewer && isAuth">
            <a v-if="isShowOlder" class="coupon-box" :style="{height: tool.toRem(coupHeight)}"
                v-href="olderLink"
                v-stat="'BTN_LINK_OLDER'">
                <img class="covimg" v-lazy="tool.addDomain(olderImg)"/>
            </a>
            <a v-if="isShowLehei && isLeheiTarget" class="coupon-box" :style="{height: tool.toRem(coupHeight)}"
                v-href="leheiLink"
                v-stat="'BTN_LINK_LEHEI'">
                <img class="covimg" v-lazy="tool.addDomain(leheiImg)"/>
            </a>
        </template>
    </div>
</template>

<script>
import CouponBase from '@/mixins/coupon/1.0/couponBase.js';
import CouponItem from '@/mod/render/couponItem/h5/1.0/index.vue';
import Tool from '@/mod/util/tool/1.0/tool.js';

export default {
    name: 'newer-coupon',
    extends: CouponBase,
    components: {
        CouponItem
    },
    props: {
        cid: {
            type: [String, Array],
            required: true
        },
        isLogin: {
            type: Boolean,
            required: true
        },
        isNewer: {
            type: Boolean,
            default: false
        },
        isAuth: {
            type: Boolean,
            default: false
        },
        isLeheiTarget: {
            type: Boolean,
            default: false
        },
        options: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            toast: {
                1: '抢券时间还未开始呢，先去逛逛会场',
                2: '领取成功',
                3: '',
                4: '该场次的神券已抢完，去逛逛会场'
            },
            tool: Tool,
            // 是否已领取优惠券
            hasGot: false,
            // 优惠券领取按钮的文案
            btnText: {
                1: '立即领取',
                2: '立即领取',
                3: '成功领券',
                4: '成功领券'
            }
        };
    },
    computed: {
        // 领取按钮的字体颜色
        btnColor () {
            return this.options.newer_dif.btn_color;
        },
        // 领取按钮的背景图
        btnBg () {
            return this.options.newer_dif.btn_img;
        },
        // 新人引导广告位、新人券广告位、老用户广告位、乐卡用户广告位，采用同一个高度
        coupHeight () {
            return this.options.newer.height;
        },
        // 新人引导授信图片，需与优惠券领取图片一致
        authImg () {
            return this.options.newer_dif.src_img;
        },
        // 新人授信链接
        authLink () {
            return this.options.newer.credit_link;
        },
        // 是否展示老用户广告位
        isShowOlder () {
            return this.options.older.is_show;
        },
        // 老用户广告位图片
        olderImg () {
            return this.options.older_src_img;
        },
        // 老用户广告位链接
        olderLink () {
            return this.options.older.link;
        },
        // 是否展示乐黑卡广告位
        isShowLehei () {
            return this.options.lehei.is_show;
        },
        // 乐黑卡用户广告位图片
        leheiImg () {
            return this.options.lehei_src_img;
        },
        // 乐黑卡广告位链接
        leheiLink () {
            return this.options.lehei.link;
        }
    },
    methods: {
        changeText (status) {
            return this.btnText[status];
        },
        handleSuccess ({status, discountEventId, serialNo}) {
            if (status !== 3) this.$toast(this.toast[status]);

            if (status === 2) {
                this.$toast('领取成功');
                if (this.couponInfo[discountEventId].obtainType === 10) {
                    this.couponInfo[discountEventId].discountStatus[serialNo] = 3;
                } else {
                    this.couponInfo[discountEventId].status = 3;
                }
            }
        },
        // 获取多个优惠券信息，覆盖 coupon mixin 方法 19年双11需求：隐藏已领取的优惠券
        async getMultCoupon () {
            try {
                let retList = await Promise.all(this.getPromiseList);
                retList.forEach(item => {
                    if (parseInt(item.result) === 0) {
                        this.$set(this.couponInfo, item.data.result_rows.discountEventId, item.data.result_rows);
                        // 此时如果查询已领取，就设置 hasGot 为true
                        if (item.data.result_rows.status === 3) {
                            this.hasGot = true;
                        }
                    }
                });
            } catch (err) {
                this.$toast(err);
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

.coupon-box {
    position: relative;
    display: block;
    margin-bottom: -10px/@p;
    & + .coupon-box {
        margin-top: 20px/@p;
    }
}

.covimg {
    display: block;
    .size(100%);
}

// 按钮
.btn-text {
    position: absolute;
    right: 20px/@p;
    top: 38px/@p;
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

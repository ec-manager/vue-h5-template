<template>
    <div class="welfare-coupon">
        <ul v-if="Object.keys(couponInfo) !== 0"
            :btnText="btnText"
            :isLogin="isLogin">
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
                            <img :key="slot.status" :src="getImgUrl(item, slot.status)" class="covimg">
                            <div class="btn-text" :style="{color: btnColor, background: btnBgColor}" v-html="changeText(slot.status)"></div>
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
    name: 'newer-coupon',
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
                2: '成功领券',
                3: '',
                4: '该场次的神券已抢完，去逛逛会场'
            },
            btnText: {
                1: '立即领取',
                2: '立即领取',
                3: '成功领券',
                4: '成功领券'
            },
            // hasGot: false, // 是否已领取优惠券
            tool: Tool
        };
    },
    computed: {
        // 时段券按钮文字
        btnColor () {
            return this.options.color;
        },
        // 按钮背景色
        btnBgColor () {
            return `linear-gradient(to bottom, ${this.options.btn_bg_color[0]}, ${this.options.btn_bg_color[1]})`;
        }
    },
    methods: {
        getImgUrl (item, status) {
            let imgUrl = '';
            switch (status) {
            case 1:
                imgUrl = item['noStartImg'];
                break;
            case 2:
                imgUrl = (item['startImg'] ? item['startImg'] : item['noStartImg']);
                break;
            case 3:
                imgUrl = item['receivedImg'];
                break;
            case 4:
                imgUrl = item['endImg'];
                break;
            default:
                imgUrl = item['endImg'];
                break;
            }
            return imgUrl;
        },
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
        // async getMultCoupon () {
        //     try {
        //         let retList = await Promise.all(this.getPromiseList);
        //         retList.forEach(item => {
        //             if (parseInt(item.result) === 0) {
        //                 this.$set(this.couponInfo, item.data.result_rows.discountEventId, item.data.result_rows);
        //                 // 此时如果查询已领取，就设置 hasGot 为true
        //                 if (item.data.result_rows.status === 3) {
        //                     this.hasGot = true;
        //                 }
        //             }
        //         });
        //     } catch (err) {
        //         this.$toast(err);
        //     }
        // },

        getDiscountData (discount) {
            let list = [];
            // 兼容老活动数组形式
            if (Array.isArray(discount)) {
                list = discount;
            }

            if (typeof discount === 'object' && discount.couponData) {
                list = discount.couponData;
            }

            return list;
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

.btn-text {
    position: absolute;
    right: 14px/@p;
    top: 66px/@p;
    width: 167px/@p;
    height: 60px/@p;
    font-weight: 700;
    font-size: 24px/@p;
    border-radius: 30px/@p;

    .flex(vm);
}

</style>

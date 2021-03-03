import CouponModel from '@/model/CouponModel';

const couponModel = new CouponModel();
// const STATU_COUPON_UNGET = 0; // 未领取状态
// const STATUS_COUPON_GOT = 1; // 已领取状态
const STATUS_COUPON_RESTRICT = 2; // 领取限制状态
export default {
    name: 'tpsCoupon',
    props: {
        // 领取优惠券对应的skuId
        skuId: {
            type: String,
            required: true
        },
        // tpskey
        tpsKey: {
            type: String,
            required: true
        },
        // 领取状态
        receiveStatus: {
            type: Number,
            default: 2
        },
        // 是否登录
        isLogin: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            hasGotCoupon: false // 是否已经领取该券
        };
    },

    computed: {
        dataInfo () {
            // 接口返回以及领取后，更新优惠券状态
            return {
                hasGotCoupon: this.hasGotCoupon || this.receiveStatus === STATUS_COUPON_RESTRICT
            };
        }
    },

    methods: {
        async handleCoupon (skuId, tpsKey, receiveStatus) {
            if (!this.isLogin) {
                this.$login();
            }
            if (receiveStatus === STATUS_COUPON_RESTRICT) {
                return;
            }
            // 去领券， 成功后，修改状态
            try {
                let res = await couponModel.getVipCoupon(skuId, tpsKey);
                if (parseInt(res.result) === 0) {
                    this.hasGotCoupon = true;
                    this.$toast('领取成功');
                } else {
                    this.$toast(res.retmsg);
                }
            } catch (e) {
                this.$toast(e);
            }
        }
    }
};

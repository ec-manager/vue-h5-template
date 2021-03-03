// 这对2020年9月大促调整样式
// author feng
import CouponBase from '@/mixins/coupon/1.0/couponBase.js';
import couponItem from '@/mod/render/couponItem/h5/1.0/index.vue';
import couponTemplate from '@/mod/render/couponTemplate/h5/2.1/index.vue';
export default {
    name: 'coupon3_1',
    extends: CouponBase,
    props: {
        isLogin: {
            type: Boolean,
            required: true
        },

        // 成功回调函数
        successCallback: {
            type: Function,
            required: false
        },
        options: {
            type: Object,
            default: () => {}
        }
    },

    components: {
        couponItem, couponTemplate
    },

    methods: {
        handleSuccess ({status, discountEventId, serialNo}) {
            if (this.successCallback && typeof this.successCallback === 'function') {
                this.successCallback({status, discountEventId, serialNo}, this);
            } else {
                if (status === 2) {
                    this.$toast('领取成功');
                    if (this.couponInfo[discountEventId].obtainType === 10) {
                        this.couponInfo[discountEventId].discountStatus[serialNo] = 3;
                    } else {
                        this.couponInfo[discountEventId].status = 3;
                    }
                }
            }
        }
    },

    mounted () {
        this.getMultCoupon();
    }
};

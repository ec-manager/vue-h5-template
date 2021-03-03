import CouponModel from '@/model/CouponModel';
export default {
    name: 'couponTemplate',
    props: {
        cid: {
            type: String,
            required: true
        },
        // 优惠券信息
        couponInfo: {
            type: Object,
            required: true
        },

        // 是否需要登录
        isLogin: {
            type: Boolean,
            required: true
        },

        // 优惠券列表
        list: {
            type: Array,
            required: true,
            dafault: () => {
                return [];
            }
        }
    },
    computed: {
        isShow () {
            return !!Object.keys(this.couponInfo).length;
        }
    },
    methods: {
        // 领券
        async getCoupon (discountEventId, serialNo, sceneId) {
            try {
                let couponModel = new CouponModel();
                await couponModel.getCoupon(discountEventId, serialNo, sceneId);
                // 优惠券领取成功，通知父组件
                this.$emit('success', {status: 2, discountEventId, serialNo});
            } catch (err) {
                this.$toast(err);
            }
        },

        // 领取优惠券事件
        getCoupunEvent (serialNo, sceneId, status, link) {
            if (this.isLogin) {
                let couponStatus = parseInt(status);
                // 进行中才能领取
                if (couponStatus === 2) {
                    this.getCoupon(this.cid, serialNo, sceneId);
                } else {
                    if (this.couponInfo.limitTimeType === 20) {
                        if (couponStatus === 1) {
                            this.$toast('优惠券活动还未开始！');
                        } else if (couponStatus === 3) {
                            this.$href(link);
                        } else {
                            this.$toast('优惠券活动已结束！');
                        }
                    } else {
                        this.$href(link);
                    }
                }
            } else {
                this.$login();
            }
        }
    }
};

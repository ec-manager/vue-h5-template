import CouponBase from '@/mixins/coupon/1.0/couponBase.js';
import couponItem from '@/mod/render/couponItem/h5/1.0/index.vue';
export default {
    name: 'coupon',
    extends: CouponBase,
    props: {
        isLogin: {
            type: Boolean,
            required: true
        }
    },

    components: {
        couponItem
    },

    methods: {
        handleSucess () {
            this.getCouponInfo(this.cid);
        }
    },

    mounted () {
        this.getCouponInfo(this.cid);
    }
};

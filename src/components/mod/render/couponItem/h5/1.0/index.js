import CouponModel from '@/model/CouponModel';
export default {
    name: 'couponItem',
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
        // 需要展示的信息项
        item: {
            type: Object,
            required: true
        },
        // 是否需要登录
        isLogin: {
            type: Boolean,
            required: true
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

        // 获取优惠券图片路径
        getImgUrl (item, status) {
            let imgUrl = '';
            switch (parseInt(status)) {
            case 1:
                imgUrl = item['noStartImg'];
                break;
            case 2:
                imgUrl = item['startImg'] ? item['startImg'] : item['noStartImg'];
                break;
            case 3:
                imgUrl = item['receivedImg'];
                break;
            case 4:
                imgUrl = item['endImg'] ? item['endImg'] : item['noStartImg'];
                break;
            default:
                imgUrl = item['noStartImg'];
                break;
            }
            return imgUrl;
        },

        // 领取优惠券事件
        getCoupunEvent (serialNo, sceneId, status) {
            // 进行中才能领取
            if (parseInt(status) === 2) {
                if (this.isLogin) {
                    this.getCoupon(this.cid, serialNo, sceneId);
                } else {
                    this.$login();
                }
            } else {
                this.$emit('success', { status, discountEventId: this.cid, serialNo });
            }
        }
    }
};

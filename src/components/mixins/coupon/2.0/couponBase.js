// 优惠券组件2.0
import CouponModel from '@/model/CouponModel';
let couponModel = new CouponModel();
const CouponBase = {
    props: {
        // 优惠券活动ID
        cid: {
            type: String,
            required: true
        },

        // 1-查询当天24h的场次,2-查询当天前后24h场次,3-查询当前的场次
        seceneType: {
            type: Number,
            default: 1
        },

        // 提示信息
        tips: {
            type: Object,
            default: () => {
                return {
                    // 领取成功
                    success: '恭喜你领取成功',
                    // 券已抢完
                    over: '不好意思，券已经被抢完了',
                    // 已领取
                    received: '你已经领取过了'
                };
            }
        },

        // 是否是限时抢券
        isLimit: {
            type: Boolean,
            default: true
        },

        // 是否登录
        isLogin: {
            type: Boolean,
            default: false
        }
    },

    data () {
        return {
            // 优惠券信息
            couponInfo: {},
            // 场次列表
            seceneList: [],
            // 当前场次
            currentSecene: '',
            // 限时优惠券列表
            couponList: [],
            // 券包优惠券列表
            bagCouponList: []
        };
    },

    computed: {
        serialNoList () {
            return this.bagCouponList.map(item => {
                return item.serialNo;
            });
        }
    },

    methods: {
        // 获取场次信息
        async getAllSecene () {
            try {
                let ret = await couponModel.showScenes(this.cid, this.seceneType);
                // 获取场次列表
                this.seceneList = ret['data']['result_rows'] || [];
                if (this.seceneList.length) {
                    // 获取当前场次
                    this.currentSecene = this.seceneList[0];
                    // 获取场次下的优惠券
                    this.getCouponList(this.currentSecene.sceneId);
                }
            } catch (err) {
                this.$toast(err);
            }
        },

        // 改变场次
        handleChangeSecene (secene) {
            this.currentSecene = secene;
            this.getCouponList(this.currentSecene.sceneId);
        },

        // 根据场次ID获取优惠券列表
        async getCouponList (sceneId) {
            try {
                let ret = await couponModel.queryTps(this.cid, sceneId);
                let data = ret['data']['result_rows'] || [];
                if (this.isLimit) {
                    // 获取限时优惠券列表
                    this.couponList = data;
                } else {
                    // 获取券包优惠券列表
                    this.bagCouponList = data;
                }
            } catch (err) {
                this.$toast(err);
            }
        },

        // 根据优惠券序列号限时抢券
        async obtainLimitCoupon (serialNo, index) {
            try {
                let ret = await couponModel.obtainLimitTimeTps(this.cid, [serialNo], this.currentSecene.sceneId);
                let data = ret['data']['result_rows'];
                let status = parseInt(data[serialNo]);
                switch (status) {
                    case 0 :
                    // 领取成功
                        this.$emit('success', data);
                        this.tips.success && this.$toast(this.tips.success);
                        // 把券状态设置成已领取
                        this.couponList[index].status = 10;
                        break;
                    case 2:
                    // 已领取
                        this.$emit('received', data);
                        this.tips.received && this.$toast(this.tips.received);
                        // 把券状态设置成已领取
                        this.couponList[index].status = 10;
                        break;
                    default:
                    // 券已领完
                        this.$emit('over', data);
                        this.tips.over && this.$toast(this.tips.over);
                }
            } catch (err) {
                this.$toast(err);
            }
        },

        // 限时领券操作
        handleGetLimitCoupon (coupon, index) {
            if (!this.isLogin) {
                this.$login();
            } else {
                if (parseInt(coupon.status) === 20) {
                    this.obtainLimitCoupon(coupon.serialNo, index);
                } else {
                    // 非领取状态
                    this.$emit('end', coupon);
                }
            }
        },

        // 领取券包
        async obtainBagCoupon () {
            try {
                let ret = await couponModel.obtainTpsPacket(this.cid, this.serialNoList);
                let data = Object.values(ret['data']['result_rows'] || {});
                // 有一张券返回成功状态，则认为是成功的
                if (data.some(item => parseInt(item) === 0)) {
                    this.$emit('success', data);
                    this.tips.success && this.$toast(this.tips.success);
                    // 把券状态设置成已领取
                    this.bagCouponList = this.bagCouponList.map(item => {
                        item.status = 10;
                        return item;
                    });
                } else {
                    // 券已领完
                    this.$emit('over', data);
                    this.tips.over && this.$toast(this.tips.over);
                }
            } catch (err) {
                this.$toast(err);
            }
        },

        // 领取券包操作
        handleGetBagCoupon (coupon) {
            if (!this.isLogin) {
                this.$login();
            } else {
                if (parseInt(coupon.status) === 20) {
                    this.obtainBagCoupon();
                } else {
                    // 非领取状态
                    this.$emit('end', coupon);
                }
            }
        }
    },

    created () {
        if (this.isLimit) {
            // 限时抢券获取场次
            this.getAllSecene();
        } else {
            // 券包获取优惠券列表
            this.getCouponList();
        }
    }
};

export default CouponBase;

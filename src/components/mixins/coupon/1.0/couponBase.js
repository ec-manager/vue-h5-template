import CouponModel from '@/model/CouponModel';
let couponModel = new CouponModel();
const CouponBase = {
    props: {
        cid: {
            type: [String, Array],
            required: true
        }
    },

    data () {
        return {
            // 优惠券信息
            couponInfo: {},
            // 是否是模板活动
            isTemplateEvent: false
        };
    },

    computed: {
        // cid 集合
        cidList () {
            return typeof this.cid === 'string' ? [this.cid] : this.cid;
        },
        // 获取合并请求后的列表
        getPromiseList () {
            const cids = this.cidList.filter(cid => cid.length > 0); // 过滤掉空的cid，减少无意义的请求。
            return cids.map(cid => {
                return couponModel.getCouponInfo(cid);
            });
        }
    },

    methods: {
        // 获取单个优惠券信息
        async getCouponInfo (discountEventId) {
            try {
                let ret = await couponModel.getCouponInfo(discountEventId);
                this.couponInfo = ret['data']['result_rows'];
            } catch (err) {
                this.$toast(err);
            }
        },
        // 获取多个优惠券信息
        async getMultCoupon () {
            try {
                let retList = await Promise.all(this.getPromiseList);
                retList.forEach(item => {
                    if (parseInt(item.result) === 0) {
                        this.$set(this.couponInfo, item.data.result_rows.discountEventId, item.data.result_rows);
                    }
                });
            } catch (err) {
                console.error(err);
                this.$toast(err);
            }
        },

        // 获取优惠券配置数据
        getDiscountData (discount) {
            let list = [];
            // 兼容老活动数组形式
            if (Array.isArray(discount)) {
                list = discount;
                this.isTemplateEvent = false;
            }

            if (typeof discount === 'object' && discount.couponData) {
                // 是否是模板活动
                this.isTemplateEvent = !!discount.isTemplateEvent;
                if (this.isTemplateEvent) {
                    list = discount.templateData;
                } else {
                    list = discount.couponData;
                }
            }
            return list;
        }
    }
};

export default CouponBase;

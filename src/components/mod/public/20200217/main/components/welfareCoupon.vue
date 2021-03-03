<template>
    <div class="welfare-coupon">
        <div class="welfare" @click="getCoupons(couponStatus, cid)" v-stat="'WELFARE_IMG_AD'">
            <img v-lazy="tool.addDomain(options.img_src)" class="covimg">
            <div class="btn-text"
                :style="{color: btnColor, background: btnBgColor}">{{changeText(couponStatus)}}</div>
        </div>

        <div class="dialog-bg vm" v-if="isShowCoupList">
            <div class="dialog">
                <div class="close-btn" @click="closeDialog" v-stat="'BTN_GET_CUOPON_SUCCESS_CLOSE'"><span></span></div>
                <div class="coupon-list">
                    <a class="coupon-item"
                        v-for="(item, index) of tpsList"
                        :key="index"
                        v-href="item.link">
                        <div class="value-wrap"><span class="value">{{item.amount}}</span>元</div>
                        <div class="coupon-info">
                            <p class="condition">满{{item.amount_limit}}元可用</p>
                            <p class="kind">{{item.brand_desc}}</p>
                        </div>
                    </a>
                </div>
                <div class="dialog-mask">
                    <div @click="getCoupunEvent" class="dialog-btn" v-stat="'WELFARE_BTN_GET'">开心收下</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Tool from '@/mod/util/tool/1.0/tool.js';
import CouponBase from '@/mixins/coupon/1.0/couponBase.js';
import CouponModel from '@/model/CouponModel';
let couponModel = new CouponModel();

export default {
    name: 'welfare-coupon',

    extends: CouponBase,

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
            type: String,
            required: true
        },
        // 已领取跳转对应的楼层id
        targetFloor: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            toast: {
                1: '抢券时间还未开始呢，先去逛逛会场吧~',
                2: '',
                3: '',
                4: '该场次的神券已抢完，去逛逛会场吧~'
            },
            btnText: {
                1: '立即领取',
                2: '立即领取',
                3: '去使用',
                4: '已抢光'
            },
            hasGot: false, // 是否已领取优惠券
            couponStatus: 1,
            tool: Tool,
            targetOffsetTop: 0,
            domElm: document.documentElement || document.body,
            isShowCoupList: false,
            tpsList: []
        };
    },

    computed: {
        targetElm () {
            return document.getElementById(this.targetFloor);
        },

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
        scrollFun () {
            // this.domElm.scrollTop = this.targetElm.offsetTop;
            if (document.documentElement.scrollTop) {
                document.documentElement.scrollTop = this.targetElm.offsetTop;
            } else {
                document.body.scrollTop = this.targetElm.offsetTop;
            }
        },

        changeText (status) {
            return this.btnText[status];
        },

        closeDialog () {
            this.isShowCoupList = false;
        },

        // 已领取，则跳转到运营配置的楼层，可领取，则拉取优惠券列表展示弹窗
        getCoupons (status, discountEventId) {
            switch (status) {
            // 可领取，展示领取弹窗
            case 2:
                this.getTpsList();
                break;
            // 已领取，跳转锚链接
            case 3:
                this.scrollFun();
                break;
            // 其他展示toast提示用户
            default: this.$toast(this.toast[status]);
            }
        },

        // 领取优惠券
        async getCoupon (discountEventId, serialNo, sceneId) {
            try {
                let ret = await couponModel.getCoupon(discountEventId, serialNo, sceneId);

                // 接口更改，遍历所有优惠券，如果全都result不为0，则认为领取成功
                let isGetfail = Object.values(ret.data.result_rows).every(item => {
                    return +item.result !== 0;
                });

                if (!isGetfail) {
                    this.$toast('恭喜您，领取成功~');
                    this.couponStatus = 3;
                    this.closeDialog();
                }
            } catch (err) {
                this.$toast(err);
            }
        },

        // 领取优惠券事件
        getCoupunEvent () {
            if (this.isLogin) {
                let couponInfo = this.couponInfo;
                let serialNo = Object.keys(couponInfo.discountInfo)[0];
                let sceneId = couponInfo.sceneId;

                this.getCoupon(this.cid, serialNo, sceneId);
            } else {
                this.$login();
            }
        },

        // 查询优惠券列表信息
        // wiki: http://wiki.fenqile.com/pages/viewpage.action?pageId=31680195
        queryTps () {
            return Vue.prototype.$http.post('/route0002/discountEvent/queryTps.json', {
                discountEventId: this.cid,
                isGateway: true
            });
        },

        async getTpsList () {
            try {
                let ret = await this.queryTps();

                if (parseInt(ret.result) === 0) {
                    this.tpsList = ret.data.result_rows;
                }

                // 数据请求成功，展示优惠券列表弹窗
                this.isShowCoupList = true;
            } catch (err) {
                this.$toast(err);
            }
        },

        // 购物津贴一定是券包，所以不需要管obtainType，真有万一报个警告，好帮运营排查问题
        async getCounponStatus () {
            await this.getCouponInfo(this.cid);

            if (this.couponInfo.obtainType === 20) {
                this.couponStatus = this.couponInfo.status;
            } else {
                console.warn('配置有误，购物津贴并非券包');
            }
        }
    },
    mounted () {
        this.getCounponStatus();
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

.welfare {
    position: relative;
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
    right: 24px/@p;
    top: 24px/@p;
    width: 180px/@p;
    height: 72px/@p;
    font-weight: 500;
    font-size: 28px/@p;
    border-radius: 36px/@p;

    .flex(vm);
}

.dialog-bg {
    position: fixed;
    z-index: 5;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.7);

    .dialog {
        position: relative;
        width: 600px/@p;
        height: 530px/@p;
        padding: 220px/@p 30px/@p 0;
        background: url(../img/dialog_bg.png) center no-repeat / 100% 100%;
    }

    .close-btn {
        position: absolute;
        top: 0;
        right: 0;
        width: 41px;
        height: 41px;
        span {
            position: relative;
            display: block;
            width: 41px;
            height: 41px;
            transform: rotate(45deg);
            &:before,
            &:after {
                position: absolute;
                background-color: #ff8549;
                content: '';
            }
            &:before {
                top: 20px;
                left: 11px;
                width: 19px;
                height: 1px;
            }
            &:after {
                top: 11px;
                left: 20px;
                width: 1px;
                height: 19px;
            }
        }
    }

    .coupon-list {
        height: 384px/@p;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
    }

    .dialog-mask {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 120px/@p;
        padding-top: 70px/@p;
        background: url(../img/dialog_mask.png) center no-repeat / 100% 100%;
    }

    .dialog-btn {
        .flex(vm);
        width: 300px/@p;
        height: 100px/@p;
        margin: 0 auto;
        font-size: 36px/@p;
        font-weight: 700;
        letter-spacing: 2px;
        color: #bb4734;
        border-radius: 50px/@p;
        background-image: linear-gradient(#fbdebc, #f5c59e);
    }
}

.coupon-item {
    .flex();
    height: 120px/@p;
    color: #9c7250;
    border-radius: 10px/@p;
    background-color: #f9dfcb;

    &:nth-child(n+2) {
        margin-top: 10px/@p;
    }

    .value-wrap {
        position: relative;
        .flex(vm);
        width: 200px/@p;
        height: 100%;
        font-size: 30px/@p;
        font-weight: 500;

        &::before,
        &::after {
            content: '';
            position: absolute;
            right: -4px;
            .size(7px);
            border-radius: 3px;
            background-color: #be5240;
        }

        &::before {
            top: -3px;
        }

        &::after {
            bottom: -3px;
        }

        .value {
            margin-bottom: 6px/@p;
            font-size: 60px/@p;
            font-weight: 700;
        }
    }

    .coupon-info {
        .flex(jc v);
        padding: 0 48px/@p;
        .fx();
        overflow: hidden;
        border-left: 1px dotted #cc7360;
    }

    .condition {
        font-size: 28px/@p;
        font-weight: 500;
    }

    .kind {
        margin-top: 4px/@p;
        font-size: 20px/@p;
        color: #bb876a;
    }
}
</style>

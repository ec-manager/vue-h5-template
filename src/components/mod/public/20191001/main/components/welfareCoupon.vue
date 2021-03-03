<template>
    <div>
        <ul v-if="Object.keys(couponInfo) !== 0"
            :btnText="btnText"
            :isLogin="isLogin">
            <template v-for="couponId in cidList">
                <template v-if="couponInfo[couponId]">
                    <coupon-item
                        class="component-item"
                        v-for="(item,index) in couponInfo[couponId].discount"
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
                            <div class="btn-text" :style="{color: btnColor}" v-html="changeText(slot.status)"></div>
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
        cid: {
            type: [String, Array],
            required: true
        },
        isLogin: {
            type: Boolean,
            required: true
        },
        btnColor: {
            type: String,
            default: '#fff'
        },
        coupHeight: {
            type: Number,
            default: 208
        },
        btnText: {
            type: Object,
            default: () => {}
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
            tool: Tool
        };
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
        }
    },
    mounted () {
        this.getMultCoupon();
    }
};
</script>

<style lang="less" scoped>
@import "~@/inc/sales/style/mixin/fn.less";

.component-item {
    border-radius: 5px/@p;
    overflow: hidden;
    /deep/a{
        position: relative;
        display: block;
        height: 100%;
    }
    /deep/.fn-wrap{
        height: 100%;
    }
    /deep/.btn-text{
        position: absolute;
        right: 0;
        bottom: 0;
        .flex(vm);
        width: 180px/@p;
        height: 160px/@p;
        font-size: 36px/@p;
        font-weight: 700;
        letter-spacing: 2px;
        line-height: 42px/@p;
    }
}

.coupon-item {
    position: relative;
}

.covimg {
    display: block;
    .size(100%);
}

.btn-text{
    position: absolute;
    right: 0;
    bottom: 0;
    .flex(vm);
    width: 180px/@p;
    height: 160px/@p;
    font-size: 36px/@p;
    font-weight: 700;
    letter-spacing: 2px;
    line-height: 42px/@p;
}
</style>

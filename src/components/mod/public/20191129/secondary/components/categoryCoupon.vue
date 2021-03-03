<template>
    <section class="category-coupon-box">
        <global-title :options="options"></global-title>
        <div class="coupon-list-container">
            <div v-for="(item,index) of activeCouponList"
                :key="index + 'common'"
                :class="['coupon-list', 'coupon-list-'+item.cols]"
                :style="{minHeight: tool.toRem(item.height)}">
                <coupon2 :cid="item.cid" :isLogin="isLogin"></coupon2>
            </div>
        </div>
    </section>
</template>
<script>
/**
 * @author yosezheng
 * @des 黑五类目券组件，如果是需要走新人逻辑的优惠券，可在配置中添加字段is_newer_coupon为真来走新人判断逻辑
 * @params options：楼层配置
 * @params isLogin：是否登录
 * @params isShopNewUser：是否是电商新
 */
import Tool from '@/mod/util/tool/1.0/tool.js';
import Coupon2 from '@/mod/render/coupon/h5/3.0/index.vue';
import GlobalTitle from '@/mod/public/20191129/secondary/components/globalTitle';

export default {
    name: 'categoryCoupon',
    props: {
        options: {
            type: Object,
            default: () => {}
        },
        isLogin: {
            type: Boolean,
            default: false
        },
        isShopNewUser: {
            type: Boolean,
            default: false
        }
    },
    components: {
        Coupon2,
        GlobalTitle
    },
    computed: {
        // 根据配置时间和用户身份过滤后的数组
        activeCouponList () {
            // 有效时间段的优惠券数组
            const activeDateCoupons = this.options.time_list.filter(item => this.tool.isActiveDate(item) === 1);
            // 根据用户身份（新老用户，是否为新人优惠券）可以看到的优惠券数组，数组取0是防止运营配错时间导致多个时间段的优惠券都出来了
            // is_newer_coupon，配置系统中用于识别运营配置的新人优惠券
            const trulyShowCoupons = activeDateCoupons[0].coupon_list.filter(item => (item.is_newer_coupon && this.isShopNewUser) || !item.is_newer_coupon);

            return trulyShowCoupons;
        }
    },
    data () {
        return {
            tool: Tool
        };
    }
};
</script>
<style lang="less" scoped>
@import '~@/inc/sales/style/mixin/fn.less';
/deep/ .coupon-list-container {
    .coupon-list {
        .flex(vm);
        & + .coupon-list {
            margin-top: 6px/@p;
        }
        ul, li, a {
            height: 100%;
        }
    }
    ul {
        margin-right: -3px/@p;
        margin-left: -3px/@p;
        .flex(h, wrap);
    }
    li {
        box-sizing: border-box;
        padding-right: 3px/@p;
        padding-left: 3px/@p;

        flex-shrink: 0;
    }
    a {
        .flex(vm);
        img {
            max-width: 100%;
            max-height: 100%;
        }
    }
    // 1行1个优惠券
    .coupon-list-1 {
        ul {
            margin-right: 0;
            margin-left: 0;
        }
        li {
            padding: 0;
            width: 100%;
            &:nth-child(n+2) {
                margin-top: 6px/@p;
            }
        }
    }
    // 1行2个优惠券
    .coupon-list-2 {
        li {
            width: 50%;
            &:nth-child(n+3) {
                margin-top: 6px/@p;
            }
        }
    }
    // 1行3个优惠券
    .coupon-list-3 {
        li {
            width: 33.33%;
            &:nth-child(n+4) {
                margin-top: 6px/@p;
            }
        }
    }
    // 1行4个优惠券
    .coupon-list-4 {
        li {
            width: 25%;
            &:nth-child(n+5) {
                margin-top: 6px/@p;
            }
        }
    }
}

</style>

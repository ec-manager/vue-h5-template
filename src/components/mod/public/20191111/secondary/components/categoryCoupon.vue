<template>
    <section class="category-coupon-box">
        <global-title :options="options"></global-title>
        <div v-for="(timeItem, timeKey) in options.time_list"
            :key="timeKey+'coupon'"
            class="coupon-list-container">
            <template v-if="!options.is_template">
                <template v-if="tool.isActiveDate(timeItem) === 1">
                    <!-- 电商新优惠券，需要配置中配置 new_shopper_coupon_list 字段 -->
                    <template v-if="isShopNewUser">
                        <div v-for="(item,index) in timeItem.new_shopper_coupon_list"
                            :key="index + 'newer'"
                            :class="['coupon-list', 'coupon-list-'+item.cols]">
                            <coupon3 :cid="item.cid" :isLogin="isLogin"></coupon3>
                        </div>
                    </template>
                    <div v-for="(item,index) in timeItem.coupon_list"
                        :key="index + 'common'"
                        :class="['coupon-list', 'coupon-list-'+item.cols]">
                        <coupon3 :cid="item.cid" :isLogin="isLogin"></coupon3>
                    </div>
                </template>
            </template>
            
            <template v-else>
                <template v-if="isShopNewUser">
                    <div v-for="(item,index) in timeItem.new_shopper_coupon_list"
                        :key="index + 'template_newer'">
                        <coupon3 :cid="item.cid" :isLogin="isLogin" :options="options"></coupon3>
                    </div>
                </template>
                <div v-for="(item,index) in timeItem.coupon_list" :key="index + 'template'">
                    <coupon3 :cid="item.cid" :isLogin="isLogin" :options="options"></coupon3>
                </div>
            </template>
        </div>
    </section>
</template>
<script>
/**
 * @author melody
 * @des 双11类目券组件，当前未设置券的高度，存在高度未占位的问题，故设置minHeight
 * @params options：楼层配置
 * @params isLogin：是否登录
 * @params isShopNewUser：是否是电商新
 */
import Tool from '@/mod/util/tool/1.0/tool.js';
import Coupon3 from '@/mod/render/coupon/h5/3.0/index.vue';
import GlobalTitle from '@/mod/public/20191111/secondary/components/globalTitle';

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
        Coupon3,
        GlobalTitle
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

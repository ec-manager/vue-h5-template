/**
 * @author yosezheng
 * @desc 大促公用组件mixin，新人优惠券组件、时段津贴券、新人商品、吸底导航条
 */

import NewerCoupon from '@/mod/public/20200217/main/components/newerCoupon.vue'; // 新人优惠券
import WelfareCoupon from '@/mod/public/20200217/main/components/welfareCoupon.vue'; // 福利券
import NewerProduct from '@/mod/public/20200217/main/components/newerProduct.vue'; // 新人商品
import NavBottom from '@/mod/public/20200217/main/components/navBottom.vue'; // 吸底导航条

import EventModel from '@/model/EventModel.js';
const eventIns = new EventModel();

const componentsMixin = {
    components: {
        NewerCoupon,
        WelfareCoupon,
        NewerProduct,
        NavBottom
    },

    computed: {
        commonShow () {
            return this.eventConfig.common_show; 
        },

        // 新人优惠 + 新人商品 + 购物津贴
        venueConfig () {
            return Object.assign(G_VENUE_CONFIG.public_config, G_VENUE_CONFIG.venue_config);
        },
        // 公共底部导航
        venueNavBtm () {
            return G_NAV_BOTTOM_CONFIG;
        }
    },

    data () {
        return {
            // 是否为电商新人（未授信）
            isNewer: true,
            // 是否授信
            isAuth: false,
            // 是否为乐黑卡目标用户（已授信新人，未开通乐黑卡）
            isLeheiTarget: false
        };
    },

    methods: {
        loginCallback () {
            this.getUserType();
        },

        async getUserType () {
            try {
                let ret = await eventIns.getUserType(0);
                // 该接口未实现，虽然有文档，userType可以满足
                // UserTypeEnum相关数据如下
                // 0: EC_PLAT_NEW_USER(0, "电商平台新用户"), (平台新或者仅有一个有效订单且含指定sku的用户)
                // 1: PLAT_CREDIT(1, "授信用户"),
                // 2: NO_GT360_EC_ORDER(2, "没有订单状态大于等于360的电商订单"), (乐卡页面电商推荐专用)
                // 3: EC_CREDIT_NEW_USER(3, "授信新用户"), (同时满足0和1)
                // 4: PLAT_CREDIT_NEW(4, "平台新用户"), (如上接口不返回此数据，目前是单独查询的：调handler方法，增加参数platUserQuery为1)
                // 5: LE_BLACK(5, "乐黑卡用户"),
                // 6: LE_GOLD(6, "乐金卡用户"),
                // 7: EC_RE_BUY_USER(7, "电商复购用户"),
                // const userInfo = await this.getUserInfo();
                const userType = ret['data']['result_rows'] || [];

                this.isNewer = userType.includes(0);
                this.isAuth = userType.includes(1);
                this.isLeheiTarget = userType.includes(3) && !userType.includes(5);
            } catch (err) {
                this.$toast(err);
            }
        }
    },

    created () {

    }
};

export default componentsMixin;

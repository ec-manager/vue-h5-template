<template>
    <section class="pad" v-if="options['is_show']">
        <div v-for="(i, k) in options['time_list']" :key="k">
            <template v-if="tool.isActiveDate(i) === 1">
                <global-title :options="options"></global-title>
                <div>
                    <template v-if="isShopNewUser">
                        <div v-for="(item,index) in i.new_user_cid" :key="index+i" class="god-quan" :class="'god-quan-'+item['css']">
                            <coupon2  :cid="item['cid']" :is-login="isLogin"></coupon2>
                        </div>
                    </template>
                    <div v-for="(item,index) in i.more" :key="index" class="god-quan" :class="'god-quan-'+item['css']">
                        <coupon2 :cid="item['cid']" :is-login="isLogin"></coupon2>
                    </div>
                </div>
            </template>
            </div>
    </section>
</template>
<style lang="less" scoped>
@import "../../../../../inc/sales/style/mixin/fn.less";
@p: 75px/1rem;
@P: 75px/1rem;
/* 神券疯抢 */
/deep/.god-quan-1{
   li{
       width: 100%;margin-bottom: 8px/@P;
   }
}
/deep/.god-quan-2{
    ul{margin: 0 -4px/@p;.flex(wrap);
        li{
            width: 50%;margin-bottom: 8px/@P;
            padding: 0 4px/@p;
            box-sizing: border-box;
        }
    }
 }
 /deep/.god-quan-3{
    ul{margin: 0 -4px/@p;.flex(wrap);
    }
    li{
        width: 33.3333333333333333%;margin-bottom: 8px/@P;
        padding: 0 4px/@p;
        box-sizing: border-box;
    }
 }
 /deep/.god-quan-4{
    ul{margin: 0 -4px/@p;.flex(wrap);}
    li{
        width: 25%;margin-bottom: 8px/@P;
        padding: 0 4px/@p;
        box-sizing: border-box;
    }
 }
</style>
<script>
import Tool from '@/mod/util/tool/1.0/tool.js';
import Coupon2 from '@/mod/render/coupon/h5/2.0/index.vue';
import GlobalTitle from '@/mod/public/20190901/secondary/components/globalTitle.vue';
export default {
    name: 'big-kill',
    components: {
        Coupon2,
        GlobalTitle
    },
    computed: {},
    props: {
        // 精选大牌
        options: {
            type: Object,
            default: () => {
                return {};
            }
        },
        isLogin: {
            type: Boolean,
            default: false
        },
        isShopNewUser: {
            type: Boolean,
            default: true
        }
    },
    methods: {},
    data () {
        return {
            tool: Tool
        };
    },
    created () {}
};
</script>

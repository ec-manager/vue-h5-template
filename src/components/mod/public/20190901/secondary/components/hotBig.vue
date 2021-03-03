<template>
    <section class="pad" v-if="options['is_show']">
        <div v-for="(i, k) in options['time_list']" :key="k">
            <template v-if="tool.isActiveDate(i) === 1">
                <global-title :options="options"></global-title>
                <div  v-for="(item, index) in i['pic_list']" :key="index" class="hog-big-list" :class="['hog-big-list-'+item.css]">
                    <a v-for="(item2, index2) in item['pic']" v-stat="'HOT_BIG_'+index2" :key="index2" href="javascript:;" v-href="item2.link"><img class="imgauto" v-lazy="item2.img"></a>
                </div>
            </template>
        </div>
    </section>
</template>
<style lang="less" scoped>
@import "../../../../../inc/sales/style/mixin/fn.less";
@p: 75px/1rem;
@P: 75px/1rem;
/* 热卖大牌 */
.hog-big-list{
    a{
        width: 100%;
        margin-bottom: 10px/@p;
        display: block;
    }
    &.hog-big-list-2{
        margin: 0 -3px/@p;
        .flex(wrap);
        a{
            display: block;
            width: 50%;
            box-sizing: border-box;
            padding:0 3px/@p;
        }
    }
    &.hog-big-list-3{
        margin: 0 -3px/@p;
        .flex(wrap);
        a{
            display: block;
            width: 33.333333%;
            box-sizing: border-box;
            padding:0 3px/@p;
        }
    }&.hog-big-list-4{
        margin: 0 -3px/@p;
        .flex(wrap);
        a{
            display: block;
            width: 25%;
            box-sizing: border-box;
            padding:0 3px/@p;
        }
    }
}
</style>
<script>
import Tool from '@/mod/util/tool/1.0/tool.js';
import GlobalTitle from '@/mod/public/20190901/secondary/components/globalTitle.vue';
export default {
    name: 'hog-big',
    components: {
        GlobalTitle
    },
    computed: {},
    props: {
        // 品类推荐
        options: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    data () {
        return {
            tool: Tool
        };
    }
};
</script>

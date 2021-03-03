import Tool from '@/mod/util/tool/1.0/tool';
import activityProductItems from '../activityProductItems/index.vue';
/**
 * 推荐商品分类组件
 * @param list 列表数据
 * @param channelIcon 渠道的icon数据
 * eg:
 *  <activity-product 
 *    :list="activitySkuList" 
 *    :channel-icon="channelIcon" 
 *    @getProductDetailUrl="getProductDetailUrl" 
 * ></activity-product>
 */
export default {
    name: 'activityProduct',
    components: {
      activityProductItems
    },
    props: {
        list: {
           type: Array,
           required: true
        },
        channelIcon: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
           tool: Tool
        };
    },
    methods: {
        // 处理发布时间
        handleReleaseTime(time) {
            if(!time) {
                return;
            }
            let push_time = time.replace(/-/g, '/');
            let end_time = new Date(push_time);
            let now = new Date().getTime();
            let end = end_time.getTime();
            let year = end_time.getFullYear(); // 获取发布时间的年份
            let month = end_time.getMonth() + 1; // 获取发布时间的月份
            let day = end_time.getDate(); // 获取发布时间的日
            let formTime = [year, month, day].join('-'); // 只显示年-月-日
            if(now >= end) {
                let diff = (now - end) / 1000;
                let hour = Math.floor(diff / (60 * 60)); // 相差n小时
                if(hour == 0) { // 小于60分钟,则展示xx分钟以前
                    let min = Math.floor(diff / 60); // 相差n分钟
                    if(min > 0) { // 大于1分钟
                        return min + '分钟以前';
                    } else { // 小于1分钟
                        return '刚刚';
                    }
                }else if(hour < 24) { // 小于24小时显示xx小时前
                    return hour + '小时以前';
                }
                return formTime;
            } else {
                return formTime;
            }
        },

        // 跳转至详情
        getProductDetailUrl(channel_id, sku) {
            this.$emit('getProductDetailUrl', channel_id, sku);
        }
    }
};
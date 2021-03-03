/**
 * 推荐广告组件
 * @param list 广告数据
 * @param hotTag 数据上报ht
 * @param customClass 自定义类名
 * eg:
 *  <ad-list 
 *    :list="activitySkuList" 
 *    :hot-tag="'数据上报ht'"
 *    @linkToCps="linkToCps" 
 * ></recommend-product>
 */
export default {
    name: 'adList',
    props: {
        list: {
            type: Array,
            required: true
        },
        hotTag: {
            type: String,
            default: 'IMG_LINK_TO_AD'
        },
        customClass: {
            type: String
        }
    },
    methods: {
        linkToCps (item, adIndex, index) {
            this.$emit('linkToCps', item, `${this.hotTag}_${adIndex}_${index}`);
        }
    }
};
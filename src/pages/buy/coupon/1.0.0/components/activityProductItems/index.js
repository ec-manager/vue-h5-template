/**
 * 推荐商品组件（保留垂直版本和水平版本）
 * @param channelId 渠道id
 * @param list 商品列表数据
 * @param layoutType 主要有两个值 1：垂直版本 2：水平版本
 * @param channelIcon 渠道icon的图片
  <activity-product-items 
            :channel-id="product.channel_id"
            :list="product.sku_list" 
            :layout-type="product.layout_type" 
            :channel-icon="channelIcon"
            @getProductDetailUrl="getProductDetailUrl"
    ></activity-product-items>
 */
export default {
    name: 'activityProductItems',
    props: {
       channelId: {
            type: Number,
            default: 1
       },
       list: {
           type: Array,
           required: true
       },
       layoutType: {
           type: [Number. String],
           default: 1
       },
       channelIcon: {
            type: Object,
            required: true
       }
    },
    data() {
        return {
            lehuaIcon: `${location.protocol}//cimg1.fenqile.com/product5/M00/8A/B0/MNEHAF9rELSAHwvLAAAC2DqVuBI589.png`
        }
    },
    computed: {
        // 只展示前3个有效的sku
        displayList() {
            return this.list.filter(x => x && x.sku_id).splice(0, 3);
        }
    },
    methods: {
        // 处理sku列表的价格展示
        handlePrice(price) {
            let price_arr = String(price).split('.');
            if(price_arr.length > 1) {
                return `<span class="yuan">&yen;</span><span class="price">${price_arr[0]}</span><span class="price-float">.${price_arr[1]}</span>`;
            } 
            return `<span class="yuan">&yen;</span><span class="price">${price}</span>`;
        },
        // 跳转至详情
        getProductDetailUrl(channel_id, sku) {
            this.$emit('getProductDetailUrl', channel_id, sku);
        }
    }
};
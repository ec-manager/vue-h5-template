/**
 * 推荐商品组件
 * @param list 列表数据
 * @param channelIcon 渠道的icon数据
 * eg:
 *  <recommend-product 
 *    :list="activitySkuList" 
 *    :channel-icon="channelIcon" 
 *    @getProductDetailUrl="getProductDetailUrl" 
 * ></recommend-product>
 */
export default {
    name: 'recommendProduct',
    props: {
        list: {
            type: Array,
            required: true
        },
        hotTag: {
            type: String,
            default: 'THEME_RECOMMEND'
        },
        customClass: {
            type: String
        }
    },
    data () {
        return {
            imgSrc: {
                lehua: '//cimg1.fenqile.com/product5/M00/8A/B0/MNEHAF9rELSAHwvLAAAC2DqVuBI589.png', // 乐花卡icon
                lazy_more_img: `//cres2.fenqile.cn/sale/img/core/h5/default.png` // 加载默认图片 
            }
        };
    },
    methods: {
        // 处理sku列表的价格展示
        handlePrice (price) {
            let price_arr = String(price).split('.');
            if (price_arr.length > 1) {
                return `<span class="yuan">&yen;</span><span class="price">${price_arr[0]}</span><span class="price-float">.${price_arr[1]}</span>`;
            }
            return `<span class="yuan">&yen;</span><span class="price">${price}</span>`;
        },
        // 跳转至详情
        clickSku (sku) {
            this.$emit('clickSku', sku);
        },
        lazyMore () {
            this.$emit('lazyMore');
        }
    }
};
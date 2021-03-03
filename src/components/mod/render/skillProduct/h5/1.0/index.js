import ProductBase from '@/mixins/product/1.0/productBase.js';
export default {
    name: 'skillProduct',
    extends: ProductBase,
    props: {
        // 商品列数
        cols: {
            type: Number,
            default: 1,
            validator (value) {
                return [1, 2, 3].includes(value);
            }
        },
        wrapClass: {
            type: String,
            default: 'seckill-pro'
        }
    },
    computed: {
        // 获取商品样式
        getProductClass () {
            return this.cols === 1 ? 'seckill-one-pro' : this.cols === 2 ? 'seckill-two-pro' : 'seckill-three-pro';
        }
    }
};

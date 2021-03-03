import ProductBase from '@/mixins/product/1.0/productBase.js';
export default {
    name: 'product',
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
            default: 'sales-pro'
        }
    },
    computed: {
        // 获取商品样式
        getProductClass () {
            let className = 'sales-one-pro';
            switch (this.cols) {
            case 1:
                className = 'sales-one-pro';
                break;
            case 2:
                className = 'sales-two-pro';
                break;
            case 3:
                className = 'sales-three-pro';
                break;
            default:
                className = 'sales-one-pro';
            }
            return className;
        }
    }
};

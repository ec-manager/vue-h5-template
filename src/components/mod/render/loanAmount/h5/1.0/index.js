import AmountModel from '@/model/AmountModel.js';
export default {
    name: 'loanAmount',

    data () {
        return {
            // 可借款额度
            loanAmount: 0,
            // 可购物额度
            buyAmount: 0
        };
    },

    watch: {
        isLogin () {
            this.getUserAmount();
        }
    },

    props: {
        // 是否登录
        isLogin: {
            type: Boolean,
            required: true
        }
    },

    methods: {
        // 获取用户额度
        async getUserAmount () {
            try {
                const amountModel = new AmountModel();
                let ret = await amountModel.getUserAmount();
                let data = ret['data']['result_rows'];
                this.loanAmount = data['pocket_avl_credit'] || 0;
                this.buyAmount = data['goods_avl_credit'] || 0;
            } catch (err) {
                this.$toast(err);
            }
        }
    }
};

import wx from 'weixin-js-sdk';
import PayModel from '@/model/PayModel';
const payModel = new PayModel();

const PayBase = {
    data () {
        return {
            // sku详细信息
            skuInfo: {},
            // 轮询次数
            queryNumber: 0
        };
    },

    props: {
        // 商品ID
        skuId: {
            type: String,
            default: ''
        },

        // 支付成功后回跳地址
        successUrl: {
            type: String,
            default: ''
        },

        // 支付失败后回跳地址
        failUrl: {
            type: String,
            default: ''
        }
    },

    computed: {
        // 获取平台类型
        getChannelType () {
            const ua = navigator.userAgent.toLowerCase();
            const isApp = /fenqile_(ios|android)_(\d{1,}\.\d{1,}\.\d{1,})/i;
            const isWeb = /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i;
            return isApp.test(ua) ? 2 : isWeb.test(ua) ? 3 : 1;
        }
    },

    methods: {
        // 获取虚拟sku详细信息
        async getSkuInfo (skuId) {
            if (skuId) {
                try {
                    const ret = await payModel.queryVirtualSkuBase([skuId]);
                    let data = ret['data']['result_rows']['sku_list'] || {};
                    if (data[skuId]) {
                        this.skuInfo = data[skuId];
                    }
                } catch (error) {
                    this.$toast(error);
                }
            }
        },

        // 获取虚拟sku额外信息索引
        async getSaleIndex () {
            // 已经拉取到sku信息
            if (this.skuInfo.sku_id) {
                try {
                    const ret = await payModel.getSaleIndex(this.skuInfo.sku_id, this.skuInfo.sale_type, this.skuInfo.origin_amount);
                    let saleIndex = ret['data']['result_rows']['sale_index'];
                    this.createOrder(saleIndex);
                } catch (error) {
                    this.$toast(error);
                }
            } else {
                this.$toast('商品信息不存在');
            }
        },

        // 创建订单
        async createOrder (saleIndex = '') {
            try {
                const ret = await payModel.createOrder({},
                    [{
                        // 索引
                        index: 0,
                        // 1-普通，2-搭售，3-加价购，4-套餐
                        item_type: 1,
                        // 订单类型
                        order_type: 10,
                        // 购买数量
                        quantity: 1,
                        // 商品类型
                        sale_type: this.skuInfo.sale_type,
                        // skuId
                        sku_id: this.skuInfo.sku_id,
                        // 虚拟附属信息索引
                        sale_index: saleIndex
                    }],
                    this.getChannelType);

                let olderId = ret['data']['result_rows']['parent_order_id'] || '';
                if (olderId) {
                    this.queryCreateOrderResult(olderId);
                }
            } catch (error) {
                this.$toast(error);
            }
        },

        async queryCreateOrderResult (olderId) {
            this.queryNumber++;
            if (this.queryNumber < 10) {
                try {
                    const ret = await payModel.queryCreateOrderResult(olderId);

                    let result = ret['data']['result_rows']['order_add_result'];
                    let parentOrderId = ret['data']['result_rows']['parent_order_id'];

                    if (result === 'SUC') {
                        // 创建订单成功
                        this.confirmOrderForPay(parentOrderId);
                        this.queryNumber = 0;
                    } else if (result === 'FAIL') {
                        this.queryNumber = 0;
                        this.$toast('订单创建失败，请尝试重试下单');
                    } else {
                        // 订单未创建成功，继续查询结果
                        setTimeout(() => {
                            this.queryCreateOrderResult(olderId);
                        }, 1000);
                    }
                } catch (error) {
                    this.$toast(error);
                }
            } else {
                this.$toast('此过程超过我们的预期，请尝试重试下单');
            }
        },

        // 拉起微信支付
        async confirmOrderForPay (parentOrderId) {
            try {
                const ret = await payModel.confirmOrderForPay(parentOrderId);
                let data = ret['data']['result_rows'];
                if (data['pay_trans_info']) {
                    let wxParams = data['pay_trans_info']['req_data'];
                    let urlParams = Object.assign({
                        pay_order_id: data.pay_order_id,
                        parent_order_id: parentOrderId,
                        success_url: this.successUrl,
                        fail_url: this.failUrl
                    }, wxParams);

                    let payUrl = this.joinParams('/pages/buy/lxtPay/index', urlParams);

                    // 跳转到小程序中转页面
                    wx.miniProgram.redirectTo({
                        url: payUrl
                    });
                } else {
                    this.$toast('您的账户存在风险，为了保护您的账户安全，请前往分期乐完成验证流程后，再次尝试微信支付');
                }
            } catch (error) {
                this.$toast(error);
            }
        },

        // 拼接参数
        joinParams (url = '', params = {}) {
            let href = '';
            // 判断url中是否已存在?，若不存在，则在后面补充?
            if (url.indexOf('?') < 0) {
                href = href.concat(url, '?');
            } else {
                href = href.concat(url, '&');
            }

            // 遍历入参，若key为空或者undefined则跳过该参数
            for (let key in params) {
                if (key === 'undefined' || !key) {
                    continue;
                } else {
                    // 拼接参数
                    href = href.concat(key, '=', encodeURIComponent(params[key]), '&');
                }
            }

            // 将多余的字符（?或者&）移除
            href = href.substr(0, href.length - 1);
            return href;
        }
    },

    created () {
        // 拉取虚拟sku信息
        this.getSkuInfo(this.skuId);
    }
};

export default PayBase;

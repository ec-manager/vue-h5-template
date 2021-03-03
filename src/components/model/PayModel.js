/**
 * @name 支付订单模型类
 * @author beginning
 * @class PayModel
 */
class PayModel {
    /**
     * 获取虚拟商品信息
     * @returns Promise
     * @param {String} skuId [ 商品skuID ]
     * @memberof PayModel
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=33860799 ]
     */
    queryVirtualSkuBase (skuId, channelId = 'FQL') {
        return Vue.prototype.$http.post('/route0002/virtual/queryVirtualSkuBase.json', {
            sku_id_list: skuId,
            ec_channel_id: channelId,
            isGateway: true
        });
    }

    /**
     * 创建订单
     * @returns Promise
     * @param {Object} commonData [ 商品优惠信息 ]
     * @param {Array} skuList [ sku列表 ]
     * @param {Array} channelType [ 平台类型 1:pc 2:app 3:h5 ]
     * @memberof PayModel
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=31091292 ]
     */
    createOrder (commonData, skuList, channelType) {
        return Vue.prototype.$http.post('/route0002/ecOrder/createOrder.json', {
            common_data: commonData,
            sku_list: skuList,
            channel_type: channelType,
            isGateway: true
        });
    }

    /**
     * 获取虚拟商品sale_index
     * @returns Promise
     * @param {String} skuId [ 商品skuId ]
     * @param {Number} saleType [ 商品类型 ]
     * @param {Number} price [ 商品价格 ]
     * @param {String} chargeAccount [ 充值账号 ]
     * @memberof PayModel
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=33860799 ]
     */
    getSaleIndex (skuId, saleType, price, chargeAccount = '') {
        return Vue.prototype.$http.post('/route0002/virtual/getSaleIndex.json', {
            sku_id: skuId,
            sale_type: saleType,
            price: price,
            charge_account: chargeAccount,
            isGateway: true
        });
    }

    /**
     * 查询创建订单结果
     * @returns Promise
     * @param {String} parentOrderId [ 订单ID ]
     * @memberof PayModel
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=31091292 ]
     */
    queryCreateOrderResult (parentOrderId) {
        return Vue.prototype.$http.post('/route0002/ecOrder/queryCreateOrderResult.json', {
            parent_order_id: parentOrderId,
            isGateway: true
        });
    }

    /**
     * 确认支付订单
     * @returns Promise
     * @param {String} parentOrderId [ 订单ID ]
     * @param {Number} payWay [ 支付方式 20：微信支付 ]
     * @param {Number} payType [ 支付类型 2000021：乐小推]
     * @param {Number} channelType [ 支付端 4：小程序]
     * @param {Number} serviceId [ 服务ID ]
     * @memberof PayModel
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=35696184 ]
     */
    confirmOrderForPay (parentOrderId, payWay = 20, payType = 2000021, channelType = 4, serviceId = 101) {
        return Vue.prototype.$http.post('/route0002/ecOrder/confirmOrderForPay.json', {
            parent_order_id: parentOrderId,
            pay_way: payWay,
            pay_type: payType,
            channel_type: channelType,
            service_id: serviceId,
            isGateway: true
        });
    }
}

export default PayModel;

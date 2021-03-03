/**
 * @name 新版抽奖组件模型类
 * @author beginning
 * @class DrawPrizeModel
 */
class DrawPrizeModel {
    /**
     * @description 查询抽奖奖品信息列表
     * @param {String} eventId [活动ID]
     * @param {String} componentId [组件ID]
     * @returns {Promise}
     * @memberof DrawPrizeModel
     */
    queryPrizeList (eventId, componentId) {
        return Vue.prototype.$http.post('/route0002/eventMall/draw/queryPrizeList.json', {
            eventId: eventId,
            componentId: componentId,
            isGateway: true
        });
    }

    /**
     * @description 开始抽奖
     * @param {String} eventId [活动ID]
     * @param {String} componentId [组件ID]
     * @returns {Promise}
     * @memberof DrawPrizeModel
     */
    drawPrize (eventId, componentId) {
        return Vue.prototype.$http.post('/route0002/eventMall/draw.json', {
            eventId: eventId,
            componentId: componentId,
            isGateway: true
        });
    }

    /**
     * @description 增加抽奖次数
     * @param {String} eventId [活动ID]
     * @param {String} componentId [组件ID]
     * @returns {Promise}
     * @memberof DrawPrizeModel
     */
    addDrawNumber (eventId, componentId) {
        return Vue.prototype.$http.post('/route0002/eventMall/extraNum.json', {
            eventId: eventId,
            componentId: componentId,
            isGateway: true
        });
    }

    /**
     * @description 查询我的奖品列表
     * @param {String} eventId [活动ID]
     * @param {String} componentId [组件ID]
     * @param {Number} df [是否是所有的 ]
     * @returns {Promise}
     * @memberof DrawPrizeModel
     */
    queryMyPrize (eventId, componentId, df = 0) {
        return Vue.prototype.$http.post('/route0002/eventMall/draw/myPrize.json', {
            eventId: eventId,
            componentId: componentId,
            df: df,
            isGateway: true
        });
    }

    /**
     * @description 抽奖玩家注册
     * @param {String} eventId [活动ID]
     * @param {String} componentId [组件ID]
     * @param {Number} pt [注册用户类型]
     * @returns {Promise}
     * @memberof DrawPrizeModel
     */
    playerRegiste (eventId, componentId, pt = 0) {
        return Vue.prototype.$http.post('/route0002/eventMall/playerRegiste.json', {
            eventId: eventId,
            componentId: componentId,
            pt: pt,
            isGateway: true
        });
    }

    /**
     * @description 获取抽奖剩余次数
     * @param {String} eventId [活动ID]
     * @param {String} componentId [组件ID]
     * @returns {Promise}
     * @memberof DrawPrizeModel
     */
    queryDrawLeftNum (eventId, componentId) {
        return Vue.prototype.$http.post('/route0002/eventMall/queryDrawLeftNum.json', {
            eventId: eventId,
            componentId: componentId,
            isGateway: true
        });
    }

    /**
     * @description 用户登录增加抽奖次数
     * @param {String} eventId [活动ID]
     * @param {String} componentId [组件ID]
     * @returns {Promise}
     * @memberof DrawPrizeModel
     */
    addBrandDrawNum (eventId, componentId) {
        return Vue.prototype.$http.post('/route0002/eventMall/draw/addBrandDrawNum.json', {
            eventId: eventId,
            componentId: componentId,
            isGateway: true
        });
    }

    /**
     * @description 填写实物奖品的收货地址
     * @param {String} eventId [活动ID]
     * @param {String} componentId [组件ID]
     * @param {String} prizeId [奖品ID]
     * @param {String} deliveryAddress [收货地址]
     * @returns {Promise}
     * @memberof DrawPrizeModel
     */
    fillDeliveryAddress (eventId, componentId, prizeId, deliveryAddress) {
        return Vue.prototype.$http.post('/route0002/eventMall/draw/fillDeliveryAddress.json', {
            eventId: eventId,
            componentId: componentId,
            prizeId: prizeId,
            deliveryAddress: deliveryAddress,
            isGateway: true
        });
    }

    /**
     * @description 查询增加额外次数流水
     * @param {String} eventId [活动ID]
     * @param {String} componentId [组件ID]
     * @param {String} businessId:'xxxx' [选填]业务ID,String
     * @returns {Promise}
     * @memberof DrawPrizeModel
     */
    queryExtraNumList (eventId, componentId, businessId) {
        return Vue.prototype.$http.post('/route0002/eventMall/queryExtraNumList.json', {
            eventId: eventId,
            componentId: componentId,
            businessId: businessId,
            isGateway: true
        });
    }
}

export default DrawPrizeModel;

/**
 * 接口文档：http://wiki.fenqile.com/pages/viewpage.action?pageId=31680195
 * @name 优惠券模型类
 * @author beginning
 * @class CouponModel
 */
class CouponModel {
    /**
     * 获取优惠券信息
     * @param {String} discountEventId 优惠券ID
     * @returns Promise
     * @memberof CouponModel
     */
    getCouponInfo (discountEventId) {
        return Vue.prototype.$http.post('/route0002/discountEvent/queryDiscountEvent.json', {
            discountEventId: discountEventId,
            isGateway: true
        });
    }

    /**
     * 领取用户券
     * @param {String} discountEventId 优惠券ID
     * @param {String} serialNo 优惠券序列号
     * @param {Number} sceneId  场次ID
     * @returns Promise
     * @memberof CouponModel
     */
    getCoupon (discountEventId, serialNo, sceneId) {
        const data = {
            discountEventId: discountEventId,
            isGateway: true
        };

        if (serialNo) {
            data.serialNo = Array.isArray(serialNo) ? serialNo : [serialNo];
        }

        if (sceneId) {
            data.sceneId = sceneId;
        }

        return Vue.prototype.$http.post('/route0002/discountEvent/obtainTps.json', data);
    }

    /**
     * 查询限时抢券场次
     * @param {String} discountEventId 优惠券活动ID
     * @param {Number} timeFlag  标记位 [ 1-查询当天24h的场次,2-查询当天前后24h场次,3-查询当前的场次 ]
     * @returns Promise
     * @memberof CouponModel
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=38404964 ]
     */
    showScenes (discountEventId, timeFlag = 1) {
        return Vue.prototype.$http.post('/route0002/optDiscountEvent/showScenes.json', {
            discountEventId: discountEventId,
            timeFlag: timeFlag,
            isGateway: true
        });
    }

    /**
     * 根据场次ID查询优惠券列表信息
     * @param {String} discountEventId 优惠券活动ID
     * @param {Number} sceneId  场次ID [ 不传返回当前场次的优惠券 ]
     * @returns Promise
     * @memberof CouponModel
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=38404964 ]
     */
    queryTps (discountEventId, sceneId) {
        return Vue.prototype.$http.post('/route0002/optDiscountEvent/queryTps.json', {
            discountEventId: discountEventId,
            sceneId: sceneId,
            isGateway: true
        });
    }

    /**
     * 券包领取优惠券
     * @param {String} discountEventId 优惠券活动ID
     * @param {Array} serialNoList  优惠券序列号数组
     * @returns Promise
     * @memberof CouponModel
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=38404964 ]
     */
    obtainTpsPacket (discountEventId, serialNoList) {
        return Vue.prototype.$http.post('/route0002/optDiscountEvent/obtainTpsPacket.json', {
            discountEventId: discountEventId,
            serialNoList: serialNoList,
            isGateway: true
        });
    }

    /**
     * 限时领取优惠券
     * @param {String} discountEventId 优惠券活动ID
     * @param {Array} serialNoList  优惠券序列号数组
     * @param {Number} sceneId  场次ID
     * @returns Promise
     * @memberof CouponModel
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=38404964 ]
     */
    obtainLimitTimeTps (discountEventId, serialNoList, sceneId) {
        return Vue.prototype.$http.post('/route0002/optDiscountEvent/obtainLimitTimeTps.json', {
            discountEventId: discountEventId,
            serialNoList: serialNoList,
            sceneId: sceneId,
            isGateway: true
        });
    }

    /**
     * 乐小推领取用户vip券
     * @wiki http://wiki.fenqile.com/pages/viewpage.action?pageId=45325518
     * @param {String} skuId
     * @param {String} tpsKey
     * @need 该接口在登录态下调用
     * @returns Promise
     * @memberof CouponModel
     */
    getVipCoupon (skuId, tpsKey) {
        return Vue.prototype.$http.post('/route0002/vip/convertVipDiscount.json', {
            skuId,
            tpsKey,
            isGateway: true
        });
    }
}

export default CouponModel;

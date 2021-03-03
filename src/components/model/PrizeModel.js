/**
 * @name 抽奖组件模型类
 * @author beginning
 * @class PrizeModel
 */
class PrizeModel {
    /**
     * @description [ 抽奖 ]
     * @param {String} eventId [ 抽奖活动ID]
     * @returns Promise
     * @memberof PrizeModel
     */
    drawPrize (eventId) {
        return Vue.prototype.$http.post('/sales/salesCgi/draw_prize.json', {event_id: eventId});
    }

    /**
     * @description [ 获取抽奖次数 ]
     * @param {String} eventId
     * @returns Promise
     * @memberof PrizeModel
     */
    getLotteryTimes (eventId) {
        return Vue.prototype.$http.post('/sales/salesCgi/get_lottery_times.json', {event_id: eventId});
    }

    /**
     * @description [ 获取奖品列表 ]
     * @param {String} eventId
     * @returns Promise
     * @memberof PrizeModel
     */
    getPrizeList (eventId) {
        return Vue.prototype.$http.post('/sales/salesCgi/get_prize_list.json', {event_id: eventId});
    }
}

export default PrizeModel;

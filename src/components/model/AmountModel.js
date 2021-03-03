/**
 * @name 金额组件模型类
 * @author beginning
 * @class AmountModel
 */
class AmountModel {
    /**
     * 获取用户额度
     * @returns Promise
     * @memberof AmountModel
     */
    getUserAmount () {
        return Vue.prototype.$http.get('/route0002/activeList/creditQuery.json');
    }
}

export default AmountModel;

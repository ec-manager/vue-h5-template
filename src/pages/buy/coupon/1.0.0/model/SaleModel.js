/**
 * @name 方法模型
 * @wiki http://wiki.fenqile.com/pages/viewpage.action?pageId=56608764
 * @class SaleModel
 */

class SaleModel {
    // 查询好友相关信息
    queryCountInfo () {
        return Vue.prototype.$http.post('/route0002/caidan/cps/inviter/cashbackIndex.json', {
            isGateway: true,
            source: 2
        });
    }
    // 领取红包
    receiveBonus (taskId) {
        return Vue.prototype.$http.post('/route0002/caidan/cps/recommendPage/addUserTask.json', {
            isGateway: true,
            source: 2,
            task_id: taskId
        });
    }
}

export default SaleModel;

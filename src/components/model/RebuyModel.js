/**
 * @name CGI方法模型
 * @author melody
 * @class RebuyModel
 * @wiki http://wiki.fenqile.com/pages/viewpage.action?pageId=42052672
 */
class RebuyModel {
    /**
     * @description [ 复购激活任务 ]
     * @param {String} JobId
     * @param {Number} type
     * @returns Promise
     * @memberof RebuyModel
     */
    activeUserJob (jobId, type) {
        return Vue.prototype.$http.post('/route0002/job/activeUserJob.json', {
            jobId,
            type,
            isGateway: true
        });
    }

    /**
     * @description [ 复购完成任务 ]
     * @param {String} userJobId
     * @returns Promise
     * @memberof RebuyModel
     */
    finishUserJob (userJobId) {
        return Vue.prototype.$http.post('/route0002/job/finishUserJob.json', {
            userJobId,
            isGateway: true
        });
    }
}

export default RebuyModel;

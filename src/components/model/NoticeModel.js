/**
 * @name 弹窗接口
 * @wiki http://wiki.fenqile.com/pages/viewpage.action?pageId=30404219
 * @class NoticeModel
 */

class NoticeModel {
    // 查询好友相关信息
    notice (scene) {
        return Vue.prototype.$http.post('/route0001/user/notice.json', {
            isGateway: true,
            scene
        });
    }
}
export default new NoticeModel();

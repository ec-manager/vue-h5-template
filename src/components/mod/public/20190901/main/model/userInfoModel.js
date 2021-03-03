/**
 * 接口文档：http://wiki.fenqile.com/pages/viewpage.action?pageId=15632388
 * @name 优惠券模型类
 * @author yose
 * @class UserInfoModel
 */
class UserInfoModel {
    /**
     * @description 获取用户信息混合纬度
     * @returns {Promise}
     */
    getUserMixin () {
        return Vue.prototype.$http('/sales/201907260166561/get_user_mixin_info.json');
    }
}

export default UserInfoModel;

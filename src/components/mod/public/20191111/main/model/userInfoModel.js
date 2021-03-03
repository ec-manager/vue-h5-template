/**
 * 接口文档：http://wiki.fenqile.com/pages/viewpage.action?pageId=15632388
 * @name 用户类型
 * @author yose
 * @class UserInfoModel
 */
class UserInfoModel {
    /**
     * @memberof SaleModel
     * @description 获取用户信息混合纬度
     * @returns {Promise}
     */
    getUserMixin () {
        return Vue.prototype.$http('/sales/201909250281533/get_user_mixin_info.json');
    }
}

export default UserInfoModel;

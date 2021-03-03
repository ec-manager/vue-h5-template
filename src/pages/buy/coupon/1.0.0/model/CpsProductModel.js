class CpsProductModel {
    /**
     * @description [ 购物返现金额查询 ]
     * @returns Promise
     * @param Source {Number} [来源 1淘物星球 2分期乐]
     * @param fqlOrderStatusMap {Object} [标记：分期乐订单状态列表 待收货： [2, 3]、待返现：[4、7]、已返现：[8]]
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=51019935 ]
     */
    queryUserAccountStatus (Source, fqlOrderStatusMap) {
        return Vue.prototype.$http.post('/route0002/caidan/cps/queryUserAccountStatus.json', {
            source: Source,
            fql_order_status_map: fqlOrderStatusMap,
            isGateway: true
        });
    }
    /**
     * @description [ 用户订单数量查询 ]
     * @param Source {Number} [来源 1淘物星球 2分期乐]
     * @returns Promise
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=51019935 ]
     */
    queryUserOrderCount (Source) {
        return Vue.prototype.$http.post('/route0002/caidan/cps/queryUserOrderCount.json', {
            source: Source,
            isGateway: true
        });
    }
    /**
     * @description [ 用户任务列表查询 ]
     * @returns Promise
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=57673819 ]
     */
    queryUserTaskList () {
        return Vue.prototype.$http.post('/route0002/caidan/cps/recommendPage/queryUserTaskList.json', {
            isGateway: true
        });
    }
    /**
     * @description [ 用户点击按钮“去完成” ]
     * @returns Promise
     * @param taskId {String|Number} [任务id]
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=57673819 ]
     */
    addUserTask (taskId) {
        return Vue.prototype.$http.post('/route0002/caidan/cps/recommendPage/addUserTask.json', {
            task_id: taskId,
            isGateway: true
        });
    }
    /**
     * @description [ 猜你喜欢tab页商品查询 ]
     * @returns Promise
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=57673819 ]
     */
    queryGuessYouLikeGoods () {
        return Vue.prototype.$http.post('/route0002/caidan/cps/recommendPage/queryGuessYouLikeGoods.json', {
            isGateway: true
        });
    }
    /**
     * @description [ 查询主题推荐商品 ]
     * @returns Promise
     * @param limit {Number} [每页的总数]
     * @param page {Number} [当前的页数]
     * @param deviceInfo {Object} [设备信息]
     * @param currentTabInfo {Object} [当前选中的tab信息]
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=57673819 ]
     */
    queryRecommendGoods (page = 1, limit = 20, deviceInfo = {}, currentTabInfo = {}) {
        let offset = (page - 1) * limit; // 偏移值 = （当前页面 - 1）* 每页请求的数量
        return Vue.prototype.$http.post('/route0002/caidan/cps/recommendPage/queryRecommendGoods.json', {
            limit,
            offset,
            device_value: deviceInfo.deviceValue || '',
            device_type: deviceInfo.deviceType || 2,
            device_code: deviceInfo.deviceCode || '',
            type: currentTabInfo.type,
            source_id: currentTabInfo.source_id,
            channel_id: currentTabInfo.channel_id,
            channel_type: currentTabInfo.channel_type,
            recommend_type: currentTabInfo.recommend_type || 0,
            isGateway: true
        });
    }
    /**
     * @description [ 获取hippo配置 ]
     * @returns Promise
     * @param moduleReq {String} [模块名]
     * @param namespace {String} [命名空间]
     */
    getModuleConfig (moduleReq, namespace) {
        return Vue.prototype.$http.post('/route0002/common/getModuleConfig.json', {
            module_req: moduleReq,
            namespace: namespace,
            isGateway: true
        });
    }
    /**
     * @description [ 批量获得活动信息 ]
     * @returns Promise
     * @param options {Object} [参数]
     * @param options.source_id {Number} [来源，1淘物星球 2分期乐]
     * @param options.device_type {Number} [设备类型 1：IOS 2:安卓]
     * @param options.activitys {Array} [活动列表信息]
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=57673819 ]
     */
    queryRecommendActivitys (options) {
        return Vue.prototype.$http.post('/route0002/caidan/cps/recommendPage/queryRecommendActivitys.json', Object.assign({isGateway: true}, options));
    }
    /**
     * @description [ 首页特权卡查询 ]
     * @returns Promise
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=43459732 ]
     */
    getIndexPrivilege () {
        return Vue.prototype.$http.post('/route0002/caidan/cps/lepay/getIndexPrivilege.json', {
            isGateway: true
        });
    }
    /**
     * @description [ 乐花卡特权卡-领取特权卡 ]
     * @returns Promise
     * @param privilegeId {String|Number} [特权卡id]
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=43459732 ]
     */
    sendPrivilege (privilegeId) {
        return Vue.prototype.$http.post('/route0002/caidan/cps/lepay/sendPrivilege.json', {
            privilege_id: privilegeId,
            isGateway: true
        });
    }
    /**
     * @description [ 乐花卡特权卡信息查询 ]
     * @param privilegeType {String|Number} [特权卡类型,1:额度卡,2:次数卡]
     * @returns Promise
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=43459732 ]
     */
    getPrivilegeInfo (privilegeType) {
        return Vue.prototype.$http.post('/route0002/caidan/cps/lepay/getPrivilegeInfo.json', {
            privilege_type: privilegeType,
            isGateway: true
        });
    }
    /**
     * @description [ 是否超级会员判断 ]
     * @returns Promise
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=43459732 ]
     */
    getUserType () {
        return Vue.prototype.$http.post('/route0002/caidan/cps/user/getUserType.json', {
            isGateway: true
        });
    }
}

export default new CpsProductModel();

/**
 * @name CGI方法模型
 * @author beginning
 * @class EventModel
 */
class EventModel {
    /**
     * @description [ 获取用户登录态,已废弃采用getCheckLogin ]
     * @returns Promise
     * @memberof EventModel
     */
    getIsLogin () {
        return Vue.prototype.$http.get('/sales/salesCgi/is_login.json');
    }
    /**
     * @description [ getaway获取用户登录态 ]
     * @returns Promise
     * @memberof EventModel
     * @wiki 查询不到wiki，平台提供的链接
     */
    getCheckLogin () {
        return Vue.prototype.$http.get('route0001/verifyLogin/checkLogin.json');
    }
    /**
     * @description [ 获取活动ID下的配置，已废弃，采用getEventConfig ]
     * @param {String} id
     * @returns Promise
     * @memberof EventModel
     */
    getOmsConfig (id) {
        return Vue.prototype.$http.post('/sales/salesCgi/get_config.json', {event_id: id});
    }
    /**
     * @description [ 获取微信签名 ]
     * @param {String} url url链接
     * @returns Promise
     * @memberof EventModel
     */
    getWxSign (url) {
        return Vue.prototype.$http.post('/sales/salesCgi/get_wx_signpackage.json', {page_url: url});
    }

    /**
     * @description [ 获取微信签名新接口 ]
     * @param {String} url url链接
     * @param {String} serviceId [ 服务号ID 默认值1 ]
     * @returns Promise
     * @memberof EventModel
     * @wiki http://wiki.fenqile.com/pages/viewpage.action?pageId=34079371
     */
    getWeiXinSign (url, serviceId = '20') {
        return Vue.prototype.$http.post('/route0014/platform/wechatNo/wechat/getSDKConfig.json', {apiTicketUrl: url, serviceId: serviceId, isGateway: true});
    }

    /**
     * 同步商祥 - 收藏商品
     * @param {String} skuId sku-id
     * @param {String} CMD ADD为加入收藏,DELETE为取消收藏
     * @wiki http://wiki.fenqile.com/pages/viewpage.action?pageId=31930147
     * @returns Promise
     * @memberof EventModel
     */
    collectProduct (skuId, CMD) {
        return Vue.prototype.$http.post('/route0002/productDetail/productFavorite.json', {sku_id: skuId, CMD, isGateway: true});
    }
    /**
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=33455981 ]
     * @description [ 是否预约 ]
     * @param {String} eventId [ 预约的ID ]
     * @returns Promise
     * @memberof EventModel
     */
    isSubscribe (eventId) {
        return Vue.prototype.$http.post('/route0002/eventMallUser/hasSubscribe.json', {eventId, isGateway: true});
    }
    /**
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=33455981 ]
     * @description [ 预约活动 ]
     * @param {String} eventId [ 预约的ID ]
     * @returns Promise
     * @memberof EventModel
     */
    subscribe (eventId) {
        return Vue.prototype.$http.post('/route0002/eventMallUser/subscribe.json', {eventId, isGateway: true});
    }
    /**
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=33455981 ]
     * @description [ 获取用户信息，主要用于判断用户是否在某时间内开通某种权益 ]
     * @param {Number} hasLeHua [ 是否需要拉取乐花权益 0：不需要， 1：需要 ]
     * @param {Time} startTime [ 活动开始时间 ]
     * @param {Time} endTime [ 活动结束时间 ]
     * @returns Promise
     * @memberof EventModel
     */
    getUserInfo (hasLeHua = 0, startTime, endTime) {
        return Vue.prototype.$http.post('/route0002/eventAcc/queryUserInfoWithLe.json', {
            lehua: hasLeHua,
            startTime,
            endTime,
            isGateway: true
        });
    }
    /**
     * @description [ 获取短信验证码 ]
     * @param {String} mobile [ 手机号 ]
     * @param {String} code [ 图形验证码 ]
     * @returns Promise
     * @memberof EventModel
     */
    sendSmsCode (mobile, code) {
        return Vue.prototype.$http.post('/sales/salesCgi/send_sms_code.json', {
            mobile: mobile,
            imgcode: code
        });
    }
    /**
     * @description [ 校验短信验证码 ]
     * @param {String} mobile [ 手机号 ]
     * @param {String} code [ 短信验证码 ]
     * @returns Promise
     * @memberof EventModel
     */
    verifySmsCode (mobile, code) {
        return Vue.prototype.$http.post('/sales/salesCgi/verify_sms.json', {
            mobile: mobile,
            sms_code: code
        });
    }
    /**
     * @description [ 急速授信 ]
     * @param {number} channelFlag [ 用户注册渠道来源 ]
     * @param {string} agent [ agent码 ]
     * @param {string} [action = 'mobileRegister']
     * @param {number} [sceneType = 20] [ 外部验证手机注册 ]
     * @param {number} [passwdType = 2] [ 系统设置密码 ]
     * @param {number} [loginFlag = 1] [ 外部鉴权认证通过标识 ]
     * @returns Promise
     * @memberof EventModel
     */
    accountRegister (channelFlag, agent, domain, action = 'mobileRegister', sceneType = 20, passwdType = 2, loginFlag = 1) {
        return Vue.prototype.$http.post('/routev2/accountRegister.json', {
            action,
            sceneType,
            passwdType,
            ext_auth_login_flag: loginFlag,
            channel_flag: channelFlag,
            agent,
            domain: domain,
            isGateway: true,
            system: {
                controller: 'accountRegisterService'
            }
        });
    }

    // 分享增加游戏次数
    addShare (eventId) {
        return Vue.prototype.$http.post('/sales/salesCgi/add_share.json', {event_id: eventId});
    }

    /**
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=36545000 ]
     * @description [ 获取活动配置 ]
     * @param {String} eventId [ 活动的ID ]
     * @returns Promise
     * @memberof EventModel
     */
    getEventConfig (eventId) {
        console.log('getEventConfig', eventId);
        return Vue.prototype.$http.post('/route0002/eventMall/queryManualConfig.json', {eventId, isGateway: true});
    }

    /**
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=31089844 ]
     * @description [ 获取活动基本信息 ]
     * @param {String} eventId [ 活动的ID ]
     * @returns Promise
     * @memberof EventModel
     */
    getEventBaseInfo (eventId, channelType) {
        return Vue.prototype.$http.post('/route0002/eventMall/queryEventConfig.json', {event_id: eventId, channel_type: channelType, isGateway: true});
    }

    /**
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=26632783 ]
     * @description [ 获取用户类型 ]
     * @param {String} use_real_time [ 是否是查询电商新 ]
     * @param {String} needPlatUser [ 是否是查询平台新 0:否(同上面的getRealTimeUserType)，1:是(返回是否平台新和是否授信) ]
     * @returns Promise
     * @memberof eventModel
     */
    getUserType (useRealTime = 1, needPlatUser = 0) {
        return Vue.prototype.$http.post('/route0002/user/getUserTypeList.json', {
            use_real_time: useRealTime,
            needPlatUser,
            isGateway: true
        });
    }

    /**
     * @description [ 获取自助发布活动编辑器数据 ]
     * @param {String} eventId [ 活动的ID ]
     * @returns Promise
     * @memberof EventModel
     */
    getEditorData (eventId) {
        return Vue.prototype.$http.post('/route0002/eventMall/queryHtmlData/json', {
            event_id: eventId,
            isGateway: true
        });
    }

    /**
     * @description [ 获取用户头像、昵称 ]
     * @returns Promise
     * @memberof EventModel
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=37508308 ]
     */
    getUserBaseInfo () {
        return Vue.prototype.$http.get('/route0002/eventMallUser/userInfo.json');
    }

    /**
     * @description [ 获取图形验证码 ]
     * @returns Promise
     * @memberof EventModel
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=37508308 ]
     */
    getImageCode () {
        return Vue.prototype.$http.get('/route0002/eventMallUser/imageCode.json?random=' + new Date().getTime());
    }

    /**
     * @description [ 发送短信验证码 ]
     * @returns Promise
     * @param {String} imageCode [ 图形验证码 ]
     * @param {String} mobile [ 手机号 ]
     * @memberof EventModel
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=37508308 ]
     */
    smsCode (imageCode, mobile) {
        return Vue.prototype.$http.post('/route0002/eventMallUser/loginSendSms.json', {
            imageCode: imageCode,
            mobile: mobile,
            isGateway: true
        });
    }

    /**
     * @description [ 校验短信验证码 ]
     * @returns Promise
     * @param {String} smsCode [ 短信验证码 ]
     * @param {String} mobile [ 手机号 ]
     * @param {String} domain [ 域名 ]
     * @memberof EventModel
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=37508308 ]
     */
    checkSmsCode (smsCode, mobile, svid, domain) {
        return Vue.prototype.$http.post('/route0002/eventMallUser/mobileAuthSmsLogin.json', {
            smsCode: smsCode,
            mobile: mobile,
            svid: svid,
            domain: domain,
            isGateway: true
        });
    }
}

export default EventModel;

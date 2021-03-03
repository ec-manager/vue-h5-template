/**
 * @name 淘宝授权模型
 * @class TaobaoGrantModel
 * @wiki http://wiki.fenqile.com/pages/viewpage.action?pageId=42052672
 */
class TaobaoGrantModel {
    /**
     * @description [ 淘宝授权回调接口 ]
     * @returns Promise
     * @param code {Number} [用户授权后获取的code]
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=51019935 ]
     */
    grantCallback (code) {
        return Vue.prototype.$http.post('/route0002/caidan/cps/homePage/grantCallback.json', {
            code: code,
            isGateway: true
        });
    }
    /**
     * @description [ 渠道推广链接获取 ]
     * @returns Promise
     * @param options.active_id {String} [推广活动id，京东/淘宝/拼多多的活动id形式不一样]
     * @param options.channel {Integer} [渠道类型]
     * @param options.device_type {Integer} [设备类型 1：IOS 2:安卓]
     * @param options.source {Integer} [来源，1：淘物星球，2：分期乐]
     * @param options.theme_id_list {Array} [主题ID列表，只有拼多多才需要传,如[1,235]]
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=43459732 ]
     */
    getPromotionUrl (options) {
        return Vue.prototype.$http.post('/route0002/caidan/cps/active/promotion.json', Object.assign({isGateway: true}, {
            active_id: options.active_id,
            channel: options.channel,
            device_type: options.device_type,
            source: options.source,
            theme_id_list: options.theme_id_list,
            active_type: options.active_type || ''
        }));
    }
    /**
     * @description [ 渠道推广链接获取 ]
     * @returns Promise
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=43459732 ]
     */
    tbAuthBindInfo (deviceType) {
        return Vue.prototype.$http.post('/route0002/caidan/cps/tb_auth_bind_info.json', {
            device_type: deviceType,
            isGateway: true
        });
    }
}

export default new TaobaoGrantModel();

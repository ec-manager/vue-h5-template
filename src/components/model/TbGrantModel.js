import Url from '@/mod/util/url/h5/1.0/url.js';

// 只要为分期乐app上或者使用百川sdk打开的场景都需要进行安卓和IOS的判断，纯web端如Safari、微信打开都匹配为h5
const Tool = {
    // 判断安卓
    isAndroid: function () {
        let ua = navigator.userAgent;
        let patt = /fenqile_android_(\d{1,}\.\d{1,}\.\d{1,})/i;
        let res = patt.exec(ua);
        // 百川UA判断
        let pattBaichuan = /baichuan_android_(\d{1,}\.\d{1,}\.\d{1,})/i;
        let resBaichuan = pattBaichuan.exec(ua);

        // 百川sdk判断 加一层保底
        let pattSDK = /tae_sdk_(\d{1,}\.\d{1,}\.\d{1,})/i;
        let resSDK = pattSDK.exec(ua);

        return !!res || !!resBaichuan || !!resSDK;
    },
    // 判断IOS
    isIos: function () {
        let ua = navigator.userAgent;
        let patt = /fenqile_ios_(\d{1,}\.\d{1,}\.\d{1,})/i;
        let res = patt.exec(ua);
        // 百川UA判断
        let pattBaichuan = /baichuan_iphone_(\d{1,}\.\d{1,}\.\d{1,})/i;
        let resBaichuan = pattBaichuan.exec(ua);

        // 百川sdk判断 加一层保底
        let pattSDK = /tae_sdk_ios_(\d{1,}\.\d{1,}\.\d{1,})/i;
        let resSDK = pattSDK.exec(ua);

        return !!res || !!resBaichuan || !!resSDK;
    }
};
// 设备类型：现后台逻辑，h5及安卓都为安卓
const DeviceType = Tool.isIos() ? 1 : 2;
// 来源：1：淘物星球，2：分期乐 默认分期乐
const Source = Url.get('source') || 2;
/**
 * @name 淘宝授权模型
 * @class TaobaoGrantModel
 * @wiki http://wiki.fenqile.com/pages/viewpage.action?pageId=42052672
 */
class TbGrantModel {
    /**
     * @description [ 淘宝授权回调接口 ]
     * @returns Promise
     * @param code {Number} [用户授权后获取的code]
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=51019935 ]
     */
    grantCallback (code) {
        return Vue.prototype.$http.post('/route0002/caidan/cps/homePage/grantCallback.json', {
            code,
            device_type: DeviceType,
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
     * @param options.scene_id {Number|String} [CPS活动推广场景id，1001：搜索 1002：首页推荐（APP6.0首页推荐流）1003：活动推广 1004：消费号 1000：默认]
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=43459732 ]
     */
    getPromotionUrl (options) {
        return Vue.prototype.$http.post('/route0002/caidan/cps/active/promotion.json', Object.assign({isGateway: true}, {
            active_id: options.active_id,
            channel: options.channel,
            device_type: DeviceType,
            source: Source,
            theme_id_list: options.theme_id_list,
            active_type: options.active_type || '',
            scene_id: options.scene_id && typeof options.scene_id !== 'undefined' ? options.scene_id : 1003 // 如果有传入场景id,则使用传入的场景值，否则默认是CPS活动推广场景值
        }));
    }
    /**
     * @description [ 渠道推广链接获取 ]
     * @returns Promise
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=43459732 ]
     */
    tbAuthBindInfo () {
        return Vue.prototype.$http.post('/route0002/caidan/cps/tb_auth_bind_info.json', {
            device_type: DeviceType,
            isGateway: true
        });
    }
    /**
     * @description [ 淘宝商品信息缓存接口 ]
     * @returns Promise
     * @param options {Object} [参数]
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=51019935 ]
     */
    taobaoSkuInfoCache (options) {
        return Vue.prototype.$http.post('/route0002/caidan/cps/homePage/taobaoSkuInfoCache.json', Object.assign({isGateway: true}, options));
    }
}

export default new TbGrantModel();

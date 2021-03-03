/**
 * @name [url组件]
 * @author [beginning]
 * @version [1.0]
 * @description [主要用于url参数解析]
 */

export default {
    /**
     * @description [将url转换成对象]
     * @param {String} url
     * @returns {Object} [url对象]
     */
    parse (url) {
        if (url) {
            if (url.indexOf('//') === 0) {
                url = location.protocol + url;
            }
            return new URL(url);
        } else {
            return {};
        }
    },

    /**
     * @description [获取URLSearchParams对象]
     * @param {String} url
     * @returns {Object} [URLSearchParams对象]
     */
    getSearchParams (url) {
        if (url) {
            return new URLSearchParams(this.parse(url).search.slice(1));
        } else {
            return '';
        }
    },

    /**
     * @description [获取URL中指定参数值]
     * @param {String} name [查询参数名]
     * @param {String} url [查询参数所在的url链接]
     * @returns {String} [查询参数名所对应的值]
     */
    get (name, url = location.href) {
        if (name && url) {
            let searchParams = this.getSearchParams(url);
            return searchParams.get(name);
        } else {
            return '';
        }
    },

    /**
     * @description [修改特定URL中指定参数值]
     * @param {String} name [要修改查询参数的key]
     * @param {String} value [要要修改查询参数的value]
     * @param {String} url [要修改参数所在的url链接]
     * @returns {String} [返回修改后的url链接]
     */
    set (name, value, url) {
        let searchParams = this.getSearchParams(url);
        searchParams.set(name, value);
        return this.getNewUrl(url, searchParams);
    },

    /**
     * @description [向特定URL中增加查询参数]
     * @param {String} name [要增加查询参数的key]
     * @param {String} value [要要增加查询参数的value]
     * @param {String} url [要增加参数所在的url链接]
     * @returns {String} [返回新增参数后的url链接]
     */
    append (name, value, url) {
        let searchParams = this.getSearchParams(url);
        searchParams.append(name, value);
        return this.getNewUrl(url, searchParams);
    },

    /**
     * @description [判断URL中是否有指定查询参数]
     * @param {String} name [查询参数名]
     * @param {String} url [要查询参数所在的url链接]
     * @returns
     */
    has (name, url) {
        let searchParams = this.getSearchParams(url);
        return searchParams.has(name);
    },

    /**
     * @description [删除URL中指定查询参数]
     * @param {String} name [删除参数名]
     * @param {String} url [要删除参数所在的url链接]
     * @returns
     */
    delete (name, url) {
        let searchParams = this.getSearchParams(url);
        if (this.has(name, url)) {
            searchParams.delete(name);
        }
        return this.getNewUrl(url, searchParams);
    },

    /**
     * @description [拼接请求参数]
     * @param {String} href [需要添加参数的链接]
     * @param {Object} params [参数键值对]
     * @returns {String} [新的链接]
     */

    joinParams (url, params) {
        let searchParams = this.getSearchParams(url);
        for (let key in params) {
            if (params.hasOwnProperty(key)) {
                searchParams.append(key, params[key]);
            }
        }
        return this.getNewUrl(url, searchParams);
    },

    /**
     * @description [获取新的URL]
     * @param {String} url [旧的URL]
     * @param {String} searchParams [查询参数字符串]
     * @returns {String}   [新的URL]
     */
    getNewUrl (url, searchParams) {
        let parseUrl = this.parse(url);
        return `${parseUrl.protocol}//${parseUrl.host}${parseUrl.pathname}?${searchParams.toString()}${parseUrl.hash}`;
    }
};

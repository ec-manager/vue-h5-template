/**
 * @name [http]
 * @author [beginning]
 * @version [1.0]
 * @description [http组件是在axios的基础上做了一层封装，并挂载到Vue实例上。]
 * @description [在vue文件中可以通过this.$http来发送请求，成功后会返回一个Promise对象。]
 */
import As from 'axios';
import Qs from 'qs';

function getBaseUrl () {
    if (process.env.NODE_ENV === 'development' && process.env.IS_MOCK) {
        return 'https://sale.fenqile.com/res_sales/mock';
    } else {
        return window.location.origin || 'https://sale.fenqile.com';
    }
}

let instance = As.create({
    baseURL: getBaseUrl(),
    timeout: 5000,
    withCredentials: true,
    transformRequest: [function (data) {
        // gateway请求接口
        if (data && data.isGateway) {
            // 删除isGateway属性
            delete data.isGateway;
            let system = {
                new_version: '',
                uid: '',
                sign: '',
                os: 'H5',
                session_id: '',
                controller: '',
                token_id: '',
                time_stamp: new Date().getTime(),
                machine_code: '',
                channel_id: ''
            };

            if (data.system) {
                system = Object.assign({}, system, data.system);
                delete data.system;
            }

            const params = {
                system: system,
                data: data
            };
            return JSON.stringify(params);
        } else {
            return Qs.stringify(data);
        }
    }]
});

// 开发环境使用
if (process.env.NODE_ENV === 'development') {
    instance.interceptors.request.use((config) => {
        // 是否在白名单内
        if (Object.values(['"/sales/salesCgi/get_config.json"', '"/route0002/eventMall/queryManualConfig.json"']).includes(config.url)) {
            config.baseURL = 'https://sale.fenqile.com';
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });
}

instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// 拦截器
instance.interceptors.response.use((response) => {
    let responseData = response.data;
    if (parseInt(responseData.result) === 0 || parseInt(responseData.retcode) === 0) {
        // gateway接口
        if (responseData.data) {
            // 成功态
            if (parseInt(responseData.data.result) === 0) {
                return responseData;
            } else {
                // 失败态
                return Promise.reject(responseData['data']['res_info'] || '数据加载异常');
            }
        } else {
            // cgi接口
            return responseData;
        }
    } else {
        if (responseData.retcode) {
            return responseData;
        }
        return Promise.reject(responseData['res_info'] || '数据加载异常');
    }
}, (err) => {
    console.log(err);
    return Promise.reject(err.message);
});

export default instance;

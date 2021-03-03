import G_MOD_URL from '@/mod/util/url/h5/1.0/url.js';
const Toolkit = {
    uuid (len, radix) {
        let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        let uuid = [];
        radix = radix || chars.length;

        if (len) {
            for (let i = 0; i < len; i++) {
                uuid[i] = chars[0 | Math.random() * radix];
            }
        } else {
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';
            for (let i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    let r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    },

    // 去掉字符串第一个
    sliceFirstChar: function (string) {
        let len = string.length;
        return string.slice(1, len);
    },

    // 更改map格式 - 由数组转为json格式上报
    changeMapFormat: function (map) {
        let result = {};
        let _map = map || [];
        let mapArray = [];

        if (_map.length > 0) {
            for (let i = 0; i < _map.length; i++) {
                mapArray = _map[i].split(':');
                result[mapArray[0]] = mapArray[1];
            }
        }
        return JSON.stringify(result);
    }
};

function Report (options) {
    this.options = {
        htPrefix: '',
        crtUrl: '',
        domainId: '',
        pageId: '',
        errorCode: ''
    };

    this.options = Object.assign({}, this.options, options);

    this.rParams = {
        'fasUrl': '//r.fenqile.com/cs', // FAS数据上报
        'speedFasUrl': '//r.fenqile.com/ps', // FAS测速上报
        'errFasUrl': '//r.fenqile.com/ep', // 错误上报
        'ecrSingleReportUrl': '//fm.fenqile.com/route0002/ecReport/singleReport.json',
        'fasVersion': 'eds.1.0.0',
        'pageIdOffset': 60000,
        'firstTimeInit': 1
    };
    // 场景端调用该组件传入参数 - params的有效合法值
    this.gParams = {
        crtUrl: '',
        refUrl: ''
    };

    this.initParams = {
        tagParamName: '',
        virtualDomain: '',
        virtualURL: '',
        statIframe: '',
        sessionSpan: '',
        repeatApply: '',
        actionType: '',
        skuId: '',
        skuList: [],
        orderId: '',
        orderList: [],
        parentOrderId: '',
        onlyReportEcr: 0, // 是否只上报ECR， 在banner轮播， sku的曝光等场景只需要上报ECR
        e: '' // 点击event
    };
    // 调用请求传入参数, fas和电商数据系统所有上报数据集合
    this.eparams = {
        domain: '',
        url: '',
        hottag: '',
        x: '',
        y: '',
        refererDomain: '',
        refererUrl: '',
        refererQs: '',
        qs: '',
        platform: '',
        os: '',
        screenHeight: '',
        screenWidth: '',
        wifi: 0,
        networkType: 'unknown',
        searchKey: '',
        actionType: '',
        skuId: '',
        skuList: [],
        orderId: '',
        orderList: [],
        parentOrderId: '',
        rand: '', // 随机值
        // fas专有
        co: '', // 客户端是否支持cookie
        or: '', // 点击流时发起的rdm+ru
        lg: '', // 客户端系统语言
        // 性能
        points: {},
        pageName: '',
        wxsdkVersion: '',
        componentCount: '',
        jsTemplateSize: '',
        jsLibVersion: '',
        bizType: '',
        // 目前android独有
        jsLibSize: '',
        maxDeepViewLayer: '',
        useScroller: '',
        // 站内广告位标记
        isc: ''
    };
    // 永久性cookie -服务于fas
    this.ceparams = {
        fs_tag: '' // 用户特征值（供PV/UV统计区分
    };
    // session cookie
    this.sceparams = {
        tag: '', // _DTAG对应的投放值
        osc: '',
        asc: '',
        ei: '',
        ctag: '' // 用户渠道值
    };
    this.url = '';
    this.refererUrl = '';
}

Report.prototype = {
    initParamsFunc: function (inParams) {
        this.gParams = typeof (inParams) !== 'undefined' ? inParams : this.initParams;
        this.run();
    },

    run: function () {
        this.eparams['rand'] = new Date().getTime();
        this.getDomainInfo(); // 获取domain/url/qs
        this.getRefInfo(); // 获取refererDomain/refererUrl/refererQs/or
        this.getMainEnvInfo(); // 获取platform/userAgent/os/screenHeight/screenWidth/network_type
        this.handleLogicParams(); // 处理业务相关参数的获取和设置 search_key/action_type/sku_id/order_id/fs_tag/fs_i_channel/tag/osc/asc/event_id
        this.sendInfo();
    },

    // 监听DOM结构上报
    domReportHandler: function (e) {
        let attr = '';
        let hottag = '';
        let orderId = '';
        let parentOrderId = '';
        let skuId = '';
        let actionType = '';
        let isc = '';
        let onlyReportEcr = 0;
        if (e.srcElement && e.srcElement.attributes) {
            attr = e.srcElement.attributes;
            hottag = attr['data-fql-stat'] ? attr['data-fql-stat']['nodeValue'] : '';
            orderId = attr['data-fql-order-id'] ? attr['data-fql-order-id']['nodeValue'] : '';
            parentOrderId = attr['data-fql-parent-order-id'] ? attr['data-fql-parent-order-id']['nodeValue'] : '';
            skuId = attr['data-fql-sku-id'] ? attr['data-fql-sku-id']['nodeValue'] : attr['data-app-sku-id'] ? attr['data-app-sku-id']['nodeValue'] : '';
            actionType = attr['data-fql-action-type'] ? attr['data-fql-action-type']['nodeValue'] : '';
            isc = attr['data-fql-isc'] ? attr['data-fql-isc']['nodeValue'] : '';
            onlyReportEcr = attr['data-only-report-ecr'] ? attr['data-only-report-ecr']['nodeValue'] : 0;
        } else if (e.target && e.target.attr) {
            attr = e.target.attr;
            hottag = attr['dataFqlStat'] ? attr['dataFqlStat'] : '';
            orderId = attr['dataFqlOrderId'] ? attr['dataFqlOrderId'] : '';
            parentOrderId = attr['dataFqlParentOrderId'] ? attr['dataFqlParentOrderId'] : '';
            skuId = attr['dataFqlSkuId'] ? attr['dataFqlSkuId'] : attr['dataAppSkuId'] ? attr['dataAppSkuId'] : '';
            actionType = attr['dataFqlActionType'] ? attr['dataFqlActionType'] : '';
            isc = attr['dataFqlIsc'] ? attr['dataFqlIsc'] : '';
            onlyReportEcr = attr['dataOnlyReportEcr'] ? attr['dataOnlyReportEcr'] : 0;
        } else {
            return;
        }

        let inParams = {
            'hottag': hottag,
            'skuId': skuId,
            'orderId': orderId,
            'parentOrderId': parentOrderId,
            'actionType': actionType,
            'isc': isc,
            'onlyReportEcr': onlyReportEcr
        };
        if (hottag) {
            this.initParamsFunc(inParams);
        }
    },

    // 获取域名信息
    getDomainInfo: function () {
        this.gParams.crtUrl = this.options.crtUrl;
        this.eparams['domain'] = location.host;
        this.eparams['url'] = location.pathname;
        this.eparams['qs'] = location.search;
    },

    // 获取ref信息
    getRefInfo: function () {
        this.gParams.refUrl = document.referrer;
        let reg = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?/;
        let ret = reg.test(document.referrer) ? G_MOD_URL.parse(this.gParams.refUrl) : {};
        this.eparams['refererDomain'] = ret.host || '';
        this.eparams['refererUrl'] = ret.pathname || '';
        let refererQs = ret.search || '';
        if (refererQs) {
            this.eparams['refererQs'] = Toolkit.sliceFirstChar(refererQs);
        }

        let tagParamName = this.gParams.tagParamName || 'hottag';
        let hotTag = this.gParams[tagParamName] ? this.gParams[tagParamName] : G_MOD_URL.get(tagParamName, this.gParams.crtUrl);
        let originalRefer;
        if (hotTag) {
            originalRefer = ret.dm + ret.u;
        }

        this.eparams['hottag'] = hotTag ? this.options.htPrefix + '.' + hotTag : '';
        // FAS特有 originalRefer
        this.eparams['or'] = originalRefer;
    },

    // 获取设备信息
    getMainEnvInfo: function () {
        try {
            let lang = '';
            let pf = '';

            if (self.screen) {
                this.eparams['screenHeight'] = screen.height;
                this.eparams['screenWidth'] = screen.width;
            }

            if (navigator.language) {
                lang = navigator.language.toLowerCase();
            } else {
                if (navigator.browserLanguage) {
                    lang = navigator.browserLanguage.toLowerCase();
                }
            }

            // 识别pf
            let ua = navigator.userAgent;
            if (/\bfenqile_android_\d+\b/.test(ua)) {
                pf = 'h5'; // h5_nested_android 调整成h5
            } else if (/\bfenqile_ios_\d+\b/.test(ua)) {
                pf = 'h5'; // h5_nested_ios 调整成h5
            } else if (/\b(mobile|mobi|android|IEMobile)\b/i.test(ua)) { // 部分android设置未设置mobile
                pf = 'h5';
            } else if (/\b(Windows|Macintosh|Linux)\b/i.test(ua)) { // pc的ua太复杂，从操作系统入手判断
                pf = 'pc';
            }

            this.eparams['os'] = navigator.platform;
            this.eparams['platform'] = pf;
            this.eparams['lg'] = lang;
        } catch (e) {
            console.log(e);
        }
    },

    // 获取当前网络环境
    getNetworkType: function () {
        let ua = window.navigator.userAgent;
        let con = window.navigator.connection;
        let networkType = '';
        let wifi = 0;

        // 只有在分期乐APP环境中network_type才在global js文件设置
        this.eparams['networkType'] = window.network_type ? window.network_type : '';
        if (window.network_type && window.network_type === 'wifi') {
            this.eparams['wifi'] = 1;
        } else {
            // 如果是微信
            if (/MicroMessenger/.test(ua)) {
                // 如果是微信6.0以上版本，用UA来判断
                if (/NetType/.test(ua)) {
                    networkType = ua.match(/NetType\/(\S*)(\s*)/)[1];
                    networkType = networkType.toLowerCase();
                    if (networkType === 'wifi') {
                        wifi = 1;
                    }
                    // 如果是微信6.0以下版本，调用微信私有接口WeixinJSBridge
                } else {
                    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady () {
                        WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
                            if (e.err_msg === 'network_type:wifi') {
                                wifi = 1;
                            }
                        });
                    });
                }
                // 如果支持navigator.connection
            } else if (con) {
                networkType = con.type ? con.type : (con.effectiveType ? con.effectiveType : '');
                networkType = networkType.toLowerCase();
                if (networkType !== 'wifi' && networkType !== '2' && networkType !== 'unknown') {
                    wifi = 0;
                } else {
                    wifi = 1;
                }
            }

            this.eparams['networkType'] = networkType;
            this.eparams['wifi'] = wifi;
        }
    },

    // 获取和设置业务相关参数
    handleLogicParams: function () {
        let dtag = G_MOD_URL.get('_DTAG', this.gParams.crtUrl) || '';
        this.eparams['searchKey'] = this.gParams['searchKey'] ? this.gParams['searchKey'] : (G_MOD_URL.get('sk', this.gParams.crtUrl) || '');
        this.eparams['actionType'] = this.gParams['actionType'] ? this.gParams['actionType'] : 1;
        this.eparams['skuId'] = this.gParams['skuId'] ? this.gParams['skuId'] : '';
        this.eparams['skuList'] = JSON.stringify(this.gParams['skuList'] ? this.gParams['skuList'] : []);
        this.eparams['orderId'] = this.gParams['orderId'] ? this.gParams['orderId'] : '';
        this.eparams['orderList'] = JSON.stringify(this.gParams['orderList'] ? this.gParams['orderList'] : []);
        this.eparams['parentOrderId'] = this.gParams['parentOrderId'] ? this.gParams['parentOrderId'] : '';
        this.eparams['isc'] = this.gParams['isc'] ? this.gParams['isc'] : G_MOD_URL.get('_ISC', this.gParams.crtUrl);
        this.sceparams['tag'] = (/^[A-Z0-9]{7}-[A-Z0-9]{7}$/.test(dtag) ? dtag : '');
        this.sceparams['osc'] = G_MOD_URL.get('_OSC', this.gParams.crtUrl);
        this.sceparams['asc'] = G_MOD_URL.get('_ASC', this.gParams.crtUrl);
        this.sceparams['ctag'] = G_MOD_URL.get('_CTAG', this.gParams.crtUrl);
    },

    // 上报数据
    sendInfo: function () {
        // 发送请求至fas
        if (!this.gParams.onlyReportEcr) {
            this.sendInfoToFas();
        }
        // 发送请求至电商
        this.sendInfoToEds();
    },

    // 发送请求至fas
    sendInfoToFas: function () {
        // 按照FAS的数据要求重新包装数据
        let fparams = {
            dm: this.eparams['domain'], // 域名
            u: this.eparams['url'], // 页面路径
            qs: this.eparams['qs'], // 查询参数（GET）
            rdm: this.eparams['refererDomain'], // referer域名
            ru: this.eparams['refererUrl'], // referer页面路径
            rqs: this.eparams['refererQs'], // referer查询参数（GET）
            or: this.eparams['or'], // 点击流时发起的rdm+ru
            vs: this.rParams.fasVersion, // 当前统计的版本号
            scr: (this.eparams['screenWidth'] + 'x' + this.eparams['screenHeight']), // 客户端屏幕尺寸
            lg: this.eparams['lg'], // 客户端系统语言
            co: 1, // 客户端是否支持cookie
            pf: this.eparams['os'], // 运行浏览器的操作系统平台。
            ht: this.eparams['hottag'], // 初始化组件的时候写入
            x: this.eparams['x'], // 屏幕x坐标
            y: this.eparams['y'], // 屏幕y坐标
            cep: this.eparams['platform'], // 客户端平台，可能的值为 pc、h5、h5_nested_ios、h5_nested_android
            sk: this.eparams['searchKey'], // search_key, 从搜索页带到商详的关键词，在商详页上传数据
            rand: this.eparams['rand'] // 随机数, 防止请求被缓存
        };
        let sendUrl = G_MOD_URL.joinParams(this.rParams.fasUrl, fparams);
        this.sendReport(sendUrl);
    },

    // 获取电商参数
    getEdsParams: function () {
        return {
            dm: this.eparams['domain'], // 域名
            u: this.eparams['url'], // 页面路径
            ht: this.eparams['hottag'], // hottag
            x: this.eparams['x'], // 屏幕x坐标
            y: this.eparams['y'], // 屏幕y坐标
            rdm: this.eparams['refererDomain'], // referer域名
            ru: this.eparams['refererUrl'], // referer页面路径
            qs: this.eparams['qs'], // 查询参数（GET）
            rqs: this.eparams['refererQs'], // referer查询参数（GET）
            pf: this.eparams['platform'], // 运行浏览器的操作系统平台
            os: this.eparams['os'], // 运行浏览器的操作系统平台。
            scrw: this.eparams['screenWidth'],
            scrh: this.eparams['screenHeight'], // 客户端屏幕尺寸
            wifi: this.eparams['wifi'],
            nt: this.eparams['networkType'],
            sk: this.eparams['searchKey'], // search_key, 从搜索页带到商详的关键词，在商详页上传数据
            at: this.eparams['actionType'],
            si: this.eparams['skuId'],
            sl: this.eparams['skuList'],
            oi: this.eparams['orderId'],
            ol: this.eparams['orderList'],
            poi: this.eparams['parentOrderId'],
            rand: this.eparams['rand'], // 随机数 防止请求被缓存
            // 用户特征值
            fs_tag: this.ceparams['fs_tag'],
            // 站外投放广告
            tag: this.sceparams['tag'],
            // 站外投放广告
            osc: this.sceparams['osc'],
            // 应用市场渠道值
            asc: this.sceparams['asc'],
            // 线下开户渠道码
            c_tag: this.sceparams['ctag'],
            // 站内广告位标记
            isc: this.eparams['isc'],
            // 上报类型：1-普通上报、2-性能上报、4-错误上报
            type: 1
        };
    },

    // 性能上报的page_info参数较少
    getPerformParams: function () {
        // 按照电商的数据要求重新包装数据
        return {
            os: this.eparams['os'],
            wifi: this.eparams['wifi'],
            nt: this.eparams['networkType'],
            // 随机数防止请求被缓存
            rand: this.eparams['rand']
        };
    },

    // 发送请求至电商
    sendInfoToEds: function () {
        let eparams = this.getEdsParams();
        let sendUrl = G_MOD_URL.joinParams(this.rParams.ecrSingleReportUrl, eparams);
        this.sendReport(sendUrl);
    },

    // 上报性能监控数据到FAS和ECR罗盘系统
    reportPerformanceInfo: function (type, params) {
        let speedParamsFas = null;
        let speedParamsEcr = null;
        let fasUrl;
        let ecrUrl;
        let points = {};
        switch (type) {
        // 底层性能上报
            case 'performance': {
            // 共有
                const performKey = [
                    'totalTime',
                    'SDKInitTime',
                    'SDKInitInvokeTime',
                    'screenRenderTime',
                    'JSLibInitTime',
                    'communicateTime',
                    'networkTime',
                    'SDKInitExecuteTime',
                    'actualNetworkTime',
                    'firstScreenJSFExecuteTime',
                    'localReadTime',
                    'packageSpendTime',
                    'pureNetworkTime',
                    'syncTaskTime',
                    'templateLoadTime'
                ];

                let length = performKey.length;
                for (let i = 1; i <= length; i++) {
                    let key = performKey[i];
                    if (params[key]) {
                        points[i] = params[key];
                    }
                }

                this.eparams.points = JSON.stringify(points);
                this.eparams.pageName = params['pageName'] ? params['pageName'] : '';
                this.eparams.wxsdkVersion = params['WXSDKVersion'] ? params['WXSDKVersion'] : '';
                this.eparams.componentCount = params['componentCount'] ? params['componentCount'] : '';
                this.eparams.jsTemplateSize = params['JSTemplateSize'] ? params['JSTemplateSize'] : '';
                this.eparams.jsLibVersion = params['JSLibVersion'] ? params['JSLibVersion'] : '';
                this.eparams.bizType = params['bizType'] ? params['bizType'] : '';
                this.eparams.jsLibSize = params['JSLibSize'] ? params['JSLibSize'] : '';
                this.eparams.maxDeepViewLayer = params['maxDeepViewLayer'] ? params['maxDeepViewLayer'] : '';
                this.eparams.useScroller = params['useScroller'] ? params['useScroller'] : '';
                // 性能的page_id需加上偏移量
                let pageId = parseInt(this.options.pageId) + parseInt(this.rParams.pageIdOffset);
                speedParamsFas = {
                    'domain_id': this.options.domainId,
                    'page_id': pageId,
                    'points': this.eparams.points
                };
                // ECR上报参数
                speedParamsEcr = {
                    'dmid': this.options.domainId,
                    'pgid': pageId,
                    'points': this.eparams.points,
                    'pgname': this.eparams.pageName,
                    'wxsdkver': this.eparams.wxsdkVersion,
                    'compcount': this.eparams.componentCount,
                    'jstempsize': this.eparams.jsTemplateSize,
                    'jslibver': this.eparams.jsLibVersion,
                    'biztype': this.eparams.bizType,
                    'jslibsize': this.eparams.jsLibSize,
                    'maxdvl': this.eparams.maxDeepViewLayer,
                    'us': this.eparams.useScroller,
                    'type': 2
                };
                fasUrl = this.rParams.speedFasUrl;
                ecrUrl = this.rParams.ecrSingleReportUrl;
                break;
            }
            // 业务性能上报
            case 'biz_performance':
                points = this.handlePointTimeDiff(params);
                this.eparams.points = Toolkit.changeMapFormat(points);
                speedParamsFas = {
                    'domain_id': this.options.domainId,
                    'page_id': parseInt(this.options.pageId),
                    'points': this.eparams.points
                };

                // ECR上报参数
                speedParamsEcr = {
                    'dmid': this.options.domainId,
                    'pgid': parseInt(this.options.pageId),
                    'points': this.eparams.points,
                    'type': 2
                };

                fasUrl = this.rParams.speedFasUrl;
                ecrUrl = this.rParams.ecrSingleReportUrl;
                break;

            // 错误上报
            case 'error':
                speedParamsFas = {
                    'domain_id': this.options.domainId,
                    'page_id': parseInt(this.options.pageId),
                    'action': this.options.htPrefix,
                    'op': 'weex_error',
                    'time': 0,
                    'cost': 0,
                    'attach': '',
                    'code': this.options.errorCode,
                    'line': '',
                    'msg': params['msg'] ? params['msg'] : '',
                    'file': '',
                    'u': this.gParams.crtUrl
                };

                // ECR上报参数
                speedParamsEcr = {
                    'dmid': this.options.domainId,
                    'pgid': parseInt(this.options.pageId),
                    'errmsg': params['msg'] ? params['msg'] : '',
                    'errcode': this.options.errorCode,
                    'type': 4
                };

                fasUrl = this.rParams.errFasUrl;
                ecrUrl = this.rParams.ecrSingleReportUrl;
                break;
            default:
                return;
        }

        this.eparams['actionType'] = ''; // 不用action_type, 走的单独的对象,单独的元事件
        // 测速数据单独上报FAS系统
        this.sendSpeedToFas(fasUrl, speedParamsFas);
        // 测速/性能数据上报罗盘系统
        this.sendSpeedToEcr(ecrUrl, speedParamsEcr);
    },

    handlePointTimeDiff: function (points) {
        let pointsDiff = [];
        for (let k in points) {
            if (points.hasOwnProperty) {
                pointsDiff.push(points[k]['ID'] + ':' + (points[k]['DATA'][1] - points[k]['DATA'][0]));
            }
        }
        return pointsDiff;
    },

    // 业务测速/性能数据单独上报FAS系统
    sendSpeedToFas: function (url, speedParams) {
        let sendUrl = G_MOD_URL.joinParams(url, speedParams);
        this.sendReport(sendUrl);
    },

    // 测速/性能数据上报罗盘系统
    sendSpeedToEcr: function (url, speedParams) {
        let eparams = this.getPerformParams();
        // 将测速数据和数据上报的参数合并, 上报罗盘系统
        eparams = Object.assign(eparams, speedParams);
        let sendUrl = G_MOD_URL.joinParams(url, eparams);
        this.sendReport(sendUrl);
    },

    // 发送请求接口
    sendReport: function (sendUrl) {
        let image = new Image(1, 1);
        image.src = sendUrl;
    },

    init () {
        if (this.options.domainId && this.options.pageId) {
            // 初始化曝光一次
            this.initParamsFunc();
        }
    }
};

export default Report;

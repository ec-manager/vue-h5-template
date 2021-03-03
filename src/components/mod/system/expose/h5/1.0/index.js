import Report from '@/mod/system/data_report/h5/1.0/index.js';

export default {
    install (Vue) {
        let meta = document.querySelector('meta[name="page"]');
        let htPrefix = '';
        if (meta) {
            htPrefix = meta.getAttribute('content');
        }

        let report = new Report({
            crtUrl: location.href,
            domainId: 3,
            pageId: 24,
            errorCode: 910320001,
            htPrefix: htPrefix
        });
        // 页面初始化曝光
        report.init();
        Vue.prototype.$report = report;

        // 曝光指令
        Vue.directive('expose', {
            bind: (el, binding) => {
                let data = binding.value;
                el.setAttribute('data-expose', data);
                if (el) {
                    report.initParamsFunc({
                        onlyReportEcr: 1,
                        hottag: data
                    });
                }
            }
        });

        // 点击流指令
        Vue.directive('stat', {
            bind: (el, binding) => {
                let data = binding.value;
                let hottag = '';
                let skuId = '';
                if (typeof data === 'object') {
                    el.setAttribute('data-stat', JSON.stringify(data));
                    hottag = data.hottag ? data.hottag : '';
                    skuId = data.skuId ? data.skuId : '';
                } else {
                    el.setAttribute('data-stat', data);
                    hottag = data;
                }

                el.addEventListener('click', () => {
                    report.initParamsFunc({
                        onlyReportEcr: 1,
                        actionType: 2,
                        hottag: hottag,
                        skuId: skuId
                    });
                });
            }
        });
    }
};

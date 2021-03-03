/* eslint-disable */
;(function (win, lib) {
    const doc = win.document;
    const docEl = doc.documentElement;
    const dpr = 1;
    let tid;
    const flexible = lib.flexible || (lib.flexible = {});
    function refreshRem () {
        let width = docEl.getBoundingClientRect().width;
        if (width / dpr > 750) {
            width = 750 * dpr;
        }
        var rem = width / 10;
        docEl.style.fontSize = rem + 'px';
        flexible.rem = win.rem = rem;
    }

    win.addEventListener('resize', function () {
        clearTimeout(tid);
        tid = setTimeout(refreshRem, 400);
    }, false);

    win.addEventListener('pageshow', function (e) {
        if (e.persisted) {
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 400);
        }
    }, false);

    if (doc.readyState === 'complete') {
        doc.body.style.fontSize = 12 * dpr + 'px';
    } else {
        doc.addEventListener('DOMContentLoaded', function (e) {
            doc.body.style.fontSize = 12 * dpr + 'px';
        }, false);
    }

    refreshRem();

    flexible.dpr = win.dpr = dpr;
    flexible.refreshRem = refreshRem;
    flexible.rem2px = function (d) {
        let val = parseFloat(d) * this.rem;
        if (typeof d === 'string' && d.match(/rem$/)) {
            val += 'px';
        }
        return val;
    };
    flexible.px2rem = function (d) {
        let val = parseFloat(d) / this.rem;
        if (typeof d === 'string' && d.match(/px$/)) {
            val += 'rem';
        }
        return val;
    };

})(window, window['lib'] || (window['lib'] = {}));

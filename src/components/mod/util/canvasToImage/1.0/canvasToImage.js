const Canvas2Image = {
    support () {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');

        return {
            canvas: !!ctx,
            imageData: !!ctx.getImageData,
            dataURL: !!canvas.toDataURL,
            btoa: !!window.btoa
        };
    },

    downloadMime: 'image/octet-stream',

    scaleCanvas (canvas, width, height) {
        let [w, h] = [canvas.width, canvas.height];
        width = width || w;
        height = height || h;

        let retCanvas = document.createElement('canvas');
        let retCtx = retCanvas.getContext('2d');
        retCanvas.width = width;
        retCanvas.height = height;
        retCtx.drawImage(canvas, 0, 0, w, h, 0, 0, width, height);
        return retCanvas;
    },

    getDataURL (canvas, type, width, height) {
        canvas = this.scaleCanvas(canvas, width, height);
        return canvas.toDataURL(type);
    },

    saveFile (strData) {
        document.location.href = strData;
    },

    getImage (strData) {
        let img = document.createElement('img');
        img.src = strData;
        return img;
    },

    // 图片类型
    fixType (type) {
        type = type.toLowerCase().replace(/jpg/i, 'jpeg');
        let r = type.match(/png|jpeg|gif/)[0];
        return 'image/' + r;
    },

    encodeData (data) {
        let str = '';
        if (typeof data === 'string') {
            str = data;
        } else {
            for (let i = 0; i < data.length; i++) {
                str += String.fromCharCode(data[i]);
            }
        }

        return window.btoa(str);
    },

    getImageData (canvas) {
        return canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    },

    makeURI (strData, type) {
        return 'data:' + type + ';base64,' + strData;
    },

    // 保存图片文件
    saveAsImage (canvas, width, height, type = 'png') {
        if (Canvas2Image.support().canvas && Canvas2Image.support().dataURL) {
            if (typeof canvas === 'string') {
                canvas = document.getElementById(canvas);
            }
            type = Canvas2Image.fixType(type);
            let strData = Canvas2Image.getDataURL(canvas, type, width, height);
            Canvas2Image.saveFile(strData.replace(type, Canvas2Image.downloadMime));
        }
    },

    // 生成图片
    convertToImage (canvas, width, height, type = 'png') {
        if (Canvas2Image.support().canvas && Canvas2Image.support().dataURL) {
            if (typeof canvas === 'string') {
                canvas = document.getElementById(canvas);
            }
            type = Canvas2Image.fixType(type);
            let strData = Canvas2Image.getDataURL(canvas, type, width, height);
            return Canvas2Image.getImage(strData);
        }
    }
};

export default {
    saveAsImage: Canvas2Image.saveAsImage,
    convertToImage: Canvas2Image.convertToImage
};

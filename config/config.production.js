/* eslint-disable */
export default {
  scripts: [{
    chunks: "vendor",
    src: "https://cres2.fenqile.cn/js/vd/vendor.7a7e5bc7.js"
  }],
  exportStatic: {
    htmlSuffix: true
  },
  // js css img 等静态资源输出路径 当前cres2匹配 https://cres2.fenqile.cn/fenqile_m -> fenqile_m/htdocs/res
  publicPath: 'https://cres2.fenqile.cn/' // 静态资源引用地址 相对
  // assetsPublicOutputPath: 'https://cres2.fenqile.cn/'

};
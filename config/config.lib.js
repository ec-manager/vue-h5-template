/* eslint-disable */
export default {
  // js css img 等静态资源输出路径 当前cres2匹配 https://cres2.fenqile.cn/fenqile_m -> fenqile_m/htdocs/res
  publicPath: process.env.BUILD_MODE === 'debug' ? '/' : 'https://cres2.fenqile.cn/',
  hash: process.env.BUILD_MODE !== 'debug'
};
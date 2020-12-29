/* eslint-disable */
export default {
  devServer: {
    open: true,
    openPage: '/debug.html'
  },
  scripts: [{
    chunks: "vendor",
    src: "/res/js/lib/vendor.js"
  }],
  headScripts: []
};
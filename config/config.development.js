/* eslint-disable */
export default {
  devServer: {
    open: true,
    openPage: '/debug.html'
  },
  scripts: [{
    chunks: "vendor",
    src: "/res/js/vd/vendor.js"
  }],
  links: [{
    chunks: "vendor",
    href: "/res/css/vendor.css",
    rel: "stylesheet"
  }],
  headScripts: []
};
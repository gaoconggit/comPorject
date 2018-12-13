// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    // to edit target browsers: use "browserslist" field in package.json
    //"autoprefixer": {}
    "postcss-aspect-ratio-mini": {},
    "postcss-write-svg": {utf8: false},
    "postcss-cssnext": {},
    "postcss-px-to-viewport": {
      viewportWidth: 750, // (Number) The width of the viewport. viewportHeight: 1334, // (Number) The height of the viewport.
      viewportHeight: 1334, // 视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置
      unitPrecision: 3, // (Number) The decimal numbers to allow the REM units to grow to.
      viewportUnit: 'vw', // (String) Expected units.
      selectorBlackList: ['.ignore', '.hairlines', /^\.weui-/, /^\.vux-popup-/, /^\.scroller-/], // (Array) The selectors to ignore and leave as px.
      minPixelValue: 1, // (Number) Set the minimum pixel value to replace.
      mediaQuery: false // (Boolean) Allow px to be converted in media queries.
    },
    "postcss-viewport-units": {
      // vw适配中使用伪类选择器遇到的问题 https://blog.csdn.net/perryliu6/article/details/80965734
      filterRule: rule => rule.selector.indexOf('::after') === -1 && rule.selector.indexOf('::before') === -1 && rule.selector.indexOf(':after') === -1 && rule.selector.indexOf(':before') === -1
    },
    "cssnano": {preset: "advanced", autoprefixer: false, "postcss-zindex": false}
  }
}

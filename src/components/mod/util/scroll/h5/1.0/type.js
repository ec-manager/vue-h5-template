/**
 * @type fixed
 * @description 适用于交替激活的滚动类型，该类型数组中最后一个订阅者将在其offsetTop到无限滚动区域距离均保持激活信号
 */
export const G_SCROLL_FIXED = 'G_SCROLL_FIXED';

/**
 * @type 高亮
 * @description 适用于交替激活的滚动类型，该类型当页面置底，数组中最后一个订阅者将得到激活信号
 */
export const G_SCROLL_LIGHTHEIGHT = 'G_SCROLL_LIGHTHEIGHT';

/**
 * @type 区间
 * @difference 该类型订阅者需为 Object，并且属性中存在 elm 与 lastFloor 属性，具体查看 index.js 中 _createObj方法注释
 * @description 适用于区间滚动类型，该类型在进入与离开滚动区间均会得到改变信号
 */
export const G_SCROLL_IN_SECTION = 'G_SCROLL_IN_SECTION';

/**
 * 渠道自动跳转组件
 * @param icon 渠道图标
 * @param name 渠道名称
 * @param tip 返现描述
 * @param show 显示标识
  <cps-jump-modal
    :icon="xxx"
    :channel-name="xxx"
    :leka="xxx"
  ></cps-jump-modal>
 */
export default {
    name: 'cpsJumpModal',
    props: {
        icon: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        tip: {
            type: String
        },
        show: {
            type: Boolean,
            required: true
        }
    },
    model: {
        prop: 'show',
        event: 'close'
    },
    data () {
        return {
            imgSrc: {
                fenqileIcon: '//cimg1.fenqile.com/product5/M00/89/6F/MNEHAF9h1d6AG3xKAAAMZFlpSE0052.png', // 分期乐图标
                walletIcon: '//cimg1.fenqile.com/product5/M00/17/75/MtEHAF-EEnSALyS8AAAHC2NyNcs097.png', // 自动跳转弹框-乐花卡icon
                jumpIcon: '//cimg1.fenqile.com/product5/M00/89/53/MdEHAF9h18yAY2QEAAACYOSrgbw670.png', // 自动跳转弹框-箭头指向图片
                jumpHeadGif: '//cimg1.fenqile.com/product5/M00/89/66/MtEHAF9h70eAFrA3AABL6DY9jFA076.gif' // 自动跳转弹框头部gif动效图
            }
        };
    }
};

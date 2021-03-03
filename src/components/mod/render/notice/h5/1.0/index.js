import NoticeModel from '@/model/NoticeModel';
import Tool from '@/mod/util/tool/1.0/tool.js';
import ToastPortal from './template/toast-portal.vue';
import BoxAdPicture from './template/box-ad-picture.vue'; //整图型弹窗
import AppBridge from '@/mod/util/app/h5/2.0/app.js';
/**
 * @name [奇门通知弹层]
 * @author [denyszhou]
 * @description [奇门通知弹层]
 * @description [消息弹窗页面进入后一般只能弹出一次，不允许多次弹出]
 * @class Notice
 */

const Notice = {
    computed: {
        // 转化为组件名
        noticeType () {
            let {notice_type: noticeType} = this.notice || {};

            switch (noticeType) {
            // 蒙层引导，多一层转化枚举所有可能的弹层类型
                case 'toast_portal': {
                    return 'toast-portal';
                }
                case 'ad_picture':
                    return 'box-ad-picture';
                // 默认不展示
                default:
                    return '';
            }
        },

        // 模板配置数据
        noticeData () {
            let {notice_data: noticeData} = this.notice || {};
            return noticeData;
        },

        // 是否展示弹窗
        // 1、弹窗数据
        // 2、外部需要展示
        // 3、未手动关闭
        showNotice () {
            let {noticeData = {}, show, hasDismiss} = this;
            let body = document.querySelector('body');
            // 展示弹窗
            if (Object.keys(noticeData).length > 0 && show && !hasDismiss) {
                // 加一层判断避免多个弹窗干扰
                body && body.classList.add(`notice-hidden-${this._uid}`);
                return true;
            } else {
                // document.body.style.overflow = 'auto';
                body && body.classList.remove(`notice-hidden-${this._uid}`);
                return false;
            }
            // return Object.keys(noticeData).length > 0 && show && !hasDismiss;
        }
    },

    data () {
        return {
            // 弹窗配置数据
            notice: {},
            // 用户是否已经手动关闭
            hasDismiss: false
        };
    },

    components: {
        ToastPortal,
        BoxAdPicture
    },

    props: {
        // 场景
        scene: {
            type: String,
            required: true
        },

        // 是否自动展示
        autoShow: {
            type: Boolean,
            default: true
        },

        // 是否展示
        show: {
            type: Boolean,
            default: false
        },

        // 自定义样式
        t_custom_style: {}
    },
    methods: {
        // 获取弹窗数据
        async getNotice () {
            try {
                let {scene} = this;
                let res = await NoticeModel.notice(scene);
                let resultRows = res.data.result_rows || {};
                let notices = resultRows.notices || {};
                // 获取弹窗
                this.notice = notices[0] || {};
                // 返回弹窗内容
                this.$emit('noticeReturn', this.notice);
            } catch (err) {
                this.$toast(err);
            }
        },

        // 触发弹窗行为
        // action枚举值 dismiss
        noticeAction (actionData = {}) {
            let {action = ''} = actionData;
            switch (action) {
            // 关闭弹窗
                case 'dismiss':
                    this.hasDismiss = true;
                    break;

                    // 返回上一个页面
                case 'goBack':
                    if (Tool.isInApp()) {
                        AppBridge.invokeJsBridge('onCloseClicked');
                    } else {
                        history.go(-1);
                    }
                    break;
                    // 跳转cps页面
                case 'linkToCps':
                    this.hasDismiss = true;
                    break;
                default:
                    break;
            }

            // 向上输出点击action，Todo
            // onReturn
            // onClose
            // onShow
            this.$emit('noticeAction', actionData);
            // 数据上报
        }
    },

    created () {
        this.getNotice();
    }
};

export default Notice;

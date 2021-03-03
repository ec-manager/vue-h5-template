// 新版急速授信组件,已改出gateway
import EventModel from '@/model/EventModel';
import Url from '@/mod/util/url/h5/1.0/url.js';
const eventModel = new EventModel();

const RapidBase = {
    data () {
        return {
            // 用户手机号
            mobile: '',
            // 图形验证码
            imgCode: '',
            // 获取图形验证码链接
            imgCodeUrl: '',
            // 短信验证码
            smsCode: '',
            // 短信倒计时
            smsCoutDown: 60,
            // 是否成功发送短信码
            isSendSms: false,
            // 是否成功通过图形验证码校验
            isCheckImg: false,
            // 已发送短信验证码的手机号
            verifiedMobile: '',
            // 是否是第一次发送短信
            isFirstSend: true,
            // 验证码流水
            svid: ''
        };
    },

    props: {
        // agent码
        agent: {
            type: String,
            default: ''
        },
        domain: {
            type: String,
            default: 'fenqile.com'
        }
    },

    computed: {
        // agent码
        agentCode () {
            return Url.get('agent', location.href) || this.agent;
        },

        // 倒计时文案
        getCountDownText () {
            return this.isSendSms ? '重新发送(' + this.smsCoutDown + 's)' : (this.isFirstSend ? '获取验证码' : '重新发送');
        }
    },

    methods: {
        handleClickLogin () {
            // 手机号存在且格式正确
            if (this.checkoutMobile()) {
                if (this.verifiedMobile !== '' && this.verifiedMobile !== this.mobile) {
                    this.$toast('请重新获取短信验证码');
                    this.isSendSms = false;
                    this.reSendSms(true);
                    this.verifiedMobile = '';
                    return false;
                }

                if ((this.isCheckImg || this.checkoutImageCode()) && this.checkoutSmsCode()) {
                    this.verifySmsCode();
                }
            }
        },

        // 发送短信验证码
        handleSendCode () {
            if (!this.imgCode) {
                this.$toast('请输入图片验证码，以获取短信验证码');
            }
            if (this.imgCode.length === 4) {
                if (this.checkoutMobile() && this.checkoutImageCode()) {
                    if (this.smsCoutDown < 60) {
                        this.$toast('请' + this.smsCoutDown + 's后再试');
                        this.handleRefreshImage();
                    } else {
                        this.sendSmsCode();
                    }
                } else {
                    this.handleRefreshImage();
                }
            }
        },

        // 刷新图形验证码
        handleRefreshImage () {
            // 重新请求验证码
            this.getImageCode();
            // 清空之前的验证码
            this.imgCode = '';
            this.smsCode = '';
            // 还原图片验证码校验标记
            this.isCheckImg = false;
            // 自动获取焦点
            document.querySelector('#image_code').focus();
        },

        // 短信验证码倒计时
        smsCodeCountDown () {
            let clearTimeout = setInterval(() => {
                if (--this.smsCoutDown === 0) {
                    clearInterval(clearTimeout);
                    this.smsCoutDown = 60;
                    this.isSendSms = false;
                    // 刷新图形验证码
                    this.handleRefreshImage();
                    this.isFirstSend = false;
                }
            }, 1000);
        },

        // 发送短信验证码
        async sendSmsCode () {
            try {
                let ret = await eventModel.smsCode(this.imgCode, this.mobile);
                // 验证码流水号
                this.svid = ret['data']['result_rows']['svid'];
                this.isCheckImg = true;
                this.isSendSms = true;
                this.$toast('短信验证码已发送');
                this.verifiedMobile = this.mobile;
                // 短信验证码倒计时
                this.smsCodeCountDown();
            } catch (error) {
                this.handleRefreshImage();
                this.$toast(error);
            }
        },

        // 校验短信验证码
        async verifySmsCode () {
            try {
                let ret = await eventModel.checkSmsCode(this.smsCode, this.mobile, this.svid, this.domain);
                let status = ret['data']['result_rows']['status'];
                if (parseInt(status) === 1) {
                    this.bindAgent();
                    this.$emit('success', ret);
                } else {
                    this.$toast('短信验证码失效');
                    this.handleRefreshImage();
                    setTimeout(() => {
                        // 重新发送短信
                        this.reSendSms();
                    }, 500);
                }
            } catch (error) {
                setTimeout(() => {
                    // 重新发送短信
                    this.reSendSms();
                }, 500);
                this.handleRefreshImage();
                this.$toast(error);
            }
        },

        // 绑定Agent码
        bindAgent () {
            if (this.agentCode) {
                let img = new Image();
                img.src = `https://auth.fenqile.com/route0007/work_loan_auth/user/update_user_agent.json?agent=${this.agentCode}`;
                document.body.appendChild(img);
            }
        },

        // 重新发送短信
        reSendSms (isHideTips = true) {
            if (!this.isSendSms) {
                if (!isHideTips) {
                    this.$toast('请输入图片验证码，以获取短信验证码');
                }
                this.handleRefreshImage();
                this.smsCode = '';
            }
        },

        // 校验手机号码
        checkoutMobile () {
            let reg = /^\d{11}$/;
            if (reg.test(this.mobile)) {
                return true;
            } else if (this.mobile) {
                this.$toast('手机号码格式有误');
            } else {
                this.$toast('请输入手机号码');
            }
            return false;
        },

        // 校验图形验证码
        checkoutImageCode () {
            let reg = /^[A-Za-z0-9]{4}$/;
            if (reg.test(this.imgCode)) {
                return true;
            } else if (this.imgCode) {
                this.$toast('图片验证码错误');
            } else {
                this.$toast('请输入图片验证码，以获取短信验证码');
            }
            return false;
        },

        // 校验短信验证码
        checkoutSmsCode () {
            let reg = /^\d{6}$/;
            if (reg.test(this.smsCode)) {
                return true;
            } else if (this.smsCode) {
                this.$toast('短信验证码错误');
            } else {
                this.$toast('请输入短信验证码');
            }
            return false;
        },

        // 获取图形验证码
        async getImageCode () {
            try {
                let ret = await eventModel.getImageCode();
                this.imgCodeUrl = 'data:image/jpeg;base64,' + ret['data']['result_rows']['base64'];
            } catch (error) {
                this.$toast(error);
            }
        }
    },

    created () {
        this.getImageCode();
    }
};

export default RapidBase;

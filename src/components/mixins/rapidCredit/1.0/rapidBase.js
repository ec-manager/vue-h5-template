import EventModel from '@/model/EventModel';
import Url from '@/mod/util/url/h5/1.0/url.js';
import App from '@/mod/util/app/h5/1.0/app.js';
const eventModel = new EventModel();

const RapidBase = {
    data () {
        return {
            // 用户手机号
            mobile: '',
            // 图形验证码
            imgCode: '',
            // 获取图形验证码链接
            imgCodeUrl: '/getimage?v=' + Math.random(),
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
            isFirstSend: true
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
        // 用户注册渠道来源
        channelFlag () {
            return Url.get('channel_flag', location.href) || 7101;
        },

        // agent码
        agentCode () {
            return Url.get('agent', location.href) || this.agent;
        },

        // 倒计时文案
        getCountDownText () {
            return this.isFirstSend ? this.isSendSms ? '重新发送(' + this.smsCoutDown + 's)' : '获取验证码' : '重新发送';
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
            this.imgCodeUrl = '/getimage?v=' + Math.random();
            // 清空之前的验证码
            this.imgCode = '';
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
            let ret = await eventModel.sendSmsCode(this.mobile, this.imgCode);
            if (parseInt(ret['retcode']) === 0) {
                this.isCheckImg = true;
                this.isSendSms = true;
                this.$toast('短信验证码已发送');
                this.verifiedMobile = this.mobile;
                // 短信验证码倒计时
                this.smsCodeCountDown();
            } else {
                this.handleRefreshImage();
                this.$toast(ret['retmsg']);
            }
        },

        // 校验短信验证码
        async verifySmsCode () {
            let ret = await eventModel.verifySmsCode(this.mobile, this.smsCode);
            if (parseInt(ret['retcode']) === 0) {
                this.doRegister();
            } else {
                this.handleRefreshImage();
                this.$toast(ret['retmsg']);
            }
        },

        // 登录注册
        async doRegister () {
            try {
                let ret = await eventModel.accountRegister(this.channelFlag, this.agentCode, this.domain);
                App.invokeJsBridge('onLogIn', {
                    url: location.href,
                    session_id: ret.system.session_id,
                    token_id: ret.system.token_id,
                    onReturn: function () {}
                });
                this.bindAgent();
                this.$emit('success', ret);
            } catch (error) {
                this.$toast(error);
                setTimeout(() => {
                    // 重新发送短信
                    this.reSendSms();
                }, 500);
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
        }
    }
};

export default RapidBase;

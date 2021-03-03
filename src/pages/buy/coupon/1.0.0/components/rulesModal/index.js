
import CpsProductModel from '../../model/CpsProductModel.js';
const G_MODULE_KEY = 'cps_config_json';
export default {
    name: 'rulesModal',
    props: {
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
            ruleConfig: {}
        };
    },
    methods: {
        closeModal () {
            this.$emit('close', false);
        },
        async getModuleConfig () {
            try {
                let res = await CpsProductModel.getModuleConfig([G_MODULE_KEY], 'hippo.ec_frd_common_params');
                if (+res.data.result === 0) {
                    let ret = res.data.result_rows || {};
                    // hippo配置字段
                    let module_config = ret.module_config || {};

                    if (module_config[G_MODULE_KEY] && module_config[G_MODULE_KEY].rules_config) {
                        this.ruleConfig = module_config[G_MODULE_KEY].rules_config;
                    }
                }
            } catch (err) {
                this.$toast(err);
            }
        }
    },
    created () {
        this.getModuleConfig();
    }
};

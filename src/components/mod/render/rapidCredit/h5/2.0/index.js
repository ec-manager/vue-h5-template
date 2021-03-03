import RapidBase from '@/mixins/rapidCredit/2.0/rapidBase.js';

export default {
    name: 'rapidCredit',
    extends: RapidBase,
    methods: {
        blurHandle () {
            this.$emit('blur');
        }
    }
};

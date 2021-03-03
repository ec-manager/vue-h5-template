import RapidBase from '@/mixins/rapidCredit/1.0/rapidBase.js';

export default {
    name: 'rapidCredit',
    extends: RapidBase,
    methods: {
        blurHandle () {
            this.$emit('blur');
        }
    }
};

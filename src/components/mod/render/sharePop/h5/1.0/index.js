/**
 * 非app环境的分享弹窗
 * @param show 显示
 * eg:
 *  <share-pop v-model="show"></share-pop>
 */
export default {
    name: 'sharePop',
    props: {
        show: {}
    },
    model: {
        prop: 'show',
        event: 'close'
    },
    methods: {
        // 右边部分的点击回调方法
        closeModal () {
            this.$emit('close', false);
        }
    }
};

export default {
    name: 'slide',
    props: {
        index: {
            type: [Number, String]
        }
    },
    data () {
        return {
            // 父组件实例
            parent: this.$parent
        };
    },
    computed: {
        // 是否是当前slide
        isCurrent () {
            return this.index === this.parent.currentIndex;
        },

        // 是否是下一个slide
        isNext () {
            return (this.parent.currentIndex < this.parent.count - 1) ? (this.index === this.parent.currentIndex + 1) : (this.index === 0);
        },

        // 是否是上一个slide
        isPrev () {
            return this.parent.currentIndex === 0 ? (this.index === this.parent.count - 1) : (this.index === this.parent.currentIndex - 1);
        },

        // 计算class
        computedClasses () {
            return {
                'slide-active': this.isCurrent,
                'slide-next': this.isNext,
                'slide-prev': this.isPrev
            };
        }
    }
};

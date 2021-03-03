<template>
    <div v-show="currentIndex == index">
        <slot name="default"></slot>
    </div>
</template>

<script>
export default {
    name: 'tabPane',

    computed: {
        currentIndex () {
            return this.$parent.value || 0;
        }
    },

    props: {
        index: {
            type: [Number, String],
            required: true
        }
    }
};
</script>

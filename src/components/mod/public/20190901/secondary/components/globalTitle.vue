<template>
    <div class="g-title" v-if="options.title">
        <div class="g-title-h3">
            <div class="y1"></div>
            <div class="y2"></div>
            <div class="y3"></div>
            <h3>{{options.title}}</h3>
            <div class="y3"></div>
            <div class="y2"></div>
            <div class="y1"></div>
        </div>
        <p v-if="options.p">{{options.p}}</p>
    </div>
</template>
<script>
export default {
    name: 'global-title',
    components: {},
    computed: {},
    props: {
        // 精选大牌
        options: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    methods: {},
    data () {
        return {};
    },
    created () {},
    mounted () {}
};
</script>

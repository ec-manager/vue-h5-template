<template>
    <div class="g-title-box" v-if="options.title">
        <h3 class="g-title"><i class="title-icon icon-left"></i>{{options.title}}<i class="title-icon icon-right"></i></h3>
        <p class="g-title-tip" v-if="options.title_tip">{{options.title_tip}}</p>
    </div>
</template>
<script>
/**
 * @author melody
 * @des 6周年公共标题组件
 * @params options：楼层配置，包含title和title_tip字段，表示楼层标题
 */
export default {
    name: 'globalTitle',
    props: {
        options: {
            type: Object,
            default: () => {}
        }
    }
};
</script>

<template>
  <section class="marquee-wrap">
      <div class="marquee" ref="marquee" :style="{'animationDuration': duration,width:w}">
            <p class="text-item" v-for="(item, index) of data" :key="index">{{item}}</p>
            <p class="text-item" v-for="(item, index) of data" :key="`copy-${index}`">{{item}}</p>
      </div>
  </section>
</template>

<script>
export default {
    name: 'marquee',
    props: {
        /* 跑马灯数据 */
        data: {
            type: Array,
            default: () => []
        },
        /* 跑马灯速度，数值越大速度越快 */
        speed: {
            type: Number,
            default: 50
        }
    },
    data () {
        return {
            duration: 0,
            w: '375px' // 默认375宽
        };
    },
    mounted () {
        /* 跑马灯速度，使用跑马灯内容宽度 除以 速度 得到完整跑完一半内容的时间 */
        this.duration = ~~this.$refs.marquee.getBoundingClientRect().width * this.data.length / this.speed + 's';
        this.w = (~~this.$refs.marquee.getBoundingClientRect().width * this.data.length) + 'px';
    }
};
</script>

<style lang="less" scoped>
@import "~@/inc/sales/style/mixin/fn.less";

.marquee-wrap {
    position: relative;
    overflow-x: hidden;
    height: 60px/@p;
}

.marquee {
    position: absolute;
    font-size: 0;
    display: flex;
    white-space: nowrap;
    animation-name: marquee;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
}

.text-item {
    padding: 0 24px/@p;
    line-height: 60px/@p;
    background: rgba(163, 34, 49, .8);
    margin-right: 24px/@p;
    font-size: 24px/@p;
    border-radius: 28px/@p;
    /* 解决Font Boosting */
    // -webkit-text-size-adjust: none;
    max-height: 999px;
    color: #ffffff;
}

@keyframes marquee {
    to { transform: translateX(-50%);}
}
</style>

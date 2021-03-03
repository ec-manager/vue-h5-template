<template>
    <swiper-product
        class="newer-pro-wrap"
        wrapClass="swiper-newer-pro"
        :pid="options.plate_id"
        :skuNum="skuNum"
        :eventType="11"
        :style="{background: options.bg_color, border: borderColor}"
        v-if="isNewer">
        <template slot="default" slot-scope="{product}">
            <div class="pro-img">
                <img class="covimg" v-lazy="product.goodsImg">
            </div>
            <h3 class="pro-tit">{{product.goodsName}}</h3>

            <div class="pro-price" v-if="product.customLabelOne && product.customLabelTwo">
                <p class="pro-tag" :style="{color: options.tag_color, backgroundColor: options.tag_bg}">新人价</p>
                <p class="amount" :style="{color: options.amount_color}">&yen;{{product.customLabelOne}}</p>
                <div class="cover-link" @click.stop="customHref(product.customLabelTwo)"></div>
            </div>

            <div class="pro-price" v-else-if="product.newUserAmount > 0">
                <p class="pro-tag" :style="{color: options.tag_color, backgroundColor: options.tag_bg}">新人价</p>
                <p class="amount" :style="{color: options.amount_color}">&yen;{{product.newUserAmount}}</p>
            </div>
            <div class="pro-price" v-else>
                <p class="amount" :style="{color: options.amount_color}">&yen;{{product.realAmount}}</p>
            </div>
        </template>
    </swiper-product>
</template>

<script>
import Tool from '@/mod/util/tool/1.0/tool.js';
import SwiperProduct from '@/mod/render/swiperProduct/h5/1.0/index.vue';

export default {
    name: 'newer-product',
    components: {
        SwiperProduct
    },
    filters: {
        // 市场价取整
        toInt (value) {
            return ~~value;
        }
    },
    props: {
        options: {
            type: Object,
            default: () => {}
        },
        skuNum: {
            type: Number,
            default: 3
        },
        isNewer: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            tool: Tool
        };
    },
    computed: {
        borderColor () {
            return '0.08rem solid ' + this.options.border_color;
        }
    },
    methods: {
        // 当自定义价格与链接时，阻止冒泡，不能使用v-href，阻止不了冒泡，依旧会跳去sku
        customHref (href) {
            this.$href(href);
        }
    }
};
</script>

<style lang="less" scoped>
@import '~@/inc/sales/style/mixin/fn.less';
@import '~@/mod/public/20191129/secondary/style/common.less';

.newer-pro-wrap {
    border-radius: 10px/@p;
    overflow: hidden;
}

/deep/ .swiper-newer-pro {
    padding: 10px/@p 20px/@p 20px/@p;

    .sales-pro-list {
        padding: 0;
    }

    .swiper-pro-item {
        position: relative;
        width: 240px/@p;

        &:nth-child(n+2) {
            margin-left: 10px/@p;
        }
    }

    .cover-link {
        position: absolute;
        top: 0;
        left: 0;
        .size(100%);
        z-index: 3;
    }

    .pro-wrap {
        display: block;
        padding: 10px/@p;
        border-radius: 10px/@p;
        background-color: #fff;
    }

    .pro-img {
        height: 180px/@p;
        padding: 0 20px/@p;
    }

    .covimg {
        display: block;
        .size(100%);
    }

    .pro-tit {
        margin-top: 10px/@p;
        color: #666;
        font-size: 22px/@p;
        .text-of();
    }

    .pro-price {
        .flex(ae);
        margin-top: 18px/@p;
        line-height: 30px/@p;
    }

    .pro-tag {
        .flex(vm);
        width: 80px/@p;
        height: 30px/@p;
        margin-right: 8px/@p;
        font-size: 20px/@p;
        border-radius: 10px/@p;
    }

    .amount {
        color: #333;
        font-size: 30px/@p;
        font-weight: 700;
    }
}

</style>

<template>
    <div class="img-brand-sku-wrap">
        <ul class="img-brand-wrap" v-if="brands.length">
            <template v-for="(item,index) in brands">
                <li class="brand-item" :class="[item.is_main ? 'brand-main' : '']" :key="'img_brand_'+index" :style="{height: tool.toRem(item.height||220)}">
                    <a href="javascript:;" v-href="item.href" v-stat="'LINK_'+statPrefix+'IMGBRAND_'+index">
                        <img v-lazy="tool.addDomain(item.img)" class="imgauto" />
                    </a>
                </li>
            </template>
        </ul>
        <!-- swiper-sku -->
        <swiper-product class="swiper-brand-pro" :pid="options.plate_id" :skuNum="3" v-if="options.plate_id"></swiper-product>
    </div>
</template>
<script>
/**
 * @author feng
 * @des 2020年9月大促1拖10 图片+ sku
 * @params options：楼层配置
 * @params statPrefix：埋点统计前缀
 */
import Tool from '@/mod/util/tool/1.0/tool.js';
import SwiperProduct from '@/mod/render/swiperProduct/h5/1.0/index.vue';

export default {
    name: 'imgBrandSku',
    components: {
        SwiperProduct
    },
    props: {
        options: {
            type: Object,
            default: () => {}
        },
        statPrefix: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            tool: Tool
        };
    },
    computed: {
        brands () {
            return this.options && this.options.brands ? this.options.brands : [];
        }
    }
};

</script>
<style lang="less" scoped>
@p: 75px/1rem;

.img-brand-sku-wrap{
    padding: 0 20px/@p;
    margin-bottom: 20px/@p;
}
.img-brand-wrap {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;

    li {
        height: 220px/@p;
        margin-bottom: 5px/@p;
    }

    .brand-item {
        width: 174px/@p;
        a {
            display: block;
            height: 100%
        }
    }

    .brand-main {
        width: 352px/@p;
    }
}

</style>

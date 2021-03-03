<template>
    <section class="banner-wrap">
        <div class="search-bar-wrap">
            <div class="search-box" v-if="searchBar && searchBar.search && searchBar.search.is_show && searchBar.search.newList && searchBar.search.newList.length" :style="{height: tool.toRem(searchBar.search.height)}">
                <img v-lazy="tool.addDomain(searchBar.search.newList[0].src_img)" class="imgauto" />
                <a v-for="(item, index) in searchBar.search.newList[0].links" :key="index" :style="{width: tool.toRem(item.width)}" v-href="item.href" v-stat="'LINK_SEARCHBAR_'+index"></a>
            </div>
            <div class="interest-box" v-if="searchBar && searchBar.interest && searchBar.interest.is_show && searchBar.interest.newList && searchBar.interest.newList.length" :style="{height: tool.toRem(searchBar.interest.height)}">
                <img v-lazy="tool.addDomain(searchBar.interest.newList[0].src_img)" class="imgauto" />
                <template v-for="(item, index) in searchBar.interest.newList[0].links">
                    <a v-if="!item.is_rule" :style="{width: tool.toRem(item.width)}" v-href="item.href" :key="index"></a>
                    <a v-else :style="{width: tool.toRem(item.width)}" href="javascript:;" data-fql-stat="BTN_RULE" :key="index" @click="togglePopRuleStatus()"></a>
                </template>
            </div>
        </div>
        <div class="banner-box">
            <!-- banner利益点（包含大标题和轮播利益点） -->
            <template v-for="(item, index) of banner.interest">
                <template v-if="banner && banner.interest_is_show && tool.isActiveDate(item) === 1">
                    <img class="title-img" v-lazy="tool.addDomain(item.src_img)" :key="'img_' + index">
                    <div class="marquee-wrap" ref="marquee" :key="index">
                        <p :class="['interest', {'enter': !textIndex}, {'leave': textIndex === 1}]" v-for="(textItem, textIndex) of item.list" :key="textIndex">{{textItem}}</p>
                    </div>
                </template>
            </template>
            <!-- banner图 -->
            <div class="banner" :style="{height: tool.toRem(banner.img_height)}" v-if="!banner.img_list">
                <img class="covimg" v-lazy="tool.addDomain(banner.banner_img)">
            </div>
            <template v-else>
                <template v-for="(item,index) in banner.img_list">
                    <div class="banner" :style="{height: tool.toRem(item.img_height)}" v-if="tool.isActiveDate(item) === 1" :key="'banner_list_'+index">
                        <img class="covimg" v-lazy="tool.addDomain(item.banner_img)">
                    </div>
                </template>
            </template>
        </div>
    </section>
</template>
<script>
/**
 * @author feng
 * @params options：楼层配置
 */
import Tool from '@/mod/util/tool/1.0/tool.js';

export default {
    name: 'headerTopNew',
    props: {
        options: {
            type: Object,
            default: () => {
                return {
                    search_bar: {},
                    banner: {}
                };
            }
        },
        isGetAllConfig: {
            type: Boolean,
            default: false
        }
    },
    components: {},
    data () {
        return {
            tool: Tool,
            childNode: [],
            marqueeIndex: 0 // banner利益点动画文案索引
        };
    },
    computed: {
        banner () {
            return this.options.banner;
        },
        searchBar () {
            let searchBar = JSON.parse(JSON.stringify(this.options.search_bar));
            let interestObj = this.options.search_bar && this.options.search_bar.interest ? this.options.search_bar.interest : {};
            let newInterestList = this.handleList(interestObj);
            searchBar.interest = Object.assign({}, interestObj, {
                newList: newInterestList
            });

            let searchObj = this.options.search_bar && this.options.search_bar.search ? this.options.search_bar.search : {};
            let newSearchList = this.handleList(searchObj);
            searchBar.search = Object.assign({}, searchObj, {
                newList: newSearchList
            });
            return searchBar;
        }
    },
    watch: {
        // 是否已获取所有配置（会场自身配置及其他公用部分的配置）
        isGetAllConfig: {
            handler (newV) {
                this.$nextTick(() => {
                    if (!this.$refs.marquee) return;
                    this.childNode = Array.from(this.$refs.marquee[0].children);
                    this.marquee();
                });
            },
            immediate: true
        }
    },
    methods: {
        // 利益点动画类目切换
        marquee () {
            setTimeout(() => {
                // this.childNode[this.marqueeIndex].classList.add('leave');
                // this.childNode[this.marqueeIndex].classList.remove('enter');

                this.childNode.forEach(v => {
                    v.classList.remove('leave');
                    v.classList.remove('enter');
                });
                this.childNode[this.marqueeIndex].classList.add('leave');
                if (this.marqueeIndex === this.childNode.length - 1) {
                    this.marqueeIndex = 0;
                } else {
                    this.marqueeIndex += 1;
                }

                // this.childNode[this.marqueeIndex].classList.remove('leave');
                this.childNode[this.marqueeIndex].classList.add('enter');
                this.marquee();
            }, 2000);
        },
        togglePopRuleStatus () {
            this.$emit('togglePopRuleStatus');
        },
        handleList (obj) {
            let oldList = obj.list || [];
            let newList = [];
            newList = oldList.filter(v => {
                return Tool.isActiveDate(v) === 1;
            });
            newList.length && (newList = newList.slice(0));
            return newList;
        }
    }
};

</script>
<style lang="less" scoped>
@import "~@/inc/sales/style/mixin/fn.less";
@p: 75px/1rem;

.banner-wrap {
    position: relative;
    // margin-bottom: -248px/@p;

    .title-img,
    .marquee-wrap,
    .bububble {
        position: absolute;
        z-index: 3;
    }

    .title-img {
        top: 123px / @p;
        height: 173px / @p;
        width: 100%;
    }

    .marquee-wrap {
        top: 247px / @p;
        width: 433px / @p;
        height: 46px / @p;
        left: 158px / @p;
        border-radius: 23px / @p;
        background-image: linear-gradient(to right, #0363ff, #ff40f5);
        /*! autoprefixer: off */
        background-size: contain;
        /*! autoprefixer: on */
    }

    .interest {
        position: absolute;
        .flex(vm);
        .size(100%);
        color: #fff;
        font-size: 30px / @p;
        font-weight: 500;
        mask-size: 200% 100%;
        mask-position: -100% 0;
        mask-image: url(../img/mask.png);
    }

    .enter {
        animation: enter 1s 0.3s linear both;
    }

    .leave {
        mask-image: url(../img/mask_l.png);
        animation: leave 1s linear both;
    }

    .banner {
        max-width: 100%;
    }
}

.covimg {
    display: block;
    max-width: 100%;
    height: auto;
}

/* 两个动画一样，但是不切换动画名无法再次执行 */
@keyframes enter {
    from {
        mask-position: -100% 0;
    }

    to {
        mask-position: -200% 0;
    }
}

@keyframes leave {
    from {
        mask-position: -100% 0;
    }

    to {
        mask-position: -200% 0;
    }
}

/* search_bar */
.search-bar-wrap {

    .search-box,
    .interest-box {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: row;

        img {
            position: absolute;
            width: 100%;
            height: 100%;
        }

        a {
            position: relative;
            z-index: 1;
            display: block;
            height: 100%
        }
    }
}

.banner-box {
    position: relative;
}

</style>

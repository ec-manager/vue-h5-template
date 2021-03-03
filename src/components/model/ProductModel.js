/**
 * 接口文档：http://wiki.fenqile.com/pages/viewpage.action?pageId=33230977
 * @name 商品模型类
 * @author beginning
 * @class ProductModel
 */
class ProductModel {
    /**
     * @description [ 获取板块ID下的商品列表 ]
     * @param {Stirng} pid [ 板块id ]
     * @param {Number} type [ 平台类型 1:pc 2:app 3:h5 4：乐小推小程序]
     * @param {Number} eventType [ 活动类型 1:普通活动 2:特卖活动 11:普通乐黑卡 ]
     * @param {Number} offset [ 偏移值 ]
     * @param {Number} limit [ 每次请求sku个数 ]
     * @returns Promise
     * @memberof ProductModel
     */
    getProductList (pid, type, eventType = 1, offset = 0, limit = 60) {
        return Vue.prototype.$http.post('/route0002/eventMall/querySkuList.json', {
            plateId: pid,
            channelType: type,
            eventType: eventType,
            offset: offset,
            limit: limit,
            isGateway: true
        });
    }
    /**
     * @description [ 获取活动ID下的板块列表 ]
     * @param {String} eventId [ 活动ID ]
     * @returns Promise
     * @memberof ProductModel
     */
    getPlateList (eventId) {
        return Vue.prototype.$http.post('/route0002/eventMall/queryPlate.json', {
            eventId: eventId,
            isGateway: true
        });
    }
    /**
     * @description [ 获取sku对应的优惠力度最大的优惠券信息 ]
     * @param {Number} channelType [ 渠道ID，默认h5 1000:pc;2000:h5;3000:app ]
     * @param {Object} productList [ 商品信息类别 ]
     * @returns Promise
     * @memberof ProductModel
     */
    getMaxDiscount (channelId, productList) {
        return Vue.prototype.$http.post('/route0002/productDetail/showMaxDiscount.json', {
            channel_id: channelId,
            good: productList,
            isGateway: true
        });
    }
    /**
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=33455981 ]
     * @description [ 拉取商品评价信息 ]
     * @param {Array} productIds [ 商品列表 ]
     * @returns Promise
     * @memberof ProductModel
     */
    getProductComment (productIds) {
        return Vue.prototype.$http.post('/route0002/eventAcc/querySkuCommentSta.json', {
            productIds: productIds,
            isGateway: true
        });
    }
    /**
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=33676058 ]
     * @description [ 查询sku list费率促销信息 仅供商详页和商品列表页查询 ]
     * @param {Number} source_type [ 用户场景（1：商详页；3、商品列表页） ]
     * @param {Number} channel_type [ 推广平台(1:PC；2:APP 3:H5 ) ]
     * @param {array} sku_list [ 商品skuID列表 ]
     * @returns Promise
     * @memberof ProductModel
     */
    getNewFreeFqNum (skuIds, type) {
        let obj = skuIds.map(function (skuId) {
            return { sku_id: skuId };
        });
        return Vue.prototype.$http.post('/route0002/opFee/getSkuFeeEventListBatch.json', {
            sku_list: obj,
            source_type: 3,
            channel_type: type,
            isGateway: true
        });
    }

    /**
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=31443090 ]
     * @description [ 拉取商品预售 ]
     * @param {Array} skuIdList [ 商品列表 ]
     * @param {Number} channel_type [ 推广平台(1:PC；2:APP 3:H5 ) ]
     * @returns Promise
     * @memberof ProductModel
     */
    getProductOrder (skuIdList, type) {
        return Vue.prototype.$http.post('/route0002/presale/getSkuPreSaleInfo.json', {
            sku_id_list: skuIdList,
            channel_type: type,
            isGateway: true
        });
    }

    /**
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=34247148 ]
     * @description [ 新人专区 - 拉取券后折后价格 ]
     * @param {Array} skuIdList [ 商品列表 ]
     * @param {Number} discount_event_id [ 券包Id    必传 ]
     * @returns Promise
     * @memberof ProductModel
     */
    getDiscountAmount (skuIdList, cid) {
        return Vue.prototype.$http.post('/route0002/eventAcc/getDiscountAmount.json', {
            sku_list: skuIdList,
            discount_event_id: cid,
            isGateway: true
        });
    }

    /**
     * @description [ 商品加入购物车 ]
     * @returns Promise
     * @param {Array} addItemList [ 商品列表 ]
     *      @param  {Number} amount [ 商品价格 ]
     *      @param  {String} skuId [ skuID ]
     *      @param  {Number} buyQuantity [ 购买数量 ]
     * @param {Number} channelType [ 入口来源类型 1：pc  3:h5  2：app ]
     * @param {Number} sceneType [ 加入购物车场景  0：商详页 1：非商详页 ]
     * @memberof EventModel
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=29543515 ]
     */
    addShopCart (addItemList, channelType, sceneType = 1) {
        return Vue.prototype.$http.post('/route0002/shoppingCart/batchModify.json', {
            action: 'batchModify',
            add_item_list: addItemList,
            channel_type: channelType + '',
            scene_type: sceneType,
            isGateway: true
        });
    }

    /**
     * @description [ 查询乐疯抢有效板块 ]
     * @returns Promise
     * @memberof EventModel
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=33229241 ]
     */
    quryLimitPlateByChannel () {
        return Vue.prototype.$http.post('/route0002/eventMall/quryLimitPlateByChannel.json', {
            isGateway: true
        });
    }

    /**
     * @description [ 查询乐疯抢商品详情 ]
     * @param {String} event_id [ 乐疯抢活动ID ]
     * @param {Number} channel_type [ 入口来源类型 1：pc  3:h5  2：app ]
     * @param {String} plate_id [ 板块ID ]
     * @param {Number} limit [ 分页条数 ]
     * @param {Number} offset [ 分页偏移量 ]
     * @returns Promise
     * @memberof EventModel
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=33229241 ]
     */
    queryRecommendSkuList (eventId, channelType, plateId, limit = 10, offset = 0) {
        return Vue.prototype.$http.post('/route0002/tencentRecommend/queryRecommendSkuList.json', {
            isGateway: true,
            event_id: eventId,
            channel_type: channelType,
            plate_id: plateId,
            limit: limit,
            offset: offset
        });
    }

    /**
     * @description [ 查询类目sku排行榜 ]
     * @returns Promise
     * @param {Array} categorys [ 类目ID数组 ]
     *      @param {String} id [ 类目ID ]
     *      @param {Number} level [ 类目级别 ]
     * @param {Number} limit [ 分页条数 ]
     * @memberof EventModel
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=41429547 ]
     */
    getSkuRankBatch (categoryIds, limit) {
        return Vue.prototype.$http.post('/route0002/eventMall/category/skuRankBatch.json', {
            isGateway: true,
            categorys: categoryIds,
            limit: limit
        });
    }

    /**
     * @description [ 获取购物车商品数量 ]
     * @returns Promise
     * @memberof EventModel
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=31672681 ]
     */
    getShoppingCartTotalNum () {
        return Vue.prototype.$http.post('/route0002/productDetail/getShoppingCartTotalNum.json', {
            isGateway: true
        });
    }

    /**
     * @description [ 乐疯抢2.0，查询今/明商品板块场次 ]
     * @param {Number} type [类型，0：今日，1：明日]
     * @returns Promise
     * @memberof EventModel
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=44150295 ]
     */
    queryChannelTitle (type = 0) {
        return Vue.prototype.$http.post('/route0002/eventMall/benefit/channelTitle.json', {
            type,
            isGateway: true
        });
    }

    /**
     * @description [ 乐疯抢2.0，sku列表查询 ]
     * @param {String} plate_id [商品板块ID]
     * @param {Number} type [类型，0：爆款(不接推荐，权重排序)，1：热销(热销+品类打散排序)，3：权重排序]
     * @returns Promise
     * @memberof EventModel
     * @description 由于乐疯抢必须实时查询，后台没走缓存，所以查询商品需要用新接口
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=44150295 ]
     */
    queryHappySkuList (plateId, type, offset, limit) {
        return Vue.prototype.$http.post('/route0002/eventMall/benefit/querySkuList.json', {
            plate_id: plateId,
            type,
            offset,
            limit,
            isGateway: true
        });
    }

    /**
     * @description [ 获取商品额外信息 ]
     * @param {Array} skuInfoList
     * @returns Promise
     * @memberof ProductModel
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=45325518 ]
     */
    getVipProInfo (skuInfoList) {
        return Vue.prototype.$http.post('/route0002/vip/queryVipSkuDiscount.json', {
            isGateway: true,
            skuInfoList
        });
    }

    /**
     * @description [ 爆款页商品券后价 新人立减金额 新人到手价查询  ]
     * @param {Array} skuInfoList [ skuId列表（必传）]
     * @returns Promise
     * @memberof ProductModel
     * @wiki [ http://wiki.fenqile.com/pages/viewpage.action?pageId=37500831 ]
     */
    getPopToHandAmount (skuInfoList) {
        return Vue.prototype.$http.post('/route0002/eventMall/queryPopularInfo.json', {
            skuInfoList: skuInfoList,
            channelType: 3,
            ecChannel: 'FQL',
            plat: 'FQL',
            isGateway: true
        });
    }
}

export default ProductModel;

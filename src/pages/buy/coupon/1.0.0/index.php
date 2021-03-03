<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no,viewport-fit=cover" name="viewport">
    <meta content="yes" name="apple-mobile-web-app-capable">
    <meta content="black" name="apple-mobile-web-app-status-bar-style">
    <meta content="telephone=no" name="format-detection">
    <meta content="email=no" name="format-detection">
    <link rel="dns-prefetch" href="//cres.fenqile.cn">
    <link rel="dns-prefetch" href="//cres1.fenqile.cn">
    <link rel="dns-prefetch" href="//cres2.fenqile.cn">
    <meta name="keywords" content="" />
    <meta name="description" content="" />
    <meta name="page" content="SALE.<?php echo $gvv_page_id;?>.INDEX" />
    <title><?php echo empty($gvv_base_info)?'':$gvv_base_info['name'];?></title>
    <?php echo View::factory('inc/sales/lib/h5/1.0/lib'); ?>
    <?php echo View::factory('inc/sales/global/h5/1.0/global'); ?>
    <script>var G_EVENT_CONFIG = <?php echo empty($gvv_event_config) ? '{}' : json_encode($gvv_event_config); ?>;var G_BASE_INFO = <?php echo empty($gvv_base_info) ? '{}' : json_encode($gvv_base_info); ?>;var G_CURRENT_SERVICE_TIME = <?php echo $view_data['current_service_time'] ?>;</script>
</head>
<body>
    <div id="app"></div>
    <!-- built files will be auto injected -->
    <input type="hidden" id="is_login" value="0" />
</body>
</html>

window.init_pre_roll_ad = function(on_complete) {    
    var ads_manager;
    var ads_loader;
    var ad_display_container;
    var intervalTimer;

    var $video = $('#video');
    var $video_player = $video.find('video');
    var $pre_roll = $('#pre-roll-ad');

    // This URL from the DFP's Generate Tags button doesn't work...
    //var ad_tag_url = 'http://pubads.g.doubleclick.net/gampad/ads?sz=400x300&iu=/6735/n6735.nprtest&ciu_szs=88x31&impl=s&gdfp_req=1&env=vp&output=xml_vast2&unviewed_position_start=1&url=[referrer_url]&correlator=[timestamp]';
    
    // ... but this url cut from the test page works fine?
    var ad_tag_url = 'http://ad.doubleclick.net/pfadx/n6735.NPR.MUSIC/music_music_videos;agg=92071316;theme=92071316;storyid=141845299;genre=latin_alternative_world;artists=16635253;embed=npr;mediatype=video;sz=400x300;dcmt=text/xml;ord=1291488419';

    function request_ads() {
        ad_display_container = new google.ima.AdDisplayContainer($pre_roll[0]);

        // Initialize the container, if requestAds is invoked in a user action.
        // This is only needed on iOS/Android devices.
        ad_display_container.initialize();

        ads_loader = new google.ima.AdsLoader(ad_display_container);

        ads_loader.addEventListener(
            google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
            on_ads_manager_loaded,
            false);
        ads_loader.addEventListener(
            google.ima.AdErrorEvent.Type.AD_ERROR,
            on_ad_error,
            false);

        var ads_request = new google.ima.AdsRequest();
        ads_request.adTagUrl = ad_tag_url;

        ads_loader.requestAds(ads_request);
    }

    function on_ads_manager_loaded(ads_managerLoadedEvent) {
        ads_manager = ads_managerLoadedEvent.getAdsManager($video_player[0]);

        ads_manager.addEventListener(
            google.ima.AdErrorEvent.Type.AD_ERROR,
            on_ad_error);
        ads_manager.addEventListener(
            google.ima.AdEvent.Type.COMPLETE,
            on_ad_complete);

        try {
            ads_manager.init($video.width(), $video.height(), google.ima.ViewMode.NORMAL);

            ads_manager.start();
        } catch (adError) {
            // An error may be thrown if there was a problem with the VAST response.
        }
    }

    function on_ad_complete(ad_event) {
        ad_display_container.destroy();
        on_complete();
    }

    function on_ad_error(ad_error) {
        console.log(ad_error.getError());
    }

    // Kick off the ads request
    request_ads();
}

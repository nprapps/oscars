$(document).ready(function() {
    /* VARS */
    var video_length = APP_CONFIG['VIDEO'][window.PAGE_NAME]['LENGTH'];
    var jplayer = null;
    // http://stackoverflow.com/questions/8890460/how-to-detect-ie7-and-ie8-using-jquery-support
    var video_supported = $.support.leadingWhitespace;
    var have_shown_ad = false;
    var ad_running = false;

    /* ELEMENTS */
    var $main_content = $('#main-content');
    var $video_wrapper = $('#video-wrapper');
    var $video = $('#video');
    var $pre_roll = $('#pre-roll-ad');
    var $cue_list_end = $('#list-nav-end');

    resize_app();

    if (video_supported) {
        /*
         * Load video player
         */
        $video.jPlayer({
            swfPath: 'Jplayer.swf',
            //solution: 'flash, html',
            supplied: 'm4v, ogv',
            size: {
                width: $video.width(),
                height: $video.height()
            },
            ready: function() {
                // Never show the ad if falling back to flash
                if ($(this).data('jPlayer').flash.used) {
                    have_shown_ad = true;
                }

                $(this).jPlayer('setMedia', {
                    m4v: APP_CONFIG['VIDEO'][window.PAGE_NAME]['MP4_URL'], 
                    ogv: APP_CONFIG['VIDEO'][window.PAGE_NAME]['OGV_URL'],
                });
            },
            play: function() {
                if (ad_running) {
                    // Do nothing
                } else if (!have_shown_ad) {
                    $video.jPlayer('stop');
                    run_ad();
                } else {
                    $video.jPlayer('play');
                }
            }
        });
    } else {
        $video_wrapper.hide();
    }


    function run_ad() {
        width = $main_content.width();

        ad_running = true;
        $pre_roll.width(width + 'px');
        
        window.init_pre_roll_ad(function() {
            $pre_roll.hide();

            $video.jPlayer('play');

            have_shown_ad = true;
            ad_running = false;
        });
    }

    function load_cue_data() {
        /*
         * Load cue data from external JSON
         */
        var endlist_output = '';

        $.getJSON('live-data/' + window.PAGE_NAME + '.json', function(data) {
            $.each(data, function(i, v) {
                // Markup for this cue in the cue nav
                // via Underscore template / JST
                var context = v;
                context['id'] = i + 1;

                endlist_output += JST.endlist(context);
            });

            $cue_list_end.find('a.hide-links').click(function() {
                var $hide_links = $(this);
                var $parent = $hide_links.parent();
                var $content_links = $parent.find('.content-links');
                var $show_links = $parent.find('.show-links');
                
                $hide_links.hide();
                $content_links.hide();
                $show_links.show();
            });

            $cue_list_end.find('a.show-links').click(function() {
                var $show_links = $(this);
                var $parent = $show_links.parent();
                var $content_links = $parent.find('.content-links');
                var $hide_links = $parent.find('.hide-links');
                
                $show_links.hide();
                $content_links.show();
                $hide_links.show();
            });
        });
    }

    function resize_app() {
        /*
         * Resize based on screen width
         */
        var new_width = $main_content.width();

        $video_wrapper.width(new_width + 'px');
        $video.width(new_width + 'px');
        $pre_roll.width(new_width + 'px');
    }

    $(window).resize(resize_app);

    /*
     * INIT
     */
    load_cue_data();
});

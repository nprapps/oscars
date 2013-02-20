$(document).ready(function() {
    var AD_TAG_URL = 'http://ad.doubleclick.net/pfadx/n6735.NPR/arts___life_movies;agg=172412715;theme=172412715;storyid=172412316;embed=npr;mediatype=video;sz=400x300;dcmt=text/xml;ord=477250141';

    var $oscars = $('#main-content');
    var $video = $('#video');
    var $cue_list_end = $('#film-list');

    function lights_down() {
        $('body').append('<div id="fade"></div>');
        $('#fade').fadeIn(250);
    }

    function lights_up() {
        $('#fade').fadeOut(500, function() {
            $("#fade").remove();
        });
    }

    function init_player() {
        jwplayer('video').setup({
            modes: [{
                type: 'flash',
                src: 'http://www.npr.org/templates/javascript/jwplayer/player.swf',
                config: {
                    skin: 'http://media.npr.org/templates/javascript/jwplayer/skins/mle/npr-video-archive/npr-video-archive.zip',
                    file: APP_CONFIG['VIDEO'][window.PAGE_NAME]['MP4_URL'],
                    'hd.file': APP_CONFIG['VIDEO'][window.PAGE_NAME]['HD_URL'] 
                }
            }, {
                type: 'html5',
                config: {
                    levels: [
                        { file: APP_CONFIG['VIDEO'][window.PAGE_NAME]['MP4_URL'] }
                    ]
                }
            }],
            bufferlength: '5',
            controlbar: 'over',
            icons: 'true',
            autostart: false,
            width: $video.width(),
            height: $video.height(),
            plugins: {
                'gapro-2': {
                    'trackingobject': '_gaq',
                    'trackstarts': 'true',
                    'trackpercentage': 'true',
                    'tracktime': 'true'
                },
                googima: {
                    ad:
                    {
                        ad1:
                        {
                            tag: AD_TAG_URL,
                            type: "video",
                            position: "pre"
                        }
                    },
                    admessagedynamic: "Your video will begin in XX seconds",
                    admessagedynamickey: "XX",
                    // adcounterdynamic: "Ad X of Y",
                    // adcountercountkey: "X",
                    // adcountertotalkey: "Y",
                    allowadskip: true,
                    allowadskippastseconds: "10",
                    click_tracking: true,
                    invertmutebutton: false,
                    allowplayercontrols: false,
                    companionDiv: "event_card_sponsor",
                    pauseOnAdOpen: false
                },
                'hd-2': {}
            }
        });

        jwplayer().onPlay(lights_down);
        jwplayer().onPause(lights_up);
        jwplayer().onComplete(lights_up);
        jwplayer().onReady(function() { jwplayer().getPlugin('googima').onAdStart(lights_down) });
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

            $cue_list_end.append(endlist_output);

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
        var new_width = $oscars.width();
        var new_height = Math.floor(new_width * 9 / 16);

        $video.width(new_width + 'px').height(new_height + 'px');
    }

    $(window).resize(resize_app);

    /*
     * INIT
     */
    resize_app();
    init_player();
    load_cue_data();
});

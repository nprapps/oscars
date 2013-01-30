$(document).ready(function() {
    /* VARS */
    var active_cue = 0;
    var video_length = APP_CONFIG['VIDEO'][window.PAGE_NAME]['LENGTH'];
    var num_cues = 0;
    var cue_data = [];
    var pop = null;
    var video_supported = !($.browser.msie === true && $.browser.version < 9);
    var cue_list_open = false;

    /* ELEMENTS */
    var $main_content = $('#main-content');
    var $video = $('#video');
    var $title = $('#title');
    var $credits = $('#credits');
    var $cue_nav = $('#cue-nav');
    var $next = $('#next-btn');
    var $back = $('#back-btn');
    var $audio_nav = $('#audio-navbar');
    var $audio_branding = $audio_nav.find('.branding');
    var $audio = $('#audio');
    var $progress = $audio.find('.jp-play-bar');
    var $player = $('#pop-audio');
    var $play_button = $('.jp-play');
    var $pause_button = $('.jp-pause');
    var $cue_list = $('#list-nav');
    var $cue_list_end = $('#list-nav-end');
    var $cue_browse_btn = $('#browse-btn');
    var $current_time = $('.jp-current-time');

    resize_app();

    if (!video_supported) {
        $video.hide();
    }

    cue_list_toggle('close');

    if (video_supported) {
        /*
         * Load video player
         */
        pop = Popcorn.youtube('#video', APP_CONFIG['VIDEO'][window.PAGE_NAME]['URL']);

        pop.on('pause', function() {
            $play_button.show();
            $pause_button.hide();
        });

        pop.on('playing', function() {
            $pause_button.show();
            $play_button.hide();
        });
        pop.on('timeupdate', function() {
            var s = parseInt(pop.currentTime() % 60);
            if (s < 10) {
                s = '0' + s;
            }
            var m = parseInt((pop.currentTime() / 60) % 60);
            $current_time.text(m + ':' + s);

            $progress.width(Math.floor((pop.currentTime() / video_length) * 100) + '%');
        });
    }

    function play_video(cue) {
        $title.hide();
        $credits.hide();

        if (pop.readyState < 2) {
            pop.on('canplay', function() {
                pop.play(cue);
            });
        } else {
            pop.play(cue);
        }
    }

    function pause_video(cue) {
        $title.hide();
        $credits.hide();

        if (pop.readyState < 2) {
            pop.on('canplay', function() {
                pop.pause(cue);
            });
        } else {
            pop.pause(cue);
        }
    }

    function set_active_cue(id) {
        cue_list_toggle('close');

        if (id === 0) {
            $credits.hide();
            $title.show();
        } else if (id === num_cues - 1) {
            $title.hide();
            $credits.show();
        } else {
            $title.hide();
            $credits.hide();
        }

        $cue_nav.find('li').removeClass('active');
        $cue_nav.find('#cue-nav' + id).addClass('active');

        active_cue = id;

        return false;
    }

    function goto_cue(id) {
    	/*
    	 * Determine whether to shift to the next cue
    	 * with video, or without video.
    	 */
        if (!video_supported) {
            set_active_cue(id);
        } else if (pop.paused() || cue_data[id] === undefined) {
            if (cue_data[id] != undefined) {
                pause_video(cue_data[id]['cue_start']);
            } else if (id == 0) {
                pause_video(0);
			} else if (id == (num_cues - 1)) {
                pause_video(video_length);
			}

            set_active_cue(id);
        } else {
            play_video(cue_data[id]['cue_start']);
        }

        return false;
    }

    function cue_list_toggle(mode) {
        /*
         * Toggle visibility of the cue browser.
         */
        if (cue_list_open || mode == 'close') {
            $cue_list.hide();
            $cue_browse_btn.removeClass('active');
            cue_list_open = false;
        } else if (!cue_list_open || mode == 'open') {
            $cue_list.show();
            $cue_browse_btn.addClass('active');
            cue_list_open = true;
        }
    }

    function load_cue_data() {
        /*
         * Load cue data from external JSON
         */
        var audio_output = '';
        var browse_output = '';
        var endlist_output = '';

        $.getJSON('live-data/' + window.PAGE_NAME + '.json', function(data) {
            // Title card (cue 0) has no cue data
            cue_data.push(undefined);

            $.each(data, function(i, v) {
                cue_data.push(v);
                // Markup for this cue in the cue nav
                // via Underscore template / JST
                var context = v;
                context['id'] = i + 1;

                context['position'] = (v["cue_start"] / video_length) * 100;
                audio_output += JST.cuenav(context);
                browse_output += JST.browse(context);
                endlist_output += JST.endlist(context);

                if (video_supported) {
                    pop.code({
                        start: v["cue_start"],
                        onStart: function( options ) {
                            set_active_cue(i + 1);

                            return false;
                        }
                    });
                }

                num_cues++;
            });

            $cue_nav.append(audio_output);

            // Title cue and closing cue
            num_cues += 2;

            var end_id = num_cues - 1;
            var end_cue = video_length - 1;

            cue_data.push({
                id: end_id,
                cue_start: end_cue
            });

            if (video_supported) {
                // Popcorn cuepoint for opening cue
                pop.code({
                    start: 0,
                    onStart: function(options) {
                        set_active_cue(0);
                        $credits.hide();
                        $title.show();

                        return false;
                    }
                });

                // Popcorn cuepoint for closing cue
                pop.code({
                    start: end_cue,
                    onStart: function(options) {
                        set_active_cue(end_id);

                        $title.hide();
                        $credits.show();

                        return false;
                    }
                });
            }

            // Setup navigation
            $cue_nav.find('.cue-nav-item').click( function() {
                var id = parseInt($(this).attr('data-id'));
                goto_cue(id);
            });

            $cue_nav.find('.cue-nav-item').hover(function() {
                var id = parseInt($(this).attr('data-id'));

                $cue_list.find('a[data-id="' + id + '"]').addClass('active');
            }, function() {
                var id = parseInt($(this).attr('data-id'));
                $cue_list.find('a[data-id="' + id + '"]').removeClass('active');
            });

            // Setup cue browser
            $cue_list.append(browse_output);

            $cue_list.append(JST.browse({
                'id': end_id,
                'movie_name': 'Index & Credits',
                'img_filename': ''
            }));

            $cue_list.find('a').click(function() {
                var id = parseInt($(this).attr('data-id'));

                goto_cue(id);
                cue_list_toggle('close');
            });

            $cue_list.find('a').hover(function() {
                var id = parseInt($(this).attr('data-id'));
                $cue_nav.find('.cue-nav-item[data-id="' + id + '"]').addClass('active');
            }, function() {
                var id = parseInt($(this).attr('data-id'));
                $cue_nav.find('.cue-nav-item[data-id="' + id + '"]').removeClass('active');
            });

            // Setup final cue
            $cue_list_end.append(endlist_output);
            
            $cue_list_end.find('a.cuelink').click(function() {
                var id = parseInt($(this).attr('data-id'));
                goto_cue(id);
            });

            $cue_list_end.find('a.toggle-links').click(function() {
                var $content_links = $(this).parent().find('.content-links')
                
                if ($content_links.is(':visible')) {
                    $content_links.hide();
                    $(this).text('Show links');
                } else {
                    $content_links.show();
                    $(this).text('Hide links');
                }
            });
        });
    }

    function resize_app() {
        /*
         * Resize based on screen width
         */
        var new_width = $main_content.width();
        var new_height = $(window).height() - ($audio.height() + $('#footer').height());
        var height_43 = Math.ceil(($main_content.width() * 3) / 4);

        if (new_width <= 480) {
            new_height = 600;
        } else if (new_height > height_43) {
            // image ratio can go no larger than 4:3
            new_height = height_43;
        }

        // NB: the "2" accounts for a peculiar gap between content and footer in Chrome
        $title.width(new_width + 'px').height(new_height + 2 + 'px');
        $credits.width(new_width + 'px').height(new_height + 2 + 'px');
        $video.width(new_width + 'px').height(new_height + 'px');

        if (new_width <= 767) {
            $('#next-btn').html('&gt;');
            $('#back-btn').html('&lt;');
        } else {
            $('#next-btn').html('Next&nbsp;&gt;');
            $('#back-btn').html('&lt;&nbsp;Back');
        }

        // reset navbar position
        var navpos = $audio_nav.position;
        $cue_list.css('top', navpos.top + $audio_nav.height());
    }

    $(window).resize(resize_app);

    /*
     * Click actions
     */
    $('#title-button').click(function() {
        if (video_supported) {
            $play_button.click();
        } else {
            goto_cue(1);
        }
    });

    $play_button.click(function() {
        play_video()
        $(this).hide();
        $pause_button.show();
    });

    $pause_button.click(function() {
        pop.pause();
        $(this).hide();
        $play_button.show();
    });

    $audio_branding.click(function() {
        if (video_supported) {
            pause_video(0);
        }

        goto_cue(0);
    });

    $cue_browse_btn.on('click', function(e){
        cue_list_toggle();
    });

    $cue_nav.on('mouseenter', function(e){
        cue_list_toggle('open');
    });

    $cue_list.on('mouseleave', function(e){
        cue_list_toggle('close');
    });

    $next.click(function() {
        if (active_cue < (num_cues-1)) {
            var id = active_cue + 1;

            goto_cue(id);
        }
        return false;
    });

    $back.click(function() {
        if (active_cue > 0) {
            var id = active_cue - 1;

            goto_cue(id);
        }
        return false;
    });

    $(document).keydown(function(ev) {
        if (ev.which == 37) {
            $back.click();

            return false;
        } else if (ev.which == 39) {
            $next.click();

            return false;
        } else if (ev.which == 32 && video_supported) {
            if (pop.paused()) {
                play_video();
            } else {
                pause_video();
            }

            return false;
        }

        return true;
    });

    /*
     * INIT
     */
    load_cue_data();
});

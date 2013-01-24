$(document).ready(function() {
	/* VARS */
	var active_slide = 0;
	var audio_length = 337; // TODO: Pass in dynamically somehow?
	var num_slides = 0;
	var slideshow_data = [];
	var pop; // Popcorn element
    var audio_supported = !($.browser.msie === true && $.browser.version < 9);
    var slide_list_open = false;

	/* ELEMENTS */
    var $main_content = $('#main-content');
	var $s = $('#slideshow');
	var $slide_wrap = $('#slideshow-wrap');
	var $slide_nav = $('#slide-nav');
	var $next = $('#next-btn');
	var $back = $('#back-btn');
    var $audio_nav = $('#audio-navbar');
	var $audio_branding = $audio_nav.find('.branding');
    var $audio = $('#audio');
	var $progress = $audio.find('.jp-progress-container');
	var $player = $('#pop-audio');
	var $slide_list = $('#list-nav');
	var $slide_list_end = $('#list-nav-end');
	var $slide_browse_btn = $('#browse-btn');
	var $titlecard = $('#panel0');
	var $panels;
	var $panel_images;

    if (!audio_supported) {
        $audio.hide(); 
    }
    
    slide_list_toggle('close');
    
    if (audio_supported) {
        /* 
         * Load audio player
         */
        $player.jPlayer({
            ready: function () {
                $(this).jPlayer('setMedia', {
                    mp3: "http://apps.npr.org/music-memoriam-2012/audio/artists2012.mp3",
                    oga: "http://apps.npr.org/music-memoriam-2012/audio/artists2012.ogg"
                }).jPlayer("pause");
            },
            play: function() { // To avoid both jPlayers playing together.
                $(this).jPlayer("pauseOthers");
            },
            ended: function (event) {
                $(this).jPlayer("pause");
            },
            swfPath: "js",
            supplied: "oga, mp3"
    //		,errorAlerts:true
        });
        // associate jPlayer with Popcorn
        pop = Popcorn('#jp_audio_0');
    }

    function ap_date(mmnt) {
        /*
         * Hacky AP date-formatter for moment().
         */
        var out = mmnt.format('MMM');

        if (mmnt.month() == 4) {
            // May
        } else if (mmnt.month() == 5) {
            out = 'June';
        } else if (mmnt.month() == 6) {
            out = 'July';
        } else if (mmnt.month() == 8) {
            out = 'Sept.';
        } else {
            out += '.';
        }

        out += ' ' + mmnt.format('D, YYYY');

        return out;
    }

    function goto_slide(id) {
    	/*
    	 * Determine whether to shift to the next slide
    	 * with audio, or without audio.
    	 */
    	console.log('goto_slide(' + id + ')');
    	active_slide = Number(id);
        if (!audio_supported || $player.data().jPlayer.status.paused || slideshow_data[id] == undefined) {
            scroll_to_slide(id);
            if (slideshow_data[id] != undefined) {
//            	console.log('advance cue to ' + slideshow_data[id]['cue_start']);
				$player.jPlayer('pause', slideshow_data[id]['cue_start']);
			} else if (id == (num_slides - 1)) {
//            	console.log('advance cue to ' + audio_length);
				$player.jPlayer('pause', audio_length);
			}
        } else {
            play_slide(id);
        }
		
        return false; 
    }

    function scroll_to_slide(id) {
        /*
         * Scroll horizontally to the correct slide position.
         */
		console.log('scroll_to_slide(' + id + ')');
        slide_list_toggle('close');

        $.smoothScroll({
            direction: 'left',
            scrollElement: $s,
            scrollTarget: '#panel' + id,
            afterScroll: function() {
                $slide_nav.find('li').removeClass('active');
                $slide_nav.find('#s' + id).addClass('active');
            }
        });
        active_slide = id;

        return false;
    }

    function play_slide(id) {
        /*
         * Play a slide at the correct audio cue.
         */
//    	console.log('play_slide(' + id + ')');
        if (audio_supported) {
            $player.jPlayer('play', slideshow_data[id]['cue_start']);
        } else {
            scroll_to_slide(id);
        }
    }

	function load_slideshow_data() {
        /* 
         * Load slideshow data from external JSON
         */
		var slide_output = '';
		var audio_output = '';
        var browse_output = '';
        var endlist_output = '';

		$.getJSON('deaths.json', function(data) {
			slideshow_data.push(undefined);
			$.each(data, function(k, v) {
				slideshow_data.push(v);
			
				var slide_position = (v["cue_start"] / audio_length) * 100;

				// Markup for this slide and its entry in the slide nav
				// via Underscore template / JST
                var context = v;
                context['id'] = k + 1;

                if ($main_content.width() <= 480) {
                    context['image_width'] = 480;
                } else if ($main_content.width() <= 979) {
                    context['image_width'] = 979;
                } else {
                    context['image_width'] = 1200;
                }

                context['position'] = slide_position;

                if (v['dob'] != '') {
                    context['dob'] = ap_date(moment(v['dob'], 'MM DD YYYY'));
                    context['dod'] = ap_date(moment(v['dod'], 'MM DD YYYY'));
                }
                
                slide_output += JST.slide(context);
				audio_output += JST.slidenav(context);
				browse_output += JST.browse(context);
				endlist_output += JST.endlist(context);

				num_slides++;
				
                if (audio_supported) {
                	var cue_start = v["cue_start"];
                	if (k == 0) {
                		cue_start += 1;
                	}
                    // Popcorn cuepoint for this slide
                    pop.code({
                        start: cue_start,
                        end: cue_start + .5,
                        onStart: function( options ) {         
                            scroll_to_slide(k+1); 
                            return false;
                        },
                        onEnd: function( options ) {}
                    });
                }
			});
			
			$titlecard.after(slide_output);
			$('#send').before(audio_output);
			
			num_slides += 2; // because we have both a title slide and a closing slide
			// rename the closing slides with the correct ID numbers
			var end_id = num_slides-1;
			var end_cue = audio_length - 30;
			$('#send').attr('id','s' + end_id);
			$('#s' + end_id).attr('data-id', end_id);
			$('#s' + end_id).css('left',((end_cue / audio_length) * 100) + '%');
			$('#panelend').attr('id','panel' + end_id);
			slideshow_data.push({
				id: end_id,
				cue_start: end_cue
			});

			if (audio_supported) {
				// Popcorn cuepoint for opening slide
				pop.code({
					start: 0,
					end: .5,
					onStart: function( options ) {         
						scroll_to_slide(0); 
						return false;
					},
					onEnd: function( options ) { }
				});
				// Popcorn cuepoint for closing slide
				pop.code({
					start: end_cue,
					end: end_cue + .5,
					onStart: function( options ) {         
						scroll_to_slide(end_id); 
						return false;
					},
					onEnd: function( options ) { }
				});
			}

			$slide_nav.find('.slide-nav-item').click( function() {
				var id = parseInt($(this).attr('data-id'));
                goto_slide(id);
			});
	
            $slide_nav.find('.slide-nav-item').hover(function() {
				var id = parseInt($(this).attr('data-id'));
                $slide_list.find('a[data-id="' + id + '"]').addClass('active');
            }, function() {
				var id = parseInt($(this).attr('data-id'));
                $slide_list.find('a[data-id="' + id + '"]').removeClass('active');
            });

			$slide_list.append(browse_output);

			$slide_list.append(JST.browse({
                'id': num_slides - 1,
                'image_name': null,
                'artist_first_name': '',
                'artist_last_name': 'Index & Credits'
            }));

            $slide_list.find('a').click(function() {
				var id = parseInt($(this).attr('data-id'));
                goto_slide(id);
                slide_list_toggle('close');
            });

            $slide_list.find('a').hover(function() {
				var id = parseInt($(this).attr('data-id'));
                $slide_nav.find('.slide-nav-item[data-id="' + id + '"]').addClass('active');
            }, function() {
				var id = parseInt($(this).attr('data-id'));
                $slide_nav.find('.slide-nav-item[data-id="' + id + '"]').removeClass('active');
            });

			$slide_list_end.append(endlist_output);
            $slide_list_end.find('a.slidelink').click(function() {
				var id = parseInt($(this).attr('data-id'));
                goto_slide(id);
            });

            $panels = $slide_wrap.find('.panel');
            $panel_images = $panels.find('.panel-bg');

            resize_slideshow();
		});
	}
	
	function resize_slideshow() {
        /* 
         * Resize slideshow panels based on screen width
         */
		var new_width = $main_content.width();
		var new_height = $(window).height() - $audio.height();
		var height_43 = Math.ceil(($main_content.width() * 3) / 4);

		if (new_width <= 480) {
			new_height = 600;
		} else if (new_height > height_43) { 
			// image ratio can go no larger than 4:3
			new_height = height_43;
		}

		$s.width(new_width + 'px').height(new_height + 'px');
		$slide_wrap.width((num_slides * new_width) + 'px').height(new_height + 'px');
		$panels.width(new_width + 'px').height(new_height + 'px');
		$titlecard.height(new_height + 'px');

		if (new_width <= 480) {
			$panel_images.height((Math.ceil(new_width * 9) / 16) + 'px');
		} else {
			$panel_images.height('100%');
		}

        if (new_width <= 767) {
            $('#next-btn').html('&gt;');
            $('#back-btn').html('&lt;');
        } else {
            $('#next-btn').html('Next&nbsp;&gt;');
            $('#back-btn').html('&lt;&nbsp;Back');
        }
		
		// reset navbar position
		var navpos = $audio_nav.position;
		$slide_list.css('top',navpos.top + $audio_nav.height());
		
		// reset slide position
		scroll_to_slide(active_slide);
	}
	$(window).resize(resize_slideshow);


	/* 
	 * Click actions
	 */
	$('#title-button').click(function() {
		play_slide(1);
	});
	
	$audio_branding.click(function() {
		if (audio_supported) {
            $player.jPlayer('stop');
        }
		goto_slide(0);
	});

	function slide_list_toggle(mode) {
		if (slide_list_open || mode == 'close') {
			$slide_list.hide();
			$slide_browse_btn.removeClass('active');
			slide_list_open = false;
		} else if (!slide_list_open || mode == 'open') {
			$slide_list.show();
			$slide_browse_btn.addClass('active');
			slide_list_open = true;
		}
	}
	$slide_browse_btn.on('click', function(e){
		slide_list_toggle();
	});
	$slide_nav.on('mouseenter', function(e){
		slide_list_toggle('open');
	});
	$slide_list.on('mouseleave', function(e){
		slide_list_toggle('close');
	});
	
	function goto_next_slide() {
		if (active_slide < (num_slides-1)) {
            var id = active_slide + 1;
            goto_slide(id);
		}
		return false;
	}
    $next.click(goto_next_slide);

	function goto_previous_slide() {
		if (active_slide > 0) {
            var id = active_slide - 1;
            goto_slide(id);
		}
		return false;
	}
	$back.click(goto_previous_slide);

    $(document).keydown(function(ev) {
        if (ev.which == 37) {
            goto_previous_slide();
        } else if (ev.which == 39) {
            goto_next_slide();
        } else if (ev.which == 32 && audio_supported) {
            if ($player.data().jPlayer.status.paused) {
                $player.jPlayer('play');
            } else {
                $player.jPlayer('pause');
            }
        }
        return false;
    });


	/* 
	 * INIT
	 */
	load_slideshow_data();

});

$(document).ready(function(){
	var $awards_list = $('.awards-list');
	var winner_interval_refresh = 60000;

	function load_oscar_winners() {
		var cachebust = new Date().getTime();
		template_html = '<h3>Awards List</h3>';
		$.ajax('live-data/awards.json?t=' + cachebust, {
			dataType: 'json',
			cache: false,
			crossDomain: false,
			jsonp: false,
			success: function(data){
				$awards_list.html(JST.awards(data));
			}
		}).then(function() {
	        setTimeout(load_oscar_winners, winner_interval_refresh);
        });
	}

    $awards_list.on('click', '.category', function() {
        $(this).toggleClass('closed');
    });

	load_oscar_winners();
});

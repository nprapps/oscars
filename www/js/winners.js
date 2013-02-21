$(document).ready(function(){
	var $awards_list = $('.awards-list');
	var template_html = '';
	var winner_interval;
	var winner_interval_refresh = 60000;
	
	function load_oscar_winners() {
		console.log('load_oscar_winners');
		template_html = '<h3>Awards List</h3>';
		$.ajax('live-data/awards.json', {
			dataType: 'json',
			cache: false,
			crossDomain: false,
			jsonp: false,
			success: function(data){
				_.each(data, function(category) {
					template_html += JST.awards({category: category});
				});
				$awards_list.html(template_html);
				$awards_list.find('div').on('click', function() {
					$(this).toggleClass('closed');
				}).addClass('closed');
			}
		});
	}
	load_oscar_winners();
	winner_interval = setInterval(load_oscar_winners, winner_interval_refresh);
});

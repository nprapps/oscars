$(document).ready(function(){
	var $awards_list = $('.awards-list');
	var template_html = '<h3>Awards List</h3>';

    $.ajax('../live-data/awards.json', {
        dataType: 'json',
        cache: false,
        crossDomain: false,
        jsonp: false,
        success: function(data){
            _.each(data, function(category) {
                template_html += JST.awards({category: category});
                console.log(template_html);
            });
            $awards_list.html(template_html);
            $awards_list.find('div').on('click', function() {
            	$(this).toggleClass('closed');
            }).addClass('closed');
        }
    });
});

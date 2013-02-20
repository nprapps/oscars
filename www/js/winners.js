$(document).ready(function(){
    template_html = '<h3>Awards List</h3>';
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
            $('.awards-list').html(template_html);
        }
    });
});

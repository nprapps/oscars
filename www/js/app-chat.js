$(function() {
    // Constants for the live chat/widget
    // Caching some DOM objects
    var $live_blog = $('#live-blog');
    // var $chat = $('#live-chat');
    var $live_blog_tab = $('#blog-toggle');
    var $chat_tab = $('#chat-toggle');
    var $widget = $('#live-chat-widget');
    var $chat_login = $('.chat-login');

    var livechat = null;
    var liveblog = null;
    var livechatwidget = null;

    $live_blog.livechat({
        chat_id: APP_CONFIG['CHAT']['ID'],
        chat_token: APP_CONFIG['CHAT']['TOKEN'],
        update_interval: APP_CONFIG['CHAT']['UPDATE_INTERVAL'],
        filter_user_id: APP_CONFIG['CHAT']['FILTER_USER_ID'],
        is_filtered: true,
        alert_interval: 500,
        read_only: false
    });

    livechat = $live_blog.data('livechat');

    $live_blog_tab.on('click', function() {
        $live_blog.show();
        $widget.show();
        $chat_login.hide();

        $(this).addClass('selected');
        $chat_tab.removeClass('selected');

        livechat.toggle_filtering(true);

        // if (livechatwidget) {
        //     livechatwidget.pause(false);
        // } else {
        //     $widget.livechatwidget({
        //         chat_id: APP_CONFIG['CHAT']['ID'],
        //         chat_token: APP_CONFIG['CHAT']['TOKEN'],
        //         update_interval: APP_CONFIG['CHAT']['UPDATE_INTERVAL'],
        //         max_text_length: 200
        //     });

        //     livechatwidget = $widget.data('livechatwidget');
        // }

        //cheap hack to get the feed to show when you loaded the chat first, see #283
        $(window).trigger('resize');
        window.location.hash = '';
    });

    $chat_tab.on('click', function() {
        // $chat.show();
        $widget.hide();
        $chat_login.show();

        $(this).addClass('selected');
        $live_blog_tab.removeClass('selected');

        livechat.toggle_filtering(false);

        // if (livechatwidget) {
        //     livechatwidget.pause(true);
        // }

        window.location.hash = '#chat';
    });

    if (window.location.hash == '#chat') {
        $chat_tab.trigger('click');
    } else {
        $live_blog_tab.trigger('click');
    }
});

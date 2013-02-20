$(function() {
    // Constants for the live chat/widget
    // Caching some DOM objects
    var $live_blog = $('#live-blog');
    // var $chat = $('#live-chat');
    var $live_blog_tab = $('#live-blog-toggle');
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
        alert_interval: 500,
        read_only: false
    });

    $live_blog_tab.on('click', function() {
        $live_blog.show();
        $widget.show();
        $chat_login.hide();

        $(this).addClass('selected');
        $chat_tab.removeClass('selected');

        if (livechat) {
            livechat.pause(true);
        }

        if (livechatwidget) {
            livechatwidget.pause(false);
        } else {
            $widget.livechatwidget({
                chat_id: CHAT_ID,
                chat_token: CHAT_TOKEN,
                update_interval: CHAT_UPDATE_INTERVAL,
                max_text_length: 200
            });

            livechatwidget = $widget.data('livechatwidget');
        }

        //cheap hack to get the feed to show when you loaded the chat first, see #283
        $(window).trigger('resize');
        window.location.hash = '';
    });

    $chat_tab.on('click', function() {
        // $chat.show();
        $widget.hide();
        $live_blog.hide();
        $chat_login.show();

        $(this).addClass('selected');
        $live_blog_tab.removeClass('selected');

        if (livechatwidget) {
            livechatwidget.pause(true);
        }

        if (livechat) {
            livechat.pause(false);
        } else {
            $live.livechat({
                chat_id: CHAT_ID,
                chat_token: CHAT_TOKEN,
                update_interval: CHAT_UPDATE_INTERVAL,
                alert_interval: 500,
                read_only: false
            });

            livechat = $live.data('livechat');
        }

        window.location.hash = '#chat';
    });
    if (window.location.hash == '#chat') {
        $live_tab.trigger('click');
    } else {
        $mrpres_tab.trigger('click');
    }
});

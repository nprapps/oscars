$(function() {
    // Constants for the live chat/widget
    // Caching some DOM objects
    var $live_blog = $('#live-blog');
    // var $chat = $('#live-chat');
    var $live_blog_tab = $('#blog-toggle');
    var $chat_tab = $('#chat-toggle');
    var $awards_tab = $('#awards-toggle');
    var $widget = $('#live-chat-widget');
    var $chat_login = $('.chat-login');
    var $chat_editor = $('.chat-editor');
    var $chat_body = $('.chat-body-wrap');
    var $awards_body = $('.chat-schedule-wrap');

    var livechat = null;
    var liveblog = null;
    var livechatwidget = null;

    $live_blog.livechat({
        chat_id: APP_CONFIG['CHAT']['ID'],
        chat_token: APP_CONFIG['CHAT']['TOKEN'],
        update_interval: APP_CONFIG['CHAT']['UPDATE_INTERVAL'],
        filter_user_ids: APP_CONFIG['CHAT']['FILTER_USER_IDS'],
        is_filtered: true,
        alert_interval: 500,
        read_only: false
    });

    livechat = $live_blog.data('livechat');

    $live_blog_tab.on('click', function() {
        $chat_body.show();
        $widget.show();
        $chat_login.hide();
        $chat_editor.hide();

        if ($(window).width() <= 767) {
            $awards_body.hide();
        }

        else {
            $awards_body.show();
        }

        $(this).addClass('selected');
        $chat_tab.removeClass('selected');
        $awards_tab.removeClass('selected');

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
        $chat_body.show();
        $chat_editor.show();
        $widget.hide();
        $chat_login.show();

        if ($(window).width() <= 767) {
            $awards_body.hide();
        }

        else {
            $awards_body.show();
        }

        $(this).addClass('selected');
        $live_blog_tab.removeClass('selected');
        $awards_tab.removeClass('selected');

        livechat.toggle_filtering(false);

        // if (livechatwidget) {
        //     livechatwidget.pause(true);
        // }

        window.location.hash = '#chat';
    });

    $awards_tab.on('click', function() {
        $chat_editor.hide();
        $widget.hide();
        $chat_login.hide();
        $chat_body.hide();
        $awards_body.show();
        $('.chat-schedule-wrap').show();

        $(this).addClass('selected');
        $live_blog_tab.removeClass('selected');
        $chat_tab.removeClass('selected');

        livechat.toggle_filtering(false);

        // if (livechatwidget) {
        //     livechatwidget.pause(true);
        // }

        window.location.hash = '#awards';
    });

    if (window.location.hash == '#chat') {
        $chat_tab.trigger('click');
    }

    else if (window.location.hash == '#awards') {
        if ($(window).size <= 767) {
            $awards_tab.trigger('click');
        }

        else {
            $chat_tab.trigger('click');
        }
    }

    else {
        $live_blog_tab.trigger('click');
    }

    $(window).resize(function () {
        if ((window.location.hash == '#awards') && ($(window).width() > 767)) {
            $chat_tab.trigger('click');
        }
    });
});

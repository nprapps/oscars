#!/usr/bin/env python

"""
Project-wide application configuration.

DO NOT STORE SECRETS, PASSWORDS, ETC. IN THIS FILE.
They will be exposed to users. Use environment variables instead.
"""

import os

CODE_ROOT_NAME = 'oscars'
PROJECT_NAME = 'Everything You Need To Know About The Best Picture Nominees'
DEPLOYED_NAME = 'oscars-2013'

PRODUCTION_S3_BUCKETS = ['apps.npr.org', 'apps2.npr.org']
PRODUCTION_SERVERS = ['cron.nprapps.org']

STAGING_S3_BUCKETS = ['stage-apps.npr.org']
STAGING_SERVERS = ['cron-staging.nprapps.org']

S3_BUCKETS = []
SERVERS = []
DEBUG = True

# doesn't make sense with more than one url in an app, namespacing it cuz goddamnitall

VIDEO_SHARE_URL = 'http://%s/%s/best-picture.html' % (PRODUCTION_S3_BUCKETS[0], DEPLOYED_NAME)

VIDEO_TWITTER = {
    'TEXT': "Everything you need to know about the Best Picture nominees, from across the NPR network. #oscars",
    'URL': VIDEO_SHARE_URL
}

VIDEO_FACEBOOK = {
    'TITLE': "Everything You Need To Know About The Best Picture Nominees",
    'URL': VIDEO_SHARE_URL,
    'DESCRIPTION': "Ready to check off your Oscar ballot? Catch up on this year's nominees with reviews, interviews and features from across the NPR network.",
    'IMAGE_URL': 'http://%s/%s/img/cheat-sheet-promo_square.jpg' % (PRODUCTION_S3_BUCKETS[0], DEPLOYED_NAME),
    'APP_ID': '138837436154588'
}

CHAT_PROJECT_DESCRIPTION = "Come to NPR's house to watch the awards with NPR's Linda Holmes and friends."
CHAT_SHARE_URL = 'http://%s/%s/' % (PRODUCTION_S3_BUCKETS[0], DEPLOYED_NAME)

CHAT_TWITTER = {
    'TEXT': "Come to NPR's house for an Oscar Party! Watch the awards with @nprmonkeysee and friends. #oscars",
    'URL': CHAT_SHARE_URL
}

CHAT_FACEBOOK = {
    'TITLE': 'Oscar Party!',
    'URL': CHAT_SHARE_URL,
    'DESCRIPTION': CHAT_PROJECT_DESCRIPTION,
    'IMAGE_URL': 'http://media.npr.org/assets/img/2013/02/22/ap100306122316_sq-6aaf3b3754e09b8dcd0bd3151830019bba911834-s3.jpg',
    'APP_ID': '138837436154588'
}

NPR_DFP = {
    'STORY_ID': '172412715',
    'TARGET': '\/arts_oscars_2013;storyid=172412715'
}

CHAT = {
    'ID': '74796',
    'TOKEN': 'FtP7wRfX',
    'UPDATE_INTERVAL': 1000,
    'FILTER_USER_IDS': [23219872]
}

GOOGLE_ANALYTICS_ID = 'UA-5828686-4'

VIDEO = {
    'best-picture': {
        'LENGTH': 216,
        'POSTER': 'http://apps.npr.org/oscars-2013/img/cheat-sheet-promo_wide.jpg',
        'MP4_URL': 'http://pd.npr.org/npr-mp4/npr/nprvid/2013/02/20130219_nprvid_oscars-n-600000.mp4',
        'HD_URL': 'http://pd.npr.org/npr-mp4/npr/nprvid/2013/02/20130219_nprvid_oscars-n-1200000.mp4'
    }
}

def configure_targets(deployment_target):
    """
    Configure deployment targets. Abstracted so this can be
    overriden for rendering before deployment.
    """
    global S3_BUCKETS
    global SERVERS
    global DEBUG
    global AUDIO
    global CHAT

    if deployment_target == 'production':
        S3_BUCKETS = PRODUCTION_S3_BUCKETS
        SERVERS = PRODUCTION_SERVERS
        DEBUG = False

        CHAT['ID'] = '85189'
        # Linda Holmes, Stephen Thompson, Trey Graham, Marc Hirsh
        CHAT['FILTER_USER_IDS'] = [1994734, 4724185, 2311045, 2018793]

    else:
        S3_BUCKETS = STAGING_S3_BUCKETS
        SERVERS = STAGING_SERVERS
        DEBUG = True

        CHAT['ID'] = '85189'
        CHAT['FILTER_USER_IDS'] = [23219872]

DEPLOYMENT_TARGET = os.environ.get('DEPLOYMENT_TARGET', None)

configure_targets(DEPLOYMENT_TARGET)

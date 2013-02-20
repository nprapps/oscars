#!/usr/bin/env python

"""
Project-wide application configuration.

DO NOT STORE SECRETS, PASSWORDS, ETC. IN THIS FILE.
They will be exposed to users. Use environment variables instead.
"""

import os

PROJECT_NAME = 'Oscars 2013: Best Picture Cheat Sheet'
DEPLOYED_NAME = 'oscars-2013'

PRODUCTION_S3_BUCKETS = ['apps.npr.org', 'apps2.npr.org']
PRODUCTION_SERVERS = ['cron.nprapps.org']

STAGING_S3_BUCKETS = ['stage-apps.npr.org']
STAGING_SERVERS = ['cron-staging.nprapps.org']

S3_BUCKETS = []
SERVERS = []
DEBUG = True

# doesn't make sense with more than one url in an app, namespacing it cuz goddamnitall

VIDEO_PROJECT_DESCRIPTION = "Ready to check off your Oscar ballot? Catch up on coverage of this year's Best Picture nominees with reviews, interviews and features from across the NPR network."
VIDEO_SHARE_URL = 'http://%s/%s/best-picture.html' % (PRODUCTION_S3_BUCKETS[0], DEPLOYED_NAME)

VIDEO_TWITTER = {
    'TEXT': "Ready to check off your Oscar ballot? Catch up on NPR's coverage of the Best Picture nominees. #oscars",
    'URL': VIDEO_SHARE_URL
}

VIDEO_FACEBOOK = {
    'TITLE': "Oscars 2013: Best Picture Cheat Sheet",
    'URL': VIDEO_SHARE_URL,
    'DESCRIPTION': VIDEO_PROJECT_DESCRIPTION,
    'IMAGE_URL': 'http://%s/%s/img/cheat-sheet-promo_sq.jpg' % (PRODUCTION_S3_BUCKETS[0], DEPLOYED_NAME),
    'APP_ID': '138837436154588'
}

CHAT_PROJECT_DESCRIPTION = "Ready to check off your Oscar ballot? Catch up on coverage of this year's Best Picture nominees with reviews, interviews and features from across the NPR network."
CHAT_SHARE_URL = 'http://%s/%s/' % (PRODUCTION_S3_BUCKETS[0], DEPLOYED_NAME)

CHAT_TWITTER = {
    'TEXT': "Ready to check off your Oscar ballot? Catch up on NPR's coverage of the Best Picture nominees. #oscars",
    'URL': CHAT_SHARE_URL
}

CHAT_FACEBOOK = {
    'TITLE': PROJECT_NAME,
    'URL': CHAT_SHARE_URL,
    'DESCRIPTION': CHAT_PROJECT_DESCRIPTION,
    'IMAGE_URL': '',
    'APP_ID': '138837436154588'
}

NPR_DFP = {
    'STORY_ID': '172412715',
    'TARGET': '\/arts_oscars_2013;storyid=172412715'
}

CHAT = {
    'ID': '74796',
    'TOKEN': 'FtP7wRfX',
    'UPDATE_INTERVAL': 5000
}

GOOGLE_ANALYTICS_ID = 'UA-5828686-4'

VIDEO = {
    'best-picture': {
        'LENGTH': 216,
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

        CHAT['ID'] = '74796'
    else:
        S3_BUCKETS = STAGING_S3_BUCKETS
        SERVERS = STAGING_SERVERS
        DEBUG = True

        CHAT['ID'] = '74796'

DEPLOYMENT_TARGET = os.environ.get('DEPLOYMENT_TARGET', None)

configure_targets(DEPLOYMENT_TARGET)

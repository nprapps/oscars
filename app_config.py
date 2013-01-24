#!/usr/bin/env python

"""
Project-wide application configuration.

DO NOT STORE SECRETS, PASSWORDS, ETC. IN THIS FILE.
They will be exposed to users. Use environment variables instead.
"""

import os

PROJECT_NAME = 'oscars'
DEPLOYED_NAME = PROJECT_NAME 

PRODUCTION_S3_BUCKETS = ['apps.npr.org', 'apps2.npr.org']
PRODUCTION_SERVERS = ['cron.nprapps.org']

STAGING_S3_BUCKETS = ['stage-apps.npr.org']
STAGING_SERVERS = ['cron-staging.nprapps.org']

S3_BUCKETS = []
SERVERS = []
DEBUG = True 

PROJECT_DESCRIPTION = 'foo'
SHARE_URL = 'http://%s/%s/' % (PRODUCTION_S3_BUCKETS[0], DEPLOYED_NAME)

TWITTER = {
    'TEXT': PROJECT_NAME,
    'URL': SHARE_URL
}

FACEBOOK = {
    'TITLE': DEPLOYED_NAME,
    'URL': SHARE_URL,
    'DESCRIPTION': PROJECT_DESCRIPTION,
    'IMAGE_URL': '',
    'APP_ID': '138837436154588'
}

NPR_DFP = {
    'STORY_ID': '139482413',
    'TARGET': '\/news_election_results;storyid=139482413'
}

GOOGLE_ANALYTICS_ID = 'UA-5828686-4'

AUDIO = {
    'LENGTH': 337,
    'MP3': 'http://stage-apps.npr.org/music-memoriam-2012/audio/artists2012.mp3',
    'OGG': 'http://stage-apps.npr.org/music-memoriam-2012/audio/artists2012.ogg'
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

    if deployment_target == 'production':
        S3_BUCKETS = PRODUCTION_S3_BUCKETS
        SERVERS = PRODUCTION_SERVERS
        DEBUG = False

        AUDIO['MP3'] = 'http://apps.npr.org/music-memoriam-2012/audio/artists2012.mp3'
        AUDIO['OGG'] = 'http://apps.npr.org/music-memoriam-2012/audio/artists2012.ogg'
    else:
        S3_BUCKETS = STAGING_S3_BUCKETS
        SERVERS = STAGING_SERVERS
        DEBUG = True

        AUDIO['MP3'] = 'http://stage-apps.npr.org/music-memoriam-2012/audio/artists2012.mp3'
        AUDIO['OGG'] = 'http://stage-apps.npr.org/music-memoriam-2012/audio/artists2012.ogg'
 
DEPLOYMENT_TARGET = os.environ.get('DEPLOYMENT_TARGET', None)

configure_targets(DEPLOYMENT_TARGET)

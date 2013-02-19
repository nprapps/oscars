#!/usr/bin/python
# -*- coding: UTF-8 -*-
import requests
import json
import chardet

url = 'https://spreadsheets.google.com/feeds/list/0AjWpFWKpoFHqdDZHaTExd1Rpcl9aLTFIaVhIR2RRdWc/od6/public/values?alt=json-in-script&sq='
r = requests.get(url)

awards_list = []

if r.status_code == 200:
    json_data = json.loads(r.content.replace('gdata.io.handleScriptLoaded(', '').replace(');', ''))
    for row in json_data['feed']['entry']:
        award_dict = {}
        award_dict['award'] = row['title']['$t']
        award_dict['nominees'] = []
        for nominee_number in range(1, 10):
            nominee = row['gsx$nominee%s' % nominee_number]['$t']
            if nominee != u'':
                award_dict['nominees'].append(nominee)

        awards_list.append(award_dict)

with open('www/live-data/awards.json', 'w') as f:
    f.write(json.dumps(awards_list))

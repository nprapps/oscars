#!/usr/bin/env python
# -*- coding: UTF-8 -*-
import requests
import json

url = 'https://spreadsheets.google.com/feeds/list/0AjWpFWKpoFHqdDZHaTExd1Rpcl9aLTFIaVhIR2RRdWc/od6/public/values?alt=json-in-script&sq='
r = requests.get(url)

awards_list = []

if r.status_code == 200:
    json_data = json.loads(r.content.replace('gdata.io.handleScriptLoaded(', '').replace(');', ''))
    for row in json_data['feed']['entry']:
        award_dict = {}
        award_dict['award'] = row['title']['$t']
        award_dict['nominees'] = []
        award_dict['has_winner'] = False
        for nominee_number in range(1, 10):
            nominee = row['gsx$nominee%s' % nominee_number]['$t']
            if nominee != u'':
                nominee_dict = {}
                nominee_dict['title'] = nominee
                nominee_dict['winner'] = False
                if row['gsx$winner']['$t'] == nominee:
                    nominee_dict['winner'] = True
                    award_dict['has_winner'] = True
                award_dict['nominees'].append(nominee_dict)

        awards_list.append(award_dict)

with open('www/live-data/awards.json', 'w') as f:
    f.write(json.dumps(awards_list))

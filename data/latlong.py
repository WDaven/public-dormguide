import csv
import json
#Hello, I didn't think anyone would see this
f = open('./dorms.json')
data = json.load(f)
long = []
for i in data['dorms']:
    print(i['latitude'])
    long.append(i['latitude'])

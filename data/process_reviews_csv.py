import csv
import requests
import random
from datetime import datetime

rows = []
with open('./reviews.csv', 'r', encoding="utf8") as file:
    reader = csv.reader(file)
    for line in reader:
        rows.append(line)

def score(rating):
    if 'Good' in rating:
        return 1
    if 'Bad' in rating:
        return -1
    return 0

def random_username():
    return 'yellowjacket' + str(random.randint(1000, 9999))

for i in range(1, len(rows)):
    timestamp, dorm, rating, title, text, pros, cons, duration, bus_route, gym, bike_rack, elevator, laundry, extra_features, username, link = rows[i]

    body = {
        'rating': rating,
        'reviewer': random_username() if ('reddit' in username) or (username == '') else username,
        'title': title,
        'text': text,
        'date': datetime.strptime(timestamp.split(' ')[0], '%m/%d/%Y').strftime('%Y-%m-%d'),
        'pros': {
            'gym': 'Gym' in pros,
            'lounges': 'Lounges' in pros,
            'quiet': 'Quiet' in pros,
            'safe': 'Safe' in pros,
            'lively': 'Lively' in pros
        },
        'cons': {
            'leaks': 'Shower leaks' in cons,
            'noisy': 'Noisy' in cons,
            'pests': 'Pests' in cons,
            'smell': 'Smell' in cons
        },
        'features': {
            'bike': score(bike_rack),
            'gym': score(gym),
            'bus': score(bus_route),
            'elevator': score(elevator),
            'laundry': score(laundry)
        }
    }

    # name = dorm.lower().replace(' ', '-')
    # response = requests.post('https://us-central1-mas-project-4261.cloudfunctions.net/app/dorms/' + name + '/reviews', json=body)
    # print(response.status_code)
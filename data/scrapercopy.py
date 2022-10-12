from bs4 import BeautifulSoup
import urllib3
import csv
import time


http = urllib3.PoolManager()
newImages = []
count = 0
with open('./housing_data.csv', newline='') as csvfile:
    reader = csv.reader(csvfile, delimiter=',', quotechar='|')
    for row in reader:
        time.sleep(1)
        dorm_url = "http://housing.gatech.edu/building/" + row[0]
        dorm_page = http.request('GET', dorm_url)
        dorm_soup = BeautifulSoup(dorm_page.data, 'html.parser')
        image_sources = dorm_soup \
                    .find('div', attrs={'class': 'layout__region layout__region--content'}) \
                    .findAll('img')

        images = [image['src'] for image in image_sources]
        images.pop(0)
        print(images)
        newImages.append(images)
from bs4 import BeautifulSoup
import urllib3
import csv
import time

http = urllib3.PoolManager()
page = http.request('GET', 'https://housing.gatech.edu/explore-our-residence-halls')
soup = BeautifulSoup(page.data, 'html.parser')
rows = soup.findAll('article', attrs={'typeof': 'views-col'})

housing_data = []

for row in rows:
    time.sleep(2)

    name = row.find('span', attrs={'class': 'views-field-title'}).text.strip()
    print(name)

    document_id = name.lower().replace(' ', '-')
    print(document_id)

    dorm_url = "http://housing.gatech.edu/building/" + document_id
    dorm_page = http.request('GET', dorm_url)
    dorm_soup = BeautifulSoup(dorm_page.data, 'html.parser')

    location = dorm_soup \
                    .find('div', attrs={'class': 'views-field views-field-field-location'}) \
                    .find('div', attrs={'class': 'field-content'}).text
    location = location.split()[0]
    print(location)

    address = dorm_soup \
                    .find('div', attrs={'class': 'views-field views-field-field-address'}) \
                    .find('div', attrs={'class': 'field-content'}).text
    address = address.split(',')[0]
    print(address)

    price_per_sem = dorm_soup \
                    .find('div', attrs={'class': 'views-row views-row-1 views-row-odd views-row-first'}) \
                    .find('div', attrs={'class': 'views-field views-field-field-price'}) \
                    .find('div', attrs={'class': 'field-content'}).text
    price_per_sem = int(float(price_per_sem[1:].replace(',', '')))
    print(price_per_sem)

    program = dorm_soup \
                    .find('div', attrs={'class': 'views-field views-field-field-program'}) \
                    .find('div', attrs={'class': 'field-content'}).text
    program = program.split(', ')
    print(program)

    capacity = dorm_soup \
                    .find('div', attrs={'class': 'views-field views-field-field-capacity'}) \
                    .find('div', attrs={'class': 'field-content'}).text
    capacity = [int(count) for count in capacity.split(', ')]
    print(capacity)

    style = dorm_soup \
                    .find('div', attrs={'class': 'views-field views-field-field-style'}) \
                    .find('div', attrs={'class': 'field-content'}).text
    print(style)

    image_sources = dorm_soup \
                    .find('div', attrs={'class': 'views-field views-field-field-gallery'}) \
                    .findAll('img')

    images = [image['src'] for image in image_sources]
    print(images)

    housing_data.append([document_id, name, location, address, price_per_sem, capacity, program, style, images])

with open('./housing_data.csv', 'w') as file:
    writer = csv.writer(file)
    writer.writerows(housing_data)

import csv
import requests

def convertStrArrRepToArray(string):
    strings = string[1:len(string) - 1].split(', ')
    return [element[1:len(element) - 1] for element in strings]

def convertNumArrRepToArray(string):
    strings = string[1:len(string) - 1].split(', ')
    return [int(element) for element in strings]

rows = []
with open('./updated_housing_data.csv', 'r') as file:
    reader = csv.reader(file)
    for line in reader:
        rows.append(line)
        

for i in range(0, len(rows), 1):
    document_id, name, location, address, price_per_sem, capacities, program, style, images, longtitude, latitude = rows[i]
    images = convertStrArrRepToArray(images)
    programs = convertStrArrRepToArray(program)
    capacities = convertNumArrRepToArray(capacities)

    body = {
        'document_id': document_id,
        'name': name,
        'location': location,
        'address': address,
        'style': style,
        'price_per_sem': int(price_per_sem),
        'capacities': capacities,
        'programs': programs,
        'images': images,
        'latitude': float(latitude),
        'longitude': float(longtitude),

    }
    print(body)

    response = requests.post('https://us-central1-mas-project-4261.cloudfunctions.net/app/dorms', json=body)
    print(response.status_code)
    print(response.text)
    

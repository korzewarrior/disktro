import requests
from bs4 import BeautifulSoup
import json

def get_distro_data(url):
    response = requests.get(url)
    response.raise_for_status()  # Ensure the request was successful
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # The following lines are placeholders; you'll need to inspect the website and modify the code to find the actual data.
    name = soup.find('div', {'class': 'distro-name'}).text
    version = soup.find('div', {'class': 'distro-version'}).text
    # ... and so on for the other fields
    
    return {
        "name": name,
        "version": version,
        # ... and so on
    }

def update_json(data):
    with open('distro_data.json', 'r') as file:
        current_data = json.load(file)
    
    # Update the data
    current_data.update(data)
    
    with open('distro_data.json', 'w') as file:
        json.dump(current_data, file, indent=4)

# Replace 'https://example.com/distro-page' with the actual URL of the page containing the distro data
url = 'https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/'
distro_data = get_distro_data(url)
update_json(distro_data)

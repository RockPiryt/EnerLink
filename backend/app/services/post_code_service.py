import requests
import time
from urllib.parse import quote

def get_postcode(city, street="", number=""):
    try:
        url = "https://nominatim.openstreetmap.org/search"
        params = {
            "street": f"{number} {street}",
            "city": city,
            "country": "Poland",
            "format": "json",
            "addressdetails": 1,
            "limit": 1
        }
        headers = {"User-Agent": "my-teryt-app/1.0"}
        

        r = requests.get(url, params=params, headers=headers, timeout=10)
        data = r.json()
        if data:
            postcode = data[0].get("address", {}).get("postcode")
            if postcode:
                return postcode
    except Exception as e:
        print("Error Nominatim:", e)
    return None
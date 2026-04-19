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


def get_postcodes_for_city(city):

    try:
        city_enc = quote(city)
        url = f"https://kodpocztowy.intami.pl/city/{city_enc}"
        r = requests.get(url, headers={"Accept": "application/json"}, timeout=5)
        data = r.json()
        if data:
            return sorted(set(data))
        else:
            return []
    except Exception as e:
        print("Error INTAMI:", e)
        return []
    

def get_city_for_postcode(postcode):
    try:
        r = requests.get(
            f"https://kodpocztowy.intami.pl/api/{postcode}",
            headers={"Accept": "application/json"},
            timeout=5
        )
        if r.status_code != 200:
            return []
        data = r.json()
        if not data:
            return []

        miejscowosci = sorted(set(
            item["miejscowosc"] for item in data if item.get("miejscowosc")
        ))
        return miejscowosci

    except Exception as e:
        print("Error INTAMI:", e)
        return []
import requests
from urllib.parse import quote

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
INTAMI_CITY_URL = "https://kodpocztowy.intami.pl/city/{city}"
INTAMI_POSTCODE_URL = "https://kodpocztowy.intami.pl/api/{postcode}"
NOMINATIM_HEADERS = {"User-Agent": "my-teryt-app/1.0"}
INTAMI_HEADERS = {"Accept": "application/json"}


def get_postcode(city, street="", number=""):
    try:
        params = {
            "street":  f"{number} {street}".strip(),
            "city":    city,
            "country": "Poland",
            "format":  "json",
            "addressdetails": 1,
            "limit":   1,
        }
        r = requests.get(NOMINATIM_URL, params=params, headers=NOMINATIM_HEADERS, timeout=10)
        data = r.json()
        if data:
            return data[0].get("address", {}).get("postcode")
    except Exception as e:
        print(f"Nominatim error: {e}")
    return None


def get_postcodes_for_city(city):
    try:
        url = INTAMI_CITY_URL.format(city=quote(city))
        r = requests.get(url, headers=INTAMI_HEADERS, timeout=5)
        if r.status_code == 429:
            print("INTAMI: daily limit of 50 requests exceeded")
            return []
        data = r.json()
        return sorted(set(data)) if data else []
    except Exception as e:
        print(f"INTAMI error: {e}")
        return []


def get_postcodes_for_street(city, street):
    try:
        url = INTAMI_CITY_URL.format(city=quote(city)) + f"/street/{quote(street)}"
        r = requests.get(url, headers=INTAMI_HEADERS, timeout=5)
        if r.status_code == 429:
            print("INTAMI: daily limit of 50 requests exceeded")
            return []
        if r.status_code == 200 and r.json():
            return sorted(set(r.json()))
        print(f"INTAMI: street '{street}' not found in '{city}', falling back to city")
        return get_postcodes_for_city(city)
    except Exception as e:
        print(f"INTAMI error: {e}")
        return []


def get_city_for_postcode(postcode):
    try:
        url = INTAMI_POSTCODE_URL.format(postcode=postcode)
        r = requests.get(url, headers=INTAMI_HEADERS, timeout=5)
        if r.status_code == 429:
            print("INTAMI: daily limit of 50 requests exceeded")
            return []
        if r.status_code != 200:
            return []
        data = r.json()
        return sorted(set(
            item["miejscowosc"] for item in data if item.get("miejscowosc")
        )) if data else []
    except Exception as e:
        print(f"INTAMI error: {e}")
        return []
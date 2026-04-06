import requests
import re

def mf_lookup(nip):
    from datetime import date
    url = f"https://wl-api.mf.gov.pl/api/search/nip/{nip}"
    params = {"date": date.today().isoformat()}
    r = requests.get(url, params=params)
    if r.status_code != 200:
        print(f"Error: {r.status_code} - {r.text}")
        return None
    print(r.json())
    data = r.json().get("result", {}).get("subject")
    if not data:
        return None
    return {
        "name": data.get("name"),
        "nip": data.get("nip"),
        "regon": data.get("regon"),
        "address": data.get("workingAddress")
    }

def parse_address(address):
    pattern = (
        r'(?P<street>.+?)\s+'
        r'(?P<number>\d+[A-Za-z]?'
        r'(?:[\/]\d+[A-Za-z]?)?)'
        r'\,?\s*'
        r'(?P<postcode>\d{2}-\d{3})\s+'
        r'(?P<city>.+)'
    )
    match = re.search(pattern, address)
    if not match:
        return None
    
    number = match.group("number")
    if "/" in number:
        building, local = number.split("/", 1)
    else:
        building, local = number, None

    return {
        "street": match.group("street"),
        "building": building,
        "local": local,
        "postcode": match.group("postcode"),
        "city": match.group("city")
    }
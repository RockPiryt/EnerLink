import requests

def mf_lookup(nip):
    url = f"https://wl-api.mf.gov.pl/api/search/nip/{nip}"
    r = requests.get(url)
    if r.status_code != 200:
        return None
    data = r.json().get("result", {}).get("subject")
    if not data:
        return None
    return {
        "name": data.get("name"),
        "nip": data.get("nip"),
        "regon": data.get("regon"),
        "address": data.get("workingAddress")
    }
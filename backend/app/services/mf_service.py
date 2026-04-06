import requests

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
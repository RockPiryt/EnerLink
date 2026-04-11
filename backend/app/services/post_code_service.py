import requests
import time

def get_postcode(city, street, number):
    try:
        url = "https://geo.stat.gov.pl/api/fts/gc/pkt"
        body = {
            "reqs": [{
                "miejsc_nazwa": city,
                "ul_pelna": street,
                "pkt_numer": number
            }],
            "useExtServiceIfNotFound": False
        }
        r = requests.post(url, json=body, timeout=5)
        postcode = r.json()[0]["single"]["record"]["properties"]["pkt_kodPocztowy"]
        if postcode:
            return postcode
    except:
        pass

    try:
        url = f"https://kodpocztowy.intami.pl/city/{city}/street/{street}"
        r = requests.get(url, headers={"Accept": "application/json"}, timeout=5)
        data = r.json()
        if data:
            return data[0].get("postCode")
    except:
        pass

    return None

print(get_postcode("Olsztyn", "Piłsudskiego", "1"))
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


def parse_mf_address(address: str):
    if not address:
        return None

    address = address.strip()

    parsers = [
        _parse_format_1,  # UL. X 10/5, 00-001 CITY
        _parse_format_2,  # UL X 10 00-001 CITY
        _parse_format_3,  # UL. X 10, CITY 00-001
        _parse_format_4,  # X 10/5 00-001 CITY
        _parse_format_5,  # CITY UL. X 10/5 00-001
        _parse_format_6,  # UL. X, 10/5, 00-001 CITY
        _parse_format_7,  # UL. X 10/5 - CITY 00-001
        _parse_format_8,  # UL. X 10/5, MIASTO
        _parse_format_9,  # UL. X 10/5
        _parse_format_10, # fallback heuristic
    ]

    for parser in parsers:
        result = parser(address)
        if result:
            return result

    return {
        "raw": address
    }


POSTCODE_RE = r"\d{2}-\d{3}"

def _split_number(number):
    if not number:
        return None, None

    if "/" in number:
        b, l = number.split("/", 1)
        return b.strip(), l.strip()
    return number.strip(), None


def _base_result(street=None, building=None, local=None, postcode=None, city=None):
    return {
        "street": street,
        "building": building,
        "local": local,
        "postcode": postcode,
        "city": city
    }


def _parse_format_1(a):
    m = re.search(
        rf"(?P<street>.+?)\s+(?P<number>\d+[A-Za-z]?(?:/\d+[A-Za-z]?)?)\s*,\s*(?P<postcode>{POSTCODE_RE})\s+(?P<city>.+)",
        a
    )
    if not m:
        return None

    b, l = _split_number(m.group("number"))

    return _base_result(
        street=m.group("street").strip(),
        building=b,
        local=l,
        postcode=m.group("postcode"),
        city=m.group("city").strip()
    )


def _parse_format_2(a):
    m = re.search(
        rf"(?P<street>.+?)\s+(?P<number>\d+)\s+(?P<postcode>{POSTCODE_RE})\s+(?P<city>.+)",
        a
    )
    if not m:
        return None

    return _base_result(
        street=m.group("street"),
        building=m.group("number"),
        postcode=m.group("postcode"),
        city=m.group("city")
    )


def _parse_format_3(a):
    m = re.search(
        rf"(?P<street>.+?)\s+(?P<number>\d+[A-Za-z]?(?:/\d+)?)\s*,\s*(?P<city>.+)\s+(?P<postcode>{POSTCODE_RE})",
        a
    )
    if not m:
        return None

    b, l = _split_number(m.group("number"))

    return _base_result(
        street=m.group("street"),
        building=b,
        local=l,
        postcode=m.group("postcode"),
        city=m.group("city")
    )


def _parse_format_4(a):
    m = re.search(
        rf"(?P<number>\d+[A-Za-z]?(?:/\d+[A-Za-z]?)?)\s+(?P<postcode>{POSTCODE_RE})\s+(?P<city>.+)",
        a
    )
    if not m:
        return None

    b, l = _split_number(m.group("number"))

    return _base_result(
        building=b,
        local=l,
        postcode=m.group("postcode"),
        city=m.group("city")
    )


def _parse_format_5(a):
    m = re.search(
        rf"(?P<city>.+?)\s+(?P<street>.+?)\s+(?P<number>\d+[A-Za-z]?(?:/\d+)?)\s+(?P<postcode>{POSTCODE_RE})",
        a
    )
    if not m:
        return None

    b, l = _split_number(m.group("number"))

    return _base_result(
        street=m.group("street"),
        building=b,
        local=l,
        postcode=m.group("postcode"),
        city=m.group("city")
    )


def _parse_format_6(a):
    parts = [p.strip() for p in a.split(",")]
    if len(parts) < 2:
        return None

    street_part = parts[0]

    m = re.search(rf"(?P<number>\d+[A-Za-z]?(?:/\d+)?)", street_part)
    if not m:
        return None

    b, l = _split_number(m.group("number"))

    m2 = re.search(rf"(?P<postcode>{POSTCODE_RE})\s+(?P<city>.+)", parts[-1])
    if not m2:
        return None

    return _base_result(
        street=re.sub(r"\d+.*", "", street_part).strip(),
        building=b,
        local=l,
        postcode=m2.group("postcode"),
        city=m2.group("city")
    )


def _parse_format_7(a):
    m = re.search(
        rf"(?P<street>.+?)\s+(?P<number>\d+[A-Za-z]?(?:/\d+)?)\s*-\s*(?P<city>.+)\s+(?P<postcode>{POSTCODE_RE})",
        a
    )
    if not m:
        return None

    b, l = _split_number(m.group("number"))

    return _base_result(
        street=m.group("street"),
        building=b,
        local=l,
        postcode=m.group("postcode"),
        city=m.group("city")
    )


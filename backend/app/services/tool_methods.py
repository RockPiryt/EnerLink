import re

def validate_nip(nip):
    nip = str(nip).replace("-", "").strip()
    if len(nip) != 10 or not nip.isdigit():
        return False
    weights = [6, 5, 7, 2, 3, 4, 5, 6, 7]
    checksum = sum(int(nip[i]) * weights[i] for i in range(9)) % 11
    return checksum == int(nip[9])


def normalize_street(street: str):
    if not street:
        return None

    s = street.strip()
    s = re.sub(r"^(ul\.|ulica)\s+", "", s, flags=re.IGNORECASE)
    s = re.sub(r"\s+", " ", s).strip()
    return s
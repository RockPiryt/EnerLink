import os
import xml.etree.ElementTree as ET
import requests
import zeep
from contextlib import contextmanager
from zeep.transports import Transport
from dotenv import load_dotenv
from app.models import Pkwiu
from app.db import db

load_dotenv()

GUS_API_KEY  = os.getenv("GUS_API_KEY")
GUS_WSDL     = "https://wyszukiwarkaregon.stat.gov.pl/wsBIR/wsdl/UslugaBIRzewnPubl-ver11-prod.wsdl"
GUS_ENDPOINT = "https://wyszukiwarkaregon.stat.gov.pl/wsBIR/UslugaBIRzewnPubl.svc"


def _make_client(sid=None):
    session = requests.Session()
    if sid:
        session.headers.update({"sid": sid})
    transport = Transport(session=session)
    return zeep.Client(wsdl=GUS_WSDL, transport=transport)


@contextmanager
def _gus_session():
    if not GUS_API_KEY:
        raise RuntimeError("GUS_API_KEY missing in environment variables.")

    client_anon = _make_client()
    session_id = client_anon.service.Zaloguj(pKluczUzytkownika=GUS_API_KEY)

    if not session_id:
        raise RuntimeError("GUS: login failed — empty session ID returned.")

    client = _make_client(sid=session_id)
    try:
        yield client
    finally:
        try:
            client.service.Wyloguj(pIdentyfikatorSesji=session_id)
        except Exception as e:
            print(f"GUS logout error: {e}")


def _get_text(element, tag):
    el = element.find(tag)
    return el.text.strip() if el is not None and el.text else None


def fetch_pkd_catalog_from_gus():
 
    with _gus_session() as client:
        result = client.service.DanePobierzSlownik(pNazwaSlownika="pkd")

    if not result:
        return []

    root = ET.fromstring(result)
    items = []
    for pozycja in root.findall(".//pozycja"):
        code = _get_text(pozycja, "kod")
        name = _get_text(pozycja, "nazwa")
        if code and name:
            items.append({"code": code, "name": name})

    return items


def fetch_pkd_by_nip_from_gus(nip):
  
    with _gus_session() as client:
        result = client.service.DaneSzukajPodmioty(
            pParametryWyszukiwania={"Nip": nip}
        )

    if not result:
        return None

    root = ET.fromstring(result)
    dane = root.find(".//dane")
    if dane is None:
        return None

    code = _get_text(dane, "PkdKod")
    name = _get_text(dane, "PkdNazwa")
    return {"code": code, "name": name} if code else None


def gus_lookup(nip):
 
    with _gus_session() as client:
        result = client.service.DaneSzukajPodmioty(
            pParametryWyszukiwania={"Nip": nip}
        )

    if not result:
        return None

    root = ET.fromstring(result)
    dane = root.find(".//dane")
    if dane is None:
        return None

    return {
        "name":     _get_text(dane, "Nazwa"),
        "nip":      _get_text(dane, "Nip"),
        "regon":    _get_text(dane, "Regon"),
        "street":   _get_text(dane, "Ulica") or _get_text(dane, "MiejscowoscPoczty"),
        "building": _get_text(dane, "NrNieruchomosci"),
        "local":    _get_text(dane, "NrLokalu"),
        "postcode": _get_text(dane, "KodPocztowy"),
        "city":     _get_text(dane, "Miejscowosc"),
    }


def import_pkd_catalog():
  
    try:
        items = fetch_pkd_catalog_from_gus()

        if not items:
            print("GUS: empty PKD catalog")
            return {"added": 0, "updated": 0}

        added = 0
        updated = 0

        for item in items:
            existing = Pkwiu.query.filter_by(pkwiu_nr=item["code"]).first()
            if not existing:
                db.session.add(Pkwiu(pkwiu_nr=item["code"], pkwiu_name=item["name"]))
                added += 1
            elif existing.pkwiu_name != item["name"]:
                existing.pkwiu_name = item["name"]
                updated += 1

        db.session.commit()
        print(f"PKD import completed — added: {added}, updated: {updated} records.")
        return {"added": added, "updated": updated}

    except Exception as e:
        db.session.rollback()
        print(f"GUS PKD import error: {e}")
        return {"added": 0, "updated": 0}


def get_pkd_for_nip(nip):
   
    try:
        pkd_data = fetch_pkd_by_nip_from_gus(nip)

        if not pkd_data:
            print(f"No PKD found in GUS for NIP {nip}")
            return None

        existing = Pkwiu.query.filter_by(pkwiu_nr=pkd_data["code"]).first()
        if existing:
            return existing

        new_pkd = Pkwiu(pkwiu_nr=pkd_data["code"], pkwiu_name=pkd_data["name"])
        db.session.add(new_pkd)
        db.session.commit()
        return new_pkd

    except Exception as e:
        db.session.rollback()
        print(f"GUS PKD lookup error: {e}")
        return None
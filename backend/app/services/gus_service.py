import os
import xml.etree.ElementTree as ET
import requests
import zeep
from contextlib import contextmanager
from zeep.transports import Transport
from dotenv import load_dotenv
from tool_methods import normalize_street
#from app.models import Pkwiu
#from app.db import db

load_dotenv()

GUS_API_KEY  = os.getenv("GUS_API_KEY")
GUS_WSDL     = "https://wyszukiwarkaregon.stat.gov.pl/wsBIR/wsdl/UslugaBIRzewnPubl-ver11-prod.wsdl"


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
        "street":   normalize_street(_get_text(dane, "Ulica") or _get_text(dane, "MiejscowoscPoczty")),
        "building": _get_text(dane, "NrNieruchomosci"),
        "local":    _get_text(dane, "NrLokalu"),
        "postcode": _get_text(dane, "KodPocztowy"),
        "city":     _get_text(dane, "Miejscowosc"),
    }
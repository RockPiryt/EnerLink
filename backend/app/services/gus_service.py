import os
import xml.etree.ElementTree as ET
import requests
import xlrd
import zeep
from contextlib import contextmanager
from zeep.transports import Transport
from dotenv import load_dotenv
from tool_methods import normalize_street


load_dotenv()

GUS_API_KEY  = os.getenv("GUS_API_KEY")
GUS_WSDL     = "https://wyszukiwarkaregon.stat.gov.pl/wsBIR/wsdl/UslugaBIRzewnPubl-ver11-prod.wsdl"

PKD_XLS_URL = "https://klasyfikacje.stat.gov.pl/static/pkd_25/pdf/StrukturaPKD2025.xls"


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


def fetch_pkd_catalog():

    try:
        response = requests.get(PKD_XLS_URL, timeout=30)
        response.raise_for_status()
    except requests.RequestException as e:
        raise RuntimeError(f"Failed to download PKD file from GUS: {e}")

    try:
        workbook = xlrd.open_workbook(file_contents=response.content)
    except Exception as e:
        raise RuntimeError(f"Failed to open XLS file: {e}")

    sheet = workbook.sheet_by_index(0)
    items = []

    for row_idx in range(sheet.nrows):
        row = sheet.row_values(row_idx)

        code = str(row[3]).strip() if len(row) > 3 else ""
        name = str(row[4]).strip() if len(row) > 4 else ""

        if not code or not name or code == "Podklasa":
            continue

        items.append({"code": code, "name": name})

    if not items:
        raise RuntimeError(
            "Failed to find any PKD subclasses in the file — "
            "please check the worksheet structure."
        )

    return items

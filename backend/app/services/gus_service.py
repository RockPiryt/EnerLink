import os
import xml.etree.ElementTree as ET
import requests
import zeep
from zeep.transports import Transport
from dotenv import load_dotenv

load_dotenv()

GUS_API_KEY = os.getenv("GUS_API_KEY")

GUS_WSDL     = "https://wyszukiwarkaregon.stat.gov.pl/wsBIR/wsdl/UslugaBIRzewnPubl-ver11-prod.wsdl"
GUS_ENDPOINT = "https://wyszukiwarkaregon.stat.gov.pl/wsBIR/UslugaBIRzewnPubl.svc"


def _make_client(sid=None):
    """Tworzy klienta zeep, opcjonalnie z SID w nagłówku HTTP."""
    session = requests.Session()
    if sid:
        session.headers.update({"sid": sid})
    transport = Transport(session=session)
    return zeep.Client(wsdl=GUS_WSDL, transport=transport)
 
 
def _gus_login():
    """Loguje się do GUS BIR, zwraca (client, session_id)."""
    client = _make_client()
    session_id = client.service.Zaloguj(pKluczUzytkownika=GUS_API_KEY)
    return session_id
 
 
def _gus_logout(session_id):
    try:
        _make_client(sid=session_id).service.Wyloguj(pIdentyfikatorSesji=session_id)
    except Exception as e:
        print(f"GUS wylogowanie error: {e}")


def gus_lookup(nip):
    """
    Pobiera dane podmiotu z GUS BIR po NIP.
    Zwraca słownik z rozbitymi polami adresowymi lub None.
    """
    if not GUS_API_KEY:
        print("Brak GUS_API_KEY w zmiennych środowiskowych")
        return None

    client, session_id = None, None
    try:
        client, session_id = _gus_get_session()

        result = client.service.DaneSzukajPodmioty(
            pParametryWyszukiwania={"Nip": nip},
            _soapheaders=[_build_soap_header(session_id)]
        )

        if not result:
            print(f"GUS: brak danych dla NIP {nip}")
            return None

        root = ET.fromstring(result)
        dane = root.find(".//dane")

        if dane is None:
            print(f"GUS: pusta odpowiedź dla NIP {nip}")
            return None

        def get(tag):
            el = dane.find(tag)
            return el.text.strip() if el is not None and el.text else None

        return {
            "name":     get("Nazwa"),
            "nip":      get("Nip"),
            "regon":    get("Regon"),
            "street":   get("Ulica") or get("MiejscowoscPoczty"),
            "building": get("NrNieruchomosci"),
            "local":    get("NrLokalu"),
            "postcode": get("KodPocztowy"),
            "city":     get("Miejscowosc"),
        }

    except Exception as e:
        print(f"GUS lookup error: {e}")
        return None

    finally:
        if client and session_id:
            try:
                client.service.Wyloguj(pIdentyfikatorSesji=session_id)
            except Exception as e:
                print(f"GUS wylogowanie error: {e}")
import os
import xml.etree.ElementTree as ET

import zeep
from zeep.transports import Transport
from dotenv import load_dotenv

load_dotenv()

GUS_API_KEY = os.getenv("GUS_API_KEY")

GUS_WSDL     = "https://wyszukiwarkaregon.stat.gov.pl/wsBIR/UslugaBIRzewnPubl.svcwsdl"
GUS_ENDPOINT = "https://wyszukiwarkaregon.stat.gov.pl/wsBIR/UslugaBIRzewnPubl.svc"


def _gus_get_session():
    transport = Transport()
    client = zeep.Client(wsdl=GUS_WSDL, transport=transport)
    session_id = client.service.Zaloguj(pKluczUzytkownika=GUS_API_KEY)
    return client, session_id


def _build_soap_header(session_id):
    header = zeep.xsd.Element(
        "{http://CIS/BIR/PUBL/2014/07}ZgloszenieCertyfikatRejestracja",
        zeep.xsd.ComplexType([
            zeep.xsd.Element(
                "{http://CIS/BIR/PUBL/2014/07}sid",
                zeep.xsd.String()
            )
        ])
    )
    return header(sid=session_id)


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
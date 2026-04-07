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


def import_pkd_catalog(db_session):
    
    from app.models import Pkwiu
 
    if not GUS_API_KEY:
        print("Brak GUS_API_KEY w zmiennych środowiskowych")
        return 0
 
    session_id = None
    try:
        session_id = _gus_login()
        if not session_id:
            print("GUS: nie udało się zalogować")
            return 0
 
        client = _make_client(sid=session_id)
        result = client.service.DanePobierzSlownik(pNazwaSlownika="pkd")
 
        if not result:
            print("GUS: pusty słownik PKD")
            return 0
 
        root = ET.fromstring(result)
        added = 0
 
        for pozycja in root.findall(".//pozycja"):
            def get(tag):
                el = pozycja.find(tag)
                return el.text.strip() if el is not None and el.text else None
 
            code = get("kod")
            name = get("nazwa")
            if not code or not name:
                continue
 
            exists = db_session.query(Pkwiu).filter_by(pkwiu_nr=code).first()
            if not exists:
                db_session.add(Pkwiu(pkwiu_nr=code, pkwiu_name=name))
                added += 1
 
        db_session.commit()
        print(f"PKD import zakończony — dodano {added} kodów.")
        return added
 
    except Exception as e:
        print(f"GUS PKD import error: {e}")
        db_session.rollback()
        return 0
 
    finally:
        if session_id:
            _gus_logout(session_id)


def _fetch_primary_pkd_from_gus(nip):
    # Pobiera główny kod PKD podmiotu z GUS BIR po NIP.

    session_id = None
    try:
        session_id = _gus_login()
        if not session_id:
            return None
 
        client = _make_client(sid=session_id)
        result = client.service.DaneSzukajPodmioty(
            pParametryWyszukiwania={"Nip": nip}
        )
 
        if not result:
            return None
 
        root = ET.fromstring(result)
        dane = root.find(".//dane")
        if dane is None:
            return None
 
        def get(tag):
            el = dane.find(tag)
            return el.text.strip() if el is not None and el.text else None
 
        code = get("PkdKod")
        name = get("PkdNazwa")
        return {"code": code, "name": name} if code else None
 
    except Exception as e:
        print(f"GUS PKD lookup error: {e}")
        return None
 
    finally:
        if session_id:
            _gus_logout(session_id)


def get_pkd_for_nip(nip, db_session):
    """
    Zwraca obiekt Pkwiu dla podanego NIP.
 
    Kolejność:
      1. Pobierz kod PKD z GUS (z podstawowego zapytania po NIP)
      2. Sprawdź czy kod jest już w bazie → jeśli tak, zwróć go
      3. Jeśli nie ma → zapisz do bazy i zwróć
 
    Zwraca obiekt Pkwiu lub None.
    """
    from app.models import Pkwiu
 
    pkd_data = _fetch_primary_pkd_from_gus(nip)
    if not pkd_data:
        print(f"Brak PKD z GUS dla NIP {nip}")
        return None
 
    code = pkd_data["code"]
    name = pkd_data["name"]
 
    # sprawdź w bazie
    pkd = db_session.query(Pkwiu).filter_by(pkwiu_nr=code).first()
    if pkd:
        print(f"PKD {code} – z bazy")
        return pkd
 
    # nie ma w bazie — dodaj
    pkd = Pkwiu(pkwiu_nr=code, pkwiu_name=name)
    db_session.add(pkd)
    db_session.commit()
    print(f"PKD {code} – dodano do bazy: {name}")
    return pkd


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
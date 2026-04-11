import os
import io
import zipfile
import base64
import xml.etree.ElementTree as ET
from dotenv import load_dotenv
from zeep import Client
from zeep.transports import Transport
from zeep.wsse.username import UsernameToken

load_dotenv()

TERYT_LOGIN = os.getenv("TERYT_LOGIN")
TERYT_PASSWORD = os.getenv("TERYT_PASSWORD")
TERYT_DATE = os.getenv("TERYT_DATE", "2024-01-01")
WSDL = "https://uslugaterytws1.stat.gov.pl/wsdl/terytws1.wsdl"

def _get_client():
    token = UsernameToken(username=TERYT_LOGIN, password=TERYT_PASSWORD)
    return Client(wsdl=WSDL, wsse=token, transport=Transport(timeout=30))

def get_voivodeships():
    client = _get_client()
    response = client.service.PobierzKatalogTERC(TERYT_DATE)

    zip_bytes = base64.b64decode(response.plik_zawartosc)
    with zipfile.ZipFile(io.BytesIO(zip_bytes)) as zf:
        xml_filename = next(f for f in zf.namelist() if f.endswith(".xml"))
        xml_content = zf.read(xml_filename)

    root = ET.fromstring(xml_content)

    result = []
    for row in root.find("catalog"):
        pow_ = row.findtext("POW")
        gmi = row.findtext("GMI")
        if pow_ == '' and gmi == '':
            result.append({
                "name": row.findtext("NAZWA")
            })

    return result
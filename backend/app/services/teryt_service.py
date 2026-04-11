import os
from zeep import Client
from zeep.transports import Transport
from dotenv import load_dotenv

load_dotenv()

TERYT_LOGIN = os.getenv("TERYT_LOGIN")
TERYT_PASSWORD = os.getenv("TERYT_PASSWORD")
TERYT_DATE = os.getenv("TERYT_DATE", "2024-01-01")

TERYT_WSDL = "https://eteryt.stat.gov.pl/eTerytWS1/Service1.svc?wsdl"


def _get_client():
    transport = Transport(timeout=30)
    return Client(wsdl=TERYT_WSDL, transport=transport)
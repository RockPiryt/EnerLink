import pytest
import base64
import io
import zipfile
import xml.etree.ElementTree as ET
from app.services import teryt_service

# --- Fixtures for fake TERYT responses ---
def make_zip_with_xml(xml_content: str) -> bytes:
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, 'w') as zf:
        zf.writestr('data.xml', xml_content)
    return buf.getvalue()

def make_base64_zip(xml_content: str) -> str:
    return base64.b64encode(make_zip_with_xml(xml_content)).decode()

# --- get_districts ---
def test_get_districts(monkeypatch):
    xml = '''<root><catalog>
        <row><POW></POW><GMI></GMI><NAZWA>District1</NAZWA></row>
        <row><POW>01</POW><GMI></GMI><NAZWA>NotDistrict</NAZWA></row>
        <row><POW></POW><GMI></GMI><NAZWA>District2</NAZWA></row>
    </catalog></root>'''
    class FakeResponse:
        plik_zawartosc = make_base64_zip(xml)
    class FakeService:
        def PobierzKatalogTERC(self, date):
            return FakeResponse()
    class FakeClient:
        service = FakeService()
    monkeypatch.setattr(teryt_service, '_get_client', lambda: FakeClient())
    result = teryt_service.get_districts()
    assert result == [{"name": "District1"}, {"name": "District2"}]

# --- get_localities ---
def test_get_localities(monkeypatch):
    xml = '''<root><catalog>
        <row><NAZWA>City1</NAZWA></row>
        <row><NAZWA>City2</NAZWA></row>
        <row><NAZWA>City1</NAZWA></row>
    </catalog></root>'''
    class FakeResponse:
        plik_zawartosc = make_base64_zip(xml)
    class FakeService:
        def PobierzKatalogSIMC(self, date):
            return FakeResponse()
    class FakeClient:
        service = FakeService()
    monkeypatch.setattr(teryt_service, '_get_client', lambda: FakeClient())
    result = teryt_service.get_localities()
    assert result == [{"name": "City1"}, {"name": "City2"}]

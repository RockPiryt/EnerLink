import pytest
from app.services import gus_service

# --- gus_lookup ---
def test_gus_lookup_success(monkeypatch):
    # Prepare fake XML result
    xml = '''<root><dane>
        <Nazwa>TestName</Nazwa>
        <Nip>8567346215</Nip>
        <Regon>123456789</Regon>
        <Ulica>Main</Ulica>
        <NrNieruchomosci>10</NrNieruchomosci>
        <NrLokalu>5</NrLokalu>
        <KodPocztowy>12-345</KodPocztowy>
        <Miejscowosc>City</Miejscowosc>
    </dane></root>'''
    class FakeService:
        def DaneSzukajPodmioty(self, pParametryWyszukiwania):
            return xml
    class FakeClient:
        service = FakeService()
    class DummyContext:
        def __enter__(self): return FakeClient()
        def __exit__(self, exc_type, exc_val, exc_tb): pass
    monkeypatch.setattr(gus_service, '_gus_session', lambda: DummyContext())
    result = gus_service.gus_lookup("8567346215")
    assert result["name"] == "TestName"
    assert result["nip"] == "8567346215"
    assert result["street"] == "Main"
    assert result["building"] == "10"
    assert result["local"] == "5"
    assert result["postcode"] == "12-345"
    assert result["city"] == "City"

def test_gus_lookup_not_found(monkeypatch):
    class FakeService:
        def DaneSzukajPodmioty(self, pParametryWyszukiwania):
            return None
    class FakeClient:
        service = FakeService()
    class DummyContext:
        def __enter__(self): return FakeClient()
        def __exit__(self, exc_type, exc_val, exc_tb): pass
    monkeypatch.setattr(gus_service, '_gus_session', lambda: DummyContext())
    assert gus_service.gus_lookup("8567346215") is None

def test_gus_lookup_no_dane(monkeypatch):
    xml = '<root></root>'
    class FakeService:
        def DaneSzukajPodmioty(self, pParametryWyszukiwania):
            return xml
    class FakeClient:
        service = FakeService()
    class DummyContext:
        def __enter__(self): return FakeClient()
        def __exit__(self, exc_type, exc_val, exc_tb): pass
    monkeypatch.setattr(gus_service, '_gus_session', lambda: DummyContext())
    assert gus_service.gus_lookup("8567346215") is None

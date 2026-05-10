import pytest
import requests
from app.services import mf_service
from datetime import date

# --- mf_lookup ---
def test_mf_lookup_success(monkeypatch):
    today = date.today().isoformat()
    def fake_get(url, params):
        assert params["date"] == today
        class Resp:
            status_code = 200
            def json(self):
                return {"result": {"subject": {
                    "name": "TestName",
                    "nip": "8567346215",
                    "regon": "123456789",
                    "workingAddress": "ul. Main 10/5, 12-345 City"
                }}}
        return Resp()
    monkeypatch.setattr(requests, "get", fake_get)
    result = mf_service.mf_lookup("8567346215")
    assert result["name"] == "TestName"
    assert result["nip"] == "8567346215"
    assert result["street"] == "ul. Main"
    assert result["building"] == "10"
    assert result["local"] == "5"
    assert result["postcode"] == "12-345"
    assert result["city"] == "City"

def test_mf_lookup_not_found(monkeypatch):
    def fake_get(url, params):
        class Resp:
            status_code = 200
            def json(self): return {"result": {"subject": None}}
        return Resp()
    monkeypatch.setattr(requests, "get", fake_get)
    assert mf_service.mf_lookup("8567346215") is None

def test_mf_lookup_api_error(monkeypatch):
    def fake_get(url, params):
        class Resp:
            status_code = 404
            text = "error"
            def json(self): return {}
        return Resp()
    monkeypatch.setattr(requests, "get", fake_get)
    assert mf_service.mf_lookup("8567346215") is None

def test_parse_mf_address_formats():
    # Only one format for brevity, but can be extended
    addr = "ul. Main 10/5, 12-345 City"
    parsed = mf_service.parse_mf_address(addr)
    assert parsed["street"] == "ul. Main"
    assert parsed["building"] == "10"
    assert parsed["local"] == "5"
    assert parsed["postcode"] == "12-345"
    assert parsed["city"] == "City"

def test_parse_mf_address_none():
    assert mf_service.parse_mf_address(None) is None

import pytest
import requests
from app.services import postcode_service

# --- get_postcode ---
def test_get_postcode_success(monkeypatch):
    def fake_get(url, params, headers, timeout):
        class Resp:
            def json(self):
                return [{"address": {"postcode": "12-345"}}]
        return Resp()
    monkeypatch.setattr(requests, "get", fake_get)
    assert postcode_service.get_postcode("Warsaw", "Main", "1") == "12-345"

def test_get_postcode_none(monkeypatch):
    def fake_get(url, params, headers, timeout):
        class Resp:
            def json(self):
                return []
        return Resp()
    monkeypatch.setattr(requests, "get", fake_get)
    assert postcode_service.get_postcode("Warsaw", "Main", "1") is None

# --- get_postcodes_for_city ---
def test_get_postcodes_for_city_success(monkeypatch):
    def fake_get(url, headers, timeout):
        class Resp:
            def json(self):
                return ["12-345", "12-346"]
            status_code = 200
        return Resp()
    monkeypatch.setattr(requests, "get", fake_get)
    result = postcode_service.get_postcodes_for_city("Warsaw")
    assert result == ["12-345", "12-346"]

def test_get_postcodes_for_city_limit(monkeypatch):
    def fake_get(url, headers, timeout):
        class Resp:
            status_code = 429
            def json(self): return []
        return Resp()
    monkeypatch.setattr(requests, "get", fake_get)
    assert postcode_service.get_postcodes_for_city("Warsaw") == []

def test_get_postcodes_for_city_error(monkeypatch):
    def fake_get(url, headers, timeout):
        raise Exception("fail")
    monkeypatch.setattr(requests, "get", fake_get)
    assert postcode_service.get_postcodes_for_city("Warsaw") == []

# --- get_postcodes_for_street ---
def test_get_postcodes_for_street_success(monkeypatch):
    def fake_get(url, headers, timeout):
        class Resp:
            def json(self): return ["12-345"]
            status_code = 200
        return Resp()
    monkeypatch.setattr(requests, "get", fake_get)
    result = postcode_service.get_postcodes_for_street("Warsaw", "Main")
    assert result == ["12-345"]

def test_get_postcodes_for_street_fallback(monkeypatch):
    calls = {"city": False}
    def fake_get(url, headers, timeout):
        class Resp:
            status_code = 404
            def json(self): return []
        if "/street/" in url:
            return Resp()
        calls["city"] = True
        class Resp2:
            def json(self): return ["12-345"]
            status_code = 200
        return Resp2()
    monkeypatch.setattr(requests, "get", fake_get)
    result = postcode_service.get_postcodes_for_street("Warsaw", "Main")
    assert result == ["12-345"]
    assert calls["city"]

def test_get_postcodes_for_street_error(monkeypatch):
    def fake_get(url, headers, timeout):
        raise Exception("fail")
    monkeypatch.setattr(requests, "get", fake_get)
    assert postcode_service.get_postcodes_for_street("Warsaw", "Main") == []

# --- get_city_for_postcode ---
def test_get_city_for_postcode_success(monkeypatch):
    def fake_get(url, headers, timeout):
        class Resp:
            status_code = 200
            def json(self):
                return [{"miejscowosc": "Warsaw"}, {"miejscowosc": "Warsaw"}, {"miejscowosc": "Krakow"}]
        return Resp()
    monkeypatch.setattr(requests, "get", fake_get)
    result = postcode_service.get_city_for_postcode("12-345")
    assert result == ["Krakow", "Warsaw"]

def test_get_city_for_postcode_limit(monkeypatch):
    def fake_get(url, headers, timeout):
        class Resp:
            status_code = 429
            def json(self): return []
        return Resp()
    monkeypatch.setattr(requests, "get", fake_get)
    assert postcode_service.get_city_for_postcode("12-345") == []

def test_get_city_for_postcode_error(monkeypatch):
    def fake_get(url, headers, timeout):
        raise Exception("fail")
    monkeypatch.setattr(requests, "get", fake_get)
    assert postcode_service.get_city_for_postcode("12-345") == []

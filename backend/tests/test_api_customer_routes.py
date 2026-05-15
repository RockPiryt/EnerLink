import pytest

def test_lookup_by_nip_invalid_nip(seeded_client, auth_header):
    """Should return 400 for an invalid NIP format."""
    invalid_nip = "1234"
    response = seeded_client.get(f"/api/lookup/nip/{invalid_nip}", headers=auth_header)
    assert response.status_code == 400
    data = response.get_json()
    assert "error" in data
    assert data["error"] == "Wrong NIP."


def test_lookup_by_nip_valid_not_found(seeded_client, auth_header, monkeypatch):
    """Should return 404 for a valid but non-existing NIP."""
    valid_nip = "1234563218"
    monkeypatch.setattr("app.routes.api_customer_routes.mf_lookup", lambda nip: None)
    monkeypatch.setattr("app.routes.api_customer_routes.gus_lookup", lambda nip: None)
    response = seeded_client.get(f"/api/lookup/nip/{valid_nip}", headers=auth_header)
    assert response.status_code == 404
    data = response.get_json()
    assert "error" in data

def test_lookup_by_nip_with_hyphens(seeded_client, auth_header, monkeypatch):
    valid_nip = "123-456-32-18"
    monkeypatch.setattr("app.routes.api_customer_routes.mf_lookup", lambda nip: {"nip": "1234563218", "company": "Test Co"})
    response = seeded_client.get(f"/api/lookup/nip/{valid_nip}", headers=auth_header)
    assert response.status_code == 200
    data = response.get_json()
    assert data["nip"] == "1234563218"

def test_lookup_by_nip_with_spaces(seeded_client, auth_header, monkeypatch):
    valid_nip = " 1234563218 "
    monkeypatch.setattr("app.routes.api_customer_routes.mf_lookup", lambda nip: {"nip": "1234563218", "company": "Test Co"})
    response = seeded_client.get(f"/api/lookup/nip/{valid_nip}", headers=auth_header)
    assert response.status_code == 200

def test_lookup_by_nip_too_short(seeded_client, auth_header):
    nip = "123"
    response = seeded_client.get(f"/api/lookup/nip/{nip}", headers=auth_header)
    assert response.status_code == 400

def test_lookup_by_nip_too_long(seeded_client, auth_header):
    nip = "123456789012345"
    response = seeded_client.get(f"/api/lookup/nip/{nip}", headers=auth_header)
    assert response.status_code == 400

def test_lookup_by_nip_with_letters(seeded_client, auth_header):
    nip = "12345abcde"
    response = seeded_client.get(f"/api/lookup/nip/{nip}", headers=auth_header)
    assert response.status_code == 400

def test_lookup_by_nip_empty(seeded_client, auth_header):
    nip = ""
    response = seeded_client.get(f"/api/lookup/nip/{nip}", headers=auth_header)
    assert response.status_code == 404 or response.status_code == 400


def test_lookup_by_nip_special_chars(seeded_client, auth_header):
    nip = "12@#456!3218"
    response = seeded_client.get(f"/api/lookup/nip/{nip}", headers=auth_header)
    assert response.status_code == 400

import pytest
from flask import url_for

def get_token(client):
    resp = client.post("/api/login", json={
        "email": "david.wilson@enerlink.com",
        "password": "analyst123"
    })
    assert resp.status_code == 200, f"Login failed: {resp.data}"
    return resp.get_json()["token"]

@pytest.fixture()
def auth_header(seeded_client):
    token = get_token(seeded_client)
    return {"Authorization": f"Bearer {token}"}

def test_sync_districts_success(seeded_client, auth_header, monkeypatch):
    # Mock get_districts to return fake data
    def fake_get_districts():
        return [{"name": "TestDistrict"}]
    monkeypatch.setattr("app.routes.api_locations_routes.get_districts", fake_get_districts)
    resp = seeded_client.post("/api/location/districts/sync", headers=auth_header)
    assert resp.status_code == 200
    data = resp.get_json()
    assert "message" in data
    assert data["added"] >= 0
    assert "total" in data


def test_sync_localities_success(seeded_client, auth_header, monkeypatch):
    # Mock get_localities to return fake data
    def fake_get_localities():
        return [{"name": "TestCity"}]
    monkeypatch.setattr("app.routes.api_locations_routes.get_localities", fake_get_localities)
    resp = seeded_client.post("/api/location/localities/sync", headers=auth_header)
    assert resp.status_code == 200
    data = resp.get_json()
    assert "message" in data
    assert data["added"] >= 0
    assert "total" in data


def test_sync_districts_error(seeded_client, auth_header, monkeypatch):
    def fail_get_districts():
        raise Exception("fail")
    monkeypatch.setattr("app.routes.api_locations_routes.get_districts", fail_get_districts)
    resp = seeded_client.post("/api/location/districts/sync", headers=auth_header)
    assert resp.status_code == 500
    data = resp.get_json()
    assert "error" in data


def test_sync_localities_error(seeded_client, auth_header, monkeypatch):
    def fail_get_localities():
        raise Exception("fail")
    monkeypatch.setattr("app.routes.api_locations_routes.get_localities", fail_get_localities)
    resp = seeded_client.post("/api/location/localities/sync", headers=auth_header)
    assert resp.status_code == 500
    data = resp.get_json()
    assert "error" in data

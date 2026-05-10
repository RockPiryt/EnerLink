import pytest

def get_token(client):
    resp = client.post("/api/login", json={
        "email": "david.wilson@enerlink.com",
        "password": "analyst123"
    })
    assert resp.status_code == 200
    return resp.get_json()["token"]

@pytest.fixture()
def auth_header(seeded_client):
    token = get_token(seeded_client)
    return {"Authorization": f"Bearer {token}"}

def test_lookup_by_nip_mf_success(seeded_client, auth_header, monkeypatch):
    # MF returns data
    mf_data = {"name": "Test MF", "nip": "8567346215", "source": "mf"}
    monkeypatch.setattr("app.routes.api_customer_routes.mf_lookup", lambda nip: mf_data)
    monkeypatch.setattr("app.routes.api_customer_routes.gus_lookup", lambda nip: None)
    resp = seeded_client.get("/api/lookup/nip/8567346215", headers=auth_header)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["name"] == "Test MF"
    assert data["source"] == "mf"

def test_lookup_by_nip_gus_success(seeded_client, auth_header, monkeypatch):
    # MF returns None, GUS returns data
    monkeypatch.setattr("app.routes.api_customer_routes.mf_lookup", lambda nip: None)
    gus_data = {"name": "Test GUS", "nip": "8567346215", "source": "gus"}
    monkeypatch.setattr("app.routes.api_customer_routes.gus_lookup", lambda nip: gus_data)
    resp = seeded_client.get("/api/lookup/nip/8567346215", headers=auth_header)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["name"] == "Test GUS"
    assert data["source"] == "gus"

def test_lookup_by_nip_not_found(seeded_client, auth_header, monkeypatch):
    # Both return None
    monkeypatch.setattr("app.routes.api_customer_routes.mf_lookup", lambda nip: None)
    monkeypatch.setattr("app.routes.api_customer_routes.gus_lookup", lambda nip: None)
    resp = seeded_client.get("/api/lookup/nip/8567346215", headers=auth_header)
    assert resp.status_code == 404
    data = resp.get_json()
    assert data is not None
    assert "error" in data

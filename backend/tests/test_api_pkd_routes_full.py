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

def test_get_all_pkd_empty(seeded_client, auth_header):
    resp = seeded_client.get("/api/pkd/", headers=auth_header)
    assert resp.status_code == 200
    assert resp.get_json() == []

def test_import_pkd_success(seeded_client, auth_header, monkeypatch):
    # Mock fetch_pkd_catalog to return fake data
    fake_catalog = [
        {"code": "01.11", "name": "Crop growing"},
        {"code": "01.12", "name": "Animal farming"}
    ]
    monkeypatch.setattr("app.routes.api_pkd_routes.fetch_pkd_catalog", lambda: fake_catalog)
    resp = seeded_client.post("/api/pkd/import", headers=auth_header)
    assert resp.status_code == 201
    data = resp.get_json()
    assert "Imported" in data["message"]
    # Now list should not be empty
    resp2 = seeded_client.get("/api/pkd/", headers=auth_header)
    assert resp2.status_code == 200
    items = resp2.get_json()
    assert len(items) == 2
    assert items[0]["pkwiu_nr"] == "01.11"

def test_import_pkd_gus_error(seeded_client, auth_header, monkeypatch):
    monkeypatch.setattr("app.routes.api_pkd_routes.fetch_pkd_catalog", lambda: (_ for _ in ()).throw(RuntimeError("GUS error")))
    resp = seeded_client.post("/api/pkd/import", headers=auth_header)
    assert resp.status_code == 502
    assert "error" in resp.get_json()

def test_get_pkd_by_nr_success(seeded_client, auth_header, monkeypatch):
    # Import fake PKD
    fake_catalog = [{"code": "10.20", "name": "Processing"}]
    monkeypatch.setattr("app.routes.api_pkd_routes.fetch_pkd_catalog", lambda: fake_catalog)
    seeded_client.post("/api/pkd/import", headers=auth_header)
    resp = seeded_client.get("/api/pkd/10.20", headers=auth_header)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["pkwiu_nr"] == "10.20"
    assert data["pkwiu_name"] == "Processing"

def test_get_pkd_by_nr_not_found(seeded_client, auth_header):
    resp = seeded_client.get("/api/pkd/99.99", headers=auth_header)
    assert resp.status_code == 404
    assert "error" in resp.get_json()

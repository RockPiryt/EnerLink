def test_get_countries_returns_list(client):
    resp = client.get("/api/address/countries")
    assert resp.status_code == 200
    assert resp.is_json

    data = resp.get_json()
    assert isinstance(data, list)
    assert len(data) >= 1

    # minimalna walidacja struktury
    first = data[0]
    assert "id" in first
    assert "name" in first
    assert "shortcut" in first
    assert "is_active" in first


def test_add_country_success(client):
    payload = {"name": "Poland", "shortcut": "PL"}
    resp = client.post("/api/address/countries", json=payload)
    assert resp.status_code == 201
    data = resp.get_json()
    assert data["message"] == "Country added"
    assert data["country"]["name"] == "Poland"
    assert data["country"]["shortcut"] == "PL"
    assert data["country"]["is_active"] is True

def test_add_country_missing_fields(client):
    resp = client.post("/api/address/countries", json={"name": "Poland"})
    assert resp.status_code == 400
    assert resp.get_json()["error"] == "name and shortcut are required"

def test_patch_country_status_success(client):
    # najpierw dodaj kraj
    resp_create = client.post("/api/address/countries", json={"name": "Germany", "shortcut": "DE"})
    assert resp_create.status_code == 201
    country_id = resp_create.get_json()["country"]["id"]

    # zmień status
    resp = client.patch(f"/api/address/countries/{country_id}/status", json={"is_active": False})
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["message"] == "Country status updated"
    assert data["is_active"] is False

def test_patch_country_status_not_found(client):
    resp = client.patch("/api/address/countries/999999/status", json={"is_active": False})
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "Country not found"

def test_patch_country_status_missing_field(client):
    resp_create = client.post("/api/address/countries", json={"name": "France", "shortcut": "FR"})
    country_id = resp_create.get_json()["country"]["id"]

    resp = client.patch(f"/api/address/countries/{country_id}/status", json={})
    assert resp.status_code == 400
    assert resp.get_json()["error"] == "'is_active' field is required"

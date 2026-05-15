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

def test_search_postcode_success(seeded_client, auth_header, monkeypatch):
    # Mock get_postcode to return a valid postcode
    def fake_get_postcode(city, street, number):
        return "12-345"
    monkeypatch.setattr("app.routes.api_postcode_routes.get_postcode", fake_get_postcode)
    resp = seeded_client.get("/api/postcode/search?city=Warsaw&street=Main&number=1", headers=auth_header)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["postcode"] == "12-345"
    assert data["type"] == "single"

def test_search_postcode_city_list(seeded_client, auth_header, monkeypatch):
    # Mock get_postcode to return None, get_postcodes_for_city to return a list
    monkeypatch.setattr("app.routes.api_postcode_routes.get_postcode", lambda city, street, number: None)
    monkeypatch.setattr("app.routes.api_postcode_routes.get_postcodes_for_city", lambda city: ["12-345", "12-346"])
    resp = seeded_client.get("/api/postcode/search?city=Warsaw", headers=auth_header)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["type"] == "list"
    assert "postcodes" in data
    assert len(data["postcodes"]) == 2

def test_search_postcode_not_found(seeded_client, auth_header, monkeypatch):
    # Both functions return None/empty
    monkeypatch.setattr("app.routes.api_postcode_routes.get_postcode", lambda city, street, number: None)
    monkeypatch.setattr("app.routes.api_postcode_routes.get_postcodes_for_city", lambda city: [])
    resp = seeded_client.get("/api/postcode/search?city=Nowhere", headers=auth_header)
    assert resp.status_code == 404
    data = resp.get_json()
    assert "error" in data

def test_search_city_by_postcode_success(seeded_client, auth_header, monkeypatch):
    # Mock get_city_for_postcode to return a list of cities
    monkeypatch.setattr("app.routes.api_postcode_routes.get_city_for_postcode", lambda postcode: ["Warsaw"])
    resp = seeded_client.get("/api/postcode/city/12-345", headers=auth_header)
    assert resp.status_code == 200
    data = resp.get_json()
    assert "cities" in data
    assert data["cities"] == ["Warsaw"]

def test_search_city_by_postcode_invalid_format(seeded_client, auth_header):
    # Invalid postcode format
    resp = seeded_client.get("/api/postcode/city/12345", headers=auth_header)
    assert resp.status_code == 400
    data = resp.get_json()
    assert "error" in data

def test_search_city_by_postcode_not_found(seeded_client, auth_header, monkeypatch):
    # get_city_for_postcode returns empty
    monkeypatch.setattr("app.routes.api_postode_routes.get_city_for_postcode", lambda postcode: [])
    resp = seeded_client.get("/api/postcode/city/12-345", headers=auth_header)
    assert resp.status_code == 404
    data = resp.get_json()
    assert "error" in data

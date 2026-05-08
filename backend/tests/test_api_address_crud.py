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

# --- Country CRUD ---
def test_country_crud(seeded_client, auth_header):
    # Create
    resp = seeded_client.post("/api/address/countries", json={"name": "Testland", "shortcut": "TL"}, headers=auth_header)
    assert resp.status_code == 201
    country = resp.get_json()["country"]
    country_id = country["id"]
    # List
    resp = seeded_client.get("/api/address/countries", headers=auth_header)
    assert resp.status_code == 200
    assert any(c["name"] == "Testland" for c in resp.get_json())
    # Update status
    resp = seeded_client.patch(f"/api/address/countries/{country_id}/status", json={"is_active": False}, headers=auth_header)
    assert resp.status_code == 200
    assert resp.get_json()["is_active"] is False

# --- City CRUD ---
def test_city_crud(seeded_client, auth_header):
    # Create
    resp = seeded_client.post("/api/address/cities", json={"name": "Test City"}, headers=auth_header)
    assert resp.status_code == 201
    city = resp.get_json()["city"]
    city_id = city["id"]
    # List
    resp = seeded_client.get("/api/address/cities", headers=auth_header)
    assert resp.status_code == 200
    assert any(c["name"] == "Test City" for c in resp.get_json()["items"])
    # Get single
    resp = seeded_client.get(f"/api/address/cities/{city_id}", headers=auth_header)
    assert resp.status_code == 200
    # Update
    resp = seeded_client.put(f"/api/address/cities/{city_id}", json={"name": "Updated City", "is_active": False}, headers=auth_header)
    assert resp.status_code == 200
    assert resp.get_json()["city"]["name"] == "Updated City"
    # Delete
    resp = seeded_client.delete(f"/api/address/cities/{city_id}", headers=auth_header)
    assert resp.status_code == 200

# --- District CRUD ---
def test_district_crud(seeded_client, auth_header):
    # Create
    resp = seeded_client.post("/api/address/districts", json={"name": "Test District"}, headers=auth_header)
    assert resp.status_code == 201
    district = resp.get_json()["district"]
    district_id = district["id"]
    # List
    resp = seeded_client.get("/api/address/districts", headers=auth_header)
    assert resp.status_code == 200
    assert any(d["name"] == "Test District" for d in resp.get_json()["items"])
    # Get single
    resp = seeded_client.get(f"/api/address/districts/{district_id}", headers=auth_header)
    assert resp.status_code == 200
    # Update
    resp = seeded_client.put(f"/api/address/districts/{district_id}", json={"name": "Updated District", "is_active": False}, headers=auth_header)
    assert resp.status_code == 200
    assert resp.get_json()["district"]["name"] == "Updated District"
    # Update status
    resp = seeded_client.patch(f"/api/address/districts/{district_id}/status", json={"is_active": True}, headers=auth_header)
    assert resp.status_code == 200
    assert resp.get_json()["is_active"] is True
    # Delete
    resp = seeded_client.delete(f"/api/address/districts/{district_id}", headers=auth_header)
    assert resp.status_code == 200

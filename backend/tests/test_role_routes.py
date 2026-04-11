
import pytest

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

def test_get_roles_returns_list(seeded_client, auth_header):
    resp = seeded_client.get("/api/roles", headers=auth_header)
    assert resp.status_code == 200
    assert resp.is_json
    assert isinstance(resp.get_json(), list)


def test_add_role_missing_role_name(seeded_client, auth_header):
    resp = seeded_client.post("/api/roles", json={}, headers=auth_header)
    assert resp.status_code == 400
    assert resp.get_json()["error"] == "Field 'role_name' is required"


def test_add_role_success(seeded_client, auth_header):
    resp = seeded_client.post("/api/roles", json={"role_name": "Test Role"}, headers=auth_header)
    assert resp.status_code == 201
    data = resp.get_json()
    assert data["message"] == "Role created"
    assert data["role"]["role_name"] == "Test Role"
    assert "id" in data["role"]


def test_get_role_not_found(seeded_client, auth_header):
    resp = seeded_client.get("/api/roles/999999", headers=auth_header)
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "Role not found"


def test_get_role_success(seeded_client, auth_header):
    created = seeded_client.post("/api/roles", json={"role_name": "Role For Get"}, headers=auth_header)
    role_id = created.get_json()["role"]["id"]

    resp = seeded_client.get(f"/api/roles/{role_id}", headers=auth_header)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["id"] == role_id
    assert data["role_name"] == "Role For Get"


def test_update_role_not_found(seeded_client, auth_header):
    resp = seeded_client.put("/api/roles/999999", json={"role_name": "X"}, headers=auth_header)
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "Role not found"


def test_update_role_success(seeded_client, auth_header):
    created = seeded_client.post("/api/roles", json={"role_name": "Role To Update"}, headers=auth_header)
    role_id = created.get_json()["role"]["id"]

    resp = seeded_client.put(f"/api/roles/{role_id}", json={"role_name": "Updated Role", "active": False}, headers=auth_header)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["message"] == "Role updated"
    assert data["role"]["id"] == role_id
    assert data["role"]["role_name"] == "Updated Role"
    assert data["role"]["active"] is False


def test_delete_role_not_found(seeded_client, auth_header):
    resp = seeded_client.delete("/api/roles/999999", headers=auth_header)
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "Role not found"


def test_delete_role_success(seeded_client, auth_header):
    created = seeded_client.post("/api/roles", json={"role_name": "Role To Delete"}, headers=auth_header)
    role_id = created.get_json()["role"]["id"]

    resp = seeded_client.delete(f"/api/roles/{role_id}", headers=auth_header)
    assert resp.status_code == 200
    assert resp.get_json()["message"] == "Role deleted"

    resp2 = seeded_client.get(f"/api/roles/{role_id}", headers=auth_header)
    assert resp2.status_code == 404

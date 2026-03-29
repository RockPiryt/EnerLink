
BASE = "/api/users"

def get_token(seeded_client):
    # Use a valid test user from the seeded database
    resp = seeded_client.post("/api/login", json={
        "email": "david.wilson@enerlink.com",
        "password": "analyst123"
    })
    assert resp.status_code == 200, f"Login failed: {resp.data}"
    return resp.get_json()["token"]

import pytest

@pytest.fixture()
def auth_header(seeded_client):
    token = get_token(seeded_client)
    return {"Authorization": f"Bearer {token}"}

def _create_user(seeded_client, username, email, headers):
    return seeded_client.post(BASE, json={
        "username": username,
        "email": email,
        "password": "Secret123!",
        "first_name": "Test",
        "last_name": "User"
    }, headers=headers)


def test_get_users_returns_paginated_object(seeded_client, auth_header):
    resp = seeded_client.get(BASE, headers=auth_header)
    assert resp.status_code == 200
    data = resp.get_json()
    assert isinstance(data, dict)
    assert "items" in data
    assert isinstance(data["items"], list)
    assert "page" in data
    assert "per_page" in data
    assert "total" in data
    assert "pages" in data


def test_create_user_missing_fields(seeded_client, auth_header):
    resp = seeded_client.post(BASE, json={}, headers=auth_header)
    assert resp.status_code == 400


def test_create_user_success(seeded_client, auth_header):
    resp = _create_user(seeded_client, "testuser1", "test1@example.com", auth_header)
    assert resp.status_code == 201
    data = resp.get_json()
    assert data["username"] == "testuser1"
    assert data["email"] == "test1@example.com"
    assert data["active"] is True
    assert "id" in data


def test_create_user_duplicate(seeded_client, auth_header):
    payload_user = ("dupuser", "dup@example.com")
    r1 = _create_user(seeded_client, *payload_user, auth_header)
    assert r1.status_code == 201
    r2 = _create_user(seeded_client, *payload_user, auth_header)
    assert r2.status_code == 409


def test_get_single_user(seeded_client, auth_header):
    r = _create_user(seeded_client, "single", "single@example.com", auth_header)
    uid = r.get_json()["id"]
    resp = seeded_client.get(f"{BASE}/{uid}", headers=auth_header)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["id"] == uid
    assert data["username"] == "single"


def test_update_user_patch(seeded_client, auth_header):
    r = _create_user(seeded_client, "patchme", "patch@example.com", auth_header)
    uid = r.get_json()["id"]
    resp = seeded_client.patch(f"{BASE}/{uid}", json={
        "first_name": "Patched",
        "active": False
    }, headers=auth_header)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["first_name"] == "Patched"
    assert data["active"] is False


def test_update_user_conflict(seeded_client, auth_header):
    _create_user(seeded_client, "user1", "u1@example.com", auth_header)
    r2 = _create_user(seeded_client, "user2", "u2@example.com", auth_header)
    uid2 = r2.get_json()["id"]
    resp = seeded_client.patch(f"{BASE}/{uid2}", json={"email": "u1@example.com"}, headers=auth_header)
    assert resp.status_code == 409


def test_soft_delete_user(seeded_client, auth_header):
    r = _create_user(seeded_client, "todelete", "todelete@example.com", auth_header)
    uid = r.get_json()["id"]
    d = seeded_client.delete(f"{BASE}/{uid}", headers=auth_header)
    assert d.status_code == 204
    g = seeded_client.get(f"{BASE}/{uid}", headers=auth_header)
    assert g.status_code == 200
    assert g.get_json()["active"] is False


def test_activate_user(seeded_client, auth_header):
    r = _create_user(seeded_client, "inactive", "inactive@example.com", auth_header)
    uid = r.get_json()["id"]
    seeded_client.delete(f"{BASE}/{uid}", headers=auth_header)
    resp = seeded_client.patch(f"{BASE}/{uid}/activate", headers=auth_header)
    assert resp.status_code == 200
    assert resp.get_json()["user"]["active"] is True


def test_reset_password(seeded_client, auth_header):
    r = _create_user(seeded_client, "resetme", "reset@example.com", auth_header)
    uid = r.get_json()["id"]
    resp = seeded_client.post(f"{BASE}/{uid}/reset-password", json={"password": "NewSecret123!"}, headers=auth_header)
    assert resp.status_code == 200
    assert resp.get_json()["message"] == "Password reset successfully"


def test_replace_user_put(seeded_client, auth_header):
    r = _create_user(seeded_client, "replace", "replace@example.com", auth_header)
    uid = r.get_json()["id"]
    resp = seeded_client.put(f"{BASE}/{uid}", json={
        "username": "replaced",
        "email": "replaced@example.com",
        "first_name": "Re",
        "last_name": "Placed",
        "role_name": "Analyst",
        "active": True,
        "password": "AnotherPass123"
    }, headers=auth_header)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["username"] == "replaced"
    assert data["email"] == "replaced@example.com"

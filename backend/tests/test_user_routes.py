BASE = "/api/users"


def _create_user(client, username, email):
    return client.post(BASE, json={
        "username": username,
        "email": email,
        "password": "Secret123!",
        "first_name": "Test",
        "last_name": "User"
    })


def test_get_users_returns_paginated_object(client):
    resp = client.get(BASE)
    assert resp.status_code == 200

    data = resp.get_json()
    assert isinstance(data, dict)
    assert "items" in data
    assert isinstance(data["items"], list)
    assert "page" in data
    assert "per_page" in data
    assert "total" in data
    assert "pages" in data


def test_create_user_missing_fields(client):
    resp = client.post(BASE, json={})
    assert resp.status_code == 400


def test_create_user_success(client):
    resp = _create_user(client, "testuser1", "test1@example.com")
    assert resp.status_code == 201

    data = resp.get_json()
    assert data["username"] == "testuser1"
    assert data["email"] == "test1@example.com"
    assert data["active"] is True
    assert "id" in data


def test_create_user_duplicate(client):
    payload_user = ("dupuser", "dup@example.com")

    r1 = _create_user(client, *payload_user)
    assert r1.status_code == 201

    r2 = _create_user(client, *payload_user)
    assert r2.status_code == 409


def test_get_single_user(client):
    r = _create_user(client, "single", "single@example.com")
    uid = r.get_json()["id"]

    resp = client.get(f"{BASE}/{uid}")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["id"] == uid
    assert data["username"] == "single"


def test_update_user_patch(client):
    r = _create_user(client, "patchme", "patch@example.com")
    uid = r.get_json()["id"]

    resp = client.patch(f"{BASE}/{uid}", json={
        "first_name": "Patched",
        "active": False
    })
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["first_name"] == "Patched"
    assert data["active"] is False


def test_update_user_conflict(client):
    _create_user(client, "user1", "u1@example.com")
    r2 = _create_user(client, "user2", "u2@example.com")
    uid2 = r2.get_json()["id"]
    resp = client.patch(f"{BASE}/{uid2}", json={"email": "u1@example.com"})
    assert resp.status_code == 409


def test_soft_delete_user(client):
    r = _create_user(client, "todelete", "todelete@example.com")
    uid = r.get_json()["id"]

    d = client.delete(f"{BASE}/{uid}")
    assert d.status_code == 204

    g = client.get(f"{BASE}/{uid}")
    assert g.status_code == 200
    assert g.get_json()["active"] is False


def test_activate_user(client):
    r = _create_user(client, "inactive", "inactive@example.com")
    uid = r.get_json()["id"]

    client.delete(f"{BASE}/{uid}")

    resp = client.patch(f"{BASE}/{uid}/activate")
    assert resp.status_code == 200
    assert resp.get_json()["user"]["active"] is True


def test_reset_password(client):
    r = _create_user(client, "resetme", "reset@example.com")
    uid = r.get_json()["id"]

    resp = client.post(f"{BASE}/{uid}/reset-password", json={"password": "NewSecret123!"})
    assert resp.status_code == 200
    assert resp.get_json()["message"] == "Password reset successfully"


def test_replace_user_put(client):
    r = _create_user(client, "replace", "replace@example.com")
    uid = r.get_json()["id"]

    resp = client.put(f"{BASE}/{uid}", json={
        "username": "replaced",
        "email": "replaced@example.com",
        "first_name": "Re",
        "last_name": "Placed",
        "role_name": "Analyst",
        "active": True,
        "password": "AnotherPass123"
    })
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["username"] == "replaced"
    assert data["email"] == "replaced@example.com"

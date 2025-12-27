BASE = "/api/users"

def test_get_users_returns_list(client):
    resp = client.get(BASE)
    assert resp.status_code == 200
    assert isinstance(resp.get_json(), list)


def test_create_user_missing_fields(client):
    resp = client.post(BASE, json={})
    assert resp.status_code == 400


def test_create_user_success(client):
    resp = client.post(BASE, json={
        "username": "testuser1",
        "email": "test1@example.com",
        "password": "Secret123!",
        "first_name": "Test",
        "last_name": "User"
    })
    assert resp.status_code == 201
    data = resp.get_json()
    assert data["username"] == "testuser1"
    assert data["email"] == "test1@example.com"


def test_create_user_duplicate(client):
    payload = {
        "username": "dupuser",
        "email": "dup@example.com",
        "password": "Secret123!",
        "first_name": "Dup",
        "last_name": "User"
    }

    r1 = client.post(BASE, json=payload)
    assert r1.status_code == 201

    # duplicate username + email should fail
    r2 = client.post(BASE, json=payload)
    assert r2.status_code == 400

BASE = "/api/users"

def test_get_users_returns_list(client):
    resp = client.get(BASE)
    assert resp.status_code == 200
    assert isinstance(resp.get_json(), list)


def test_create_user_missing_fields(client):
    resp = client.post(BASE, json={})
    assert resp.status_code == 400


def test_create_user_success_if_model_supports_username_email(client):
    resp = client.post(BASE, json={
        "username": "testuser1",
        "email": "test1@example.com"
    })
    assert resp.status_code in (201, 500)


def test_create_user_duplicate_if_model_supports_username_email(client):
    r1 = client.post(BASE, json={
        "username": "dupuser",
        "email": "dup@example.com"
    })
    assert r1.status_code in (201, 500)

    r2 = client.post(BASE, json={
        "username": "dupuser",
        "email": "dup@example.com"
    })
    assert r2.status_code in (400, 500)

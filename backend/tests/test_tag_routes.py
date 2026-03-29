
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

def test_get_tags_returns_list(seeded_client, auth_header):
    resp = seeded_client.get("/api/tags", headers=auth_header)
    assert resp.status_code == 200
    assert resp.is_json
    assert isinstance(resp.get_json(), list)


def test_add_tag_missing_name(seeded_client, auth_header):
    resp = seeded_client.post("/api/tags", json={}, headers=auth_header)
    assert resp.status_code == 400
    assert resp.get_json()["error"] == "Tag name is required"


def test_add_tag_success(seeded_client, auth_header):
    resp = seeded_client.post("/api/tags", json={"name": "Test Tag"}, headers=auth_header)
    assert resp.status_code == 201
    data = resp.get_json()
    assert data["message"] == "Tag added"
    assert data["tag"]["name"] == "Test Tag"
    assert "id" in data["tag"]


def test_add_tag_duplicate_returns_409(seeded_client, auth_header):
    r1 = seeded_client.post("/api/tags", json={"name": "Duplicate Tag"}, headers=auth_header)
    assert r1.status_code in (201, 409)
    r2 = seeded_client.post("/api/tags", json={"name": "Duplicate Tag"}, headers=auth_header)
    assert r2.status_code == 409
    assert r2.get_json()["error"] in ("Tag already exists",)

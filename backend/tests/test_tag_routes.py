def test_get_tags_returns_list(client):
    resp = client.get("/tags")
    assert resp.status_code == 200
    assert resp.is_json
    assert isinstance(resp.get_json(), list)


def test_add_tag_missing_name(client):
    resp = client.post("/tags", json={})
    assert resp.status_code == 400
    assert resp.get_json()["error"] == "Tag name is required"


def test_add_tag_success(client):
    resp = client.post("/tags", json={"name": "Test Tag"})
    assert resp.status_code == 201
    data = resp.get_json()
    assert data["message"] == "Tag added"
    assert data["tag"]["name"] == "Test Tag"
    assert "id" in data["tag"]


def test_add_tag_duplicate_returns_409(client):
    r1 = client.post("/tags", json={"name": "Duplicate Tag"})
    assert r1.status_code in (201, 409)

    r2 = client.post("/tags", json={"name": "Duplicate Tag"})
    assert r2.status_code == 409
    assert r2.get_json()["error"] in ("Tag already exists",)

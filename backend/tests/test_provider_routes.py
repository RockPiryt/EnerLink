def test_get_providers_returns_list(client):
    resp = client.get("/api/providers")
    assert resp.status_code == 200
    assert resp.is_json
    assert isinstance(resp.get_json(), list)


def test_add_provider_missing_name(client):
    resp = client.post("/api/providers", json={})
    assert resp.status_code == 400
    assert resp.get_json()["error"] == "Field 'name' is required"


def test_add_provider_success(client):
    payload = {"name": "Test Provider Sp. z o.o."}
    resp = client.post("/api/providers", json=payload)
    assert resp.status_code == 201
    data = resp.get_json()
    assert data["message"] == "Provider added"
    assert data["provider"]["name"] == "Test Provider Sp. z o.o."
    assert "id" in data["provider"]


def test_add_provider_duplicate_name_returns_409(client):
    payload = {"name": "Duplicate Provider"}

    r1 = client.post("/api/providers", json=payload)
    assert r1.status_code == 201

    r2 = client.post("/api/providers", json=payload)
    assert r2.status_code == 409
    assert r2.get_json()["error"] == "Provider already exists"

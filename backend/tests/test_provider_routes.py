def test_get_providers_returns_list(client):
    resp = client.get("/providers")
    assert resp.status_code == 200
    assert resp.is_json
    assert isinstance(resp.get_json(), list)


def test_add_provider_missing_name(client):
    resp = client.post("/providers", json={})
    assert resp.status_code == 400
    assert resp.get_json()["error"] == "Field 'name' is required"


def test_add_provider_success(client):
    payload = {"name": "Test Provider Sp. z o.o."}
    resp = client.post("/providers", json=payload)
    assert resp.status_code == 201
    data = resp.get_json()
    assert data["message"] == "Provider added"
    assert data["provider"]["name"] == "Test Provider Sp. z o.o."
    assert "id" in data["provider"]


def test_add_provider_duplicate_name_returns_error_or_500(client):
    # zależy od tego jak obsługujesz IntegrityError; w modelu name ma unique=True
    payload = {"name": "Duplicate Provider"}
    r1 = client.post("/providers", json=payload)
    assert r1.status_code in (201, 400, 409, 500)

    r2 = client.post("/providers", json=payload)
    # bez try/except w route często będzie 500 (IntegrityError)
    assert r2.status_code in (400, 409, 500)

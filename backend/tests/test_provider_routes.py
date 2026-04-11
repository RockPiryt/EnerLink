
import pytest
from app.db import db
from app.models.supplier_model import EnergySupplier

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


# ---------- helpers ----------
def clear_providers():
    db.session.query(EnergySupplier).delete(synchronize_session=False)
    db.session.commit()
    db.session.expire_all()


def seed_providers(names):
    for name in names:
        db.session.add(EnergySupplier(name=name))
    db.session.commit()
    db.session.expire_all()


# ---------- tests ----------
def test_get_providers_returns_list(seeded_client, auth_header):
    resp = seeded_client.get("/api/providers", headers=auth_header)
    assert resp.status_code == 200
    assert resp.is_json
    data = resp.get_json()
    assert isinstance(data, list)


def test_get_providers_returns_seeded_items(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_providers()
        seed_providers(["A Provider", "B Provider"])

    resp = seeded_client.get("/api/providers", headers=auth_header)
    assert resp.status_code == 200
    data = resp.get_json()

    assert isinstance(data, list)
    assert len(data) == 2
    assert {x["name"] for x in data} == {"A Provider", "B Provider"}


def test_add_provider_missing_name(seeded_client, auth_header):
    resp = seeded_client.post("/api/providers", json={}, headers=auth_header)
    assert resp.status_code == 400
    assert resp.get_json()["error"] == "Field 'name' is required"


def test_add_provider_success(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_providers()

    payload = {"name": "Test Provider Sp. z o.o."}
    resp = seeded_client.post("/api/providers", json=payload, headers=auth_header)

    assert resp.status_code == 201
    data = resp.get_json()
    assert data["message"] == "Provider added"
    assert data["provider"]["name"] == payload["name"]
    assert "id" in data["provider"]


def test_add_provider_duplicate_name_returns_409(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_providers()

    payload = {"name": "Duplicate Provider"}

    r1 = seeded_client.post("/api/providers", json=payload, headers=auth_header)
    assert r1.status_code == 201

    r2 = seeded_client.post("/api/providers", json=payload, headers=auth_header)
    assert r2.status_code == 409
    assert r2.get_json()["error"] == "Provider already exists"


def test_get_provider_not_found(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_providers()

    resp = seeded_client.get("/api/providers/999999", headers=auth_header)
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "Provider not found"


def test_get_provider_success(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_providers()

    r = seeded_client.post("/api/providers", json={"name": "Provider X"}, headers=auth_header)
    assert r.status_code == 201
    provider_id = r.get_json()["provider"]["id"]

    resp = seeded_client.get(f"/api/providers/{provider_id}", headers=auth_header)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["id"] == provider_id
    assert data["name"] == "Provider X"


def test_update_provider_not_found(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_providers()

    resp = seeded_client.put("/api/providers/999999", json={"name": "New Name"}, headers=auth_header)
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "Provider not found"


def test_update_provider_success(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_providers()

    r = seeded_client.post("/api/providers", json={"name": "Old Name"}, headers=auth_header)
    assert r.status_code == 201
    provider_id = r.get_json()["provider"]["id"]

    resp = seeded_client.put(f"/api/providers/{provider_id}", json={"name": "New Name"}, headers=auth_header)
    assert resp.status_code == 200

    data = resp.get_json()
    assert data["message"] == "Provider updated"
    assert data["provider"]["id"] == provider_id
    assert data["provider"]["name"] == "New Name"


def test_update_provider_duplicate_name_returns_409(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_providers()

    # create two providers
    r1 = seeded_client.post("/api/providers", json={"name": "Provider A"}, headers=auth_header)
    assert r1.status_code == 201
    id_a = r1.get_json()["provider"]["id"]

    r2 = seeded_client.post("/api/providers", json={"name": "Provider B"}, headers=auth_header)
    assert r2.status_code == 201

    # try rename A -> B (duplicate)
    resp = seeded_client.put(f"/api/providers/{id_a}", json={"name": "Provider B"}, headers=auth_header)
    assert resp.status_code == 409
    assert resp.get_json()["error"] == "Provider name already exists"


def test_delete_provider_not_found(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_providers()

    resp = seeded_client.delete("/api/providers/999999", headers=auth_header)
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "Provider not found"


def test_delete_provider_success(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_providers()

    r = seeded_client.post("/api/providers", json={"name": "To Delete"}, headers=auth_header)
    assert r.status_code == 201
    provider_id = r.get_json()["provider"]["id"]

    resp = seeded_client.delete(f"/api/providers/{provider_id}", headers=auth_header)
    assert resp.status_code == 200
    assert resp.get_json()["message"] == "Provider deleted successfully"

    # verify it's gone
    resp2 = seeded_client.get(f"/api/providers/{provider_id}", headers=auth_header)
    assert resp2.status_code == 404

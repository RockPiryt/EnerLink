import pytest

from app.db import db
from app.models.supplier_model import EnergySupplier


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
def test_get_providers_returns_list(client):
    resp = client.get("/api/providers")
    assert resp.status_code == 200
    assert resp.is_json
    data = resp.get_json()
    assert isinstance(data, list)


def test_get_providers_returns_seeded_items(client, app):
    with app.app_context():
        clear_providers()
        seed_providers(["A Provider", "B Provider"])

    resp = client.get("/api/providers")
    assert resp.status_code == 200
    data = resp.get_json()

    assert isinstance(data, list)
    assert len(data) == 2
    assert {x["name"] for x in data} == {"A Provider", "B Provider"}


def test_add_provider_missing_name(client):
    resp = client.post("/api/providers", json={})
    assert resp.status_code == 400
    assert resp.get_json()["error"] == "Field 'name' is required"


def test_add_provider_success(client, app):
    with app.app_context():
        clear_providers()

    payload = {"name": "Test Provider Sp. z o.o."}
    resp = client.post("/api/providers", json=payload)

    assert resp.status_code == 201
    data = resp.get_json()
    assert data["message"] == "Provider added"
    assert data["provider"]["name"] == payload["name"]
    assert "id" in data["provider"]


def test_add_provider_duplicate_name_returns_409(client, app):
    with app.app_context():
        clear_providers()

    payload = {"name": "Duplicate Provider"}

    r1 = client.post("/api/providers", json=payload)
    assert r1.status_code == 201

    r2 = client.post("/api/providers", json=payload)
    assert r2.status_code == 409
    assert r2.get_json()["error"] == "Provider already exists"


def test_get_provider_not_found(client, app):
    with app.app_context():
        clear_providers()

    resp = client.get("/api/providers/999999")
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "Provider not found"


def test_get_provider_success(client, app):
    with app.app_context():
        clear_providers()

    r = client.post("/api/providers", json={"name": "Provider X"})
    assert r.status_code == 201
    provider_id = r.get_json()["provider"]["id"]

    resp = client.get(f"/api/providers/{provider_id}")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["id"] == provider_id
    assert data["name"] == "Provider X"


def test_update_provider_not_found(client, app):
    with app.app_context():
        clear_providers()

    resp = client.put("/api/providers/999999", json={"name": "New Name"})
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "Provider not found"


def test_update_provider_success(client, app):
    with app.app_context():
        clear_providers()

    r = client.post("/api/providers", json={"name": "Old Name"})
    assert r.status_code == 201
    provider_id = r.get_json()["provider"]["id"]

    resp = client.put(f"/api/providers/{provider_id}", json={"name": "New Name"})
    assert resp.status_code == 200

    data = resp.get_json()
    assert data["message"] == "Provider updated"
    assert data["provider"]["id"] == provider_id
    assert data["provider"]["name"] == "New Name"


def test_update_provider_duplicate_name_returns_409(client, app):
    with app.app_context():
        clear_providers()

    # create two providers
    r1 = client.post("/api/providers", json={"name": "Provider A"})
    assert r1.status_code == 201
    id_a = r1.get_json()["provider"]["id"]

    r2 = client.post("/api/providers", json={"name": "Provider B"})
    assert r2.status_code == 201

    # try rename A -> B (duplicate)
    resp = client.put(f"/api/providers/{id_a}", json={"name": "Provider B"})
    assert resp.status_code == 409
    assert resp.get_json()["error"] == "Provider name already exists"


def test_delete_provider_not_found(client, app):
    with app.app_context():
        clear_providers()

    resp = client.delete("/api/providers/999999")
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "Provider not found"


def test_delete_provider_success(client, app):
    with app.app_context():
        clear_providers()

    r = client.post("/api/providers", json={"name": "To Delete"})
    assert r.status_code == 201
    provider_id = r.get_json()["provider"]["id"]

    resp = client.delete(f"/api/providers/{provider_id}")
    assert resp.status_code == 200
    assert resp.get_json()["message"] == "Provider deleted successfully"

    # verify it's gone
    resp2 = client.get(f"/api/providers/{provider_id}")
    assert resp2.status_code == 404

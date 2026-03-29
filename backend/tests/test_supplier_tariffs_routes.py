from app.db import db
from app.models.supplier_model import EnergyTariff


# ---------- helpers ----------

def clear_tariffs():
    db.session.query(EnergyTariff).delete()
    db.session.commit()


def seed_tariffs(items):
    """
    items: list of tuples (name, is_active)
    """
    for name, is_active in items:
        db.session.add(EnergyTariff(name=name, is_active=is_active))
    db.session.commit()


# ---------- tests ----------


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

def test_get_tariffs_empty(seeded_client, seeded_app, auth_header):
    # This test expects an empty list, so we must clear seeded data first.
    with seeded_app.app_context():
        clear_tariffs()

    resp = seeded_client.get("/api/supplier/tariffs", headers=auth_header)
    assert resp.status_code == 200

    data = resp.get_json()
    assert data["items"] == []
    assert data["total"] == 0
    assert data["pages"] == 0
    assert data["current_page"] == 1
    assert data["per_page"] == 20


def test_add_tariff_validation(seeded_client, seeded_app, auth_header):
    # make deterministic
    with seeded_app.app_context():
        clear_tariffs()

    resp = seeded_client.post("/api/supplier/tariffs", json={}, headers=auth_header)
    assert resp.status_code == 400
    assert resp.get_json()["error"] == "name is required"


def test_add_tariff_success(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_tariffs()

    resp = seeded_client.post("/api/supplier/tariffs", json={"name": "Tariff A"}, headers=auth_header)
    assert resp.status_code == 201

    data = resp.get_json()
    assert data["message"] == "Tariff added"
    assert "tariff" in data
    assert data["tariff"]["name"] == "Tariff A"
    assert data["tariff"]["is_active"] is True
    assert "id" in data["tariff"]


def test_get_tariff_not_found(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_tariffs()

    resp = seeded_client.get("/api/supplier/tariffs/999999", headers=auth_header)
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "Tariff not found"


def test_get_tariff_success(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_tariffs()

    resp = seeded_client.post("/api/supplier/tariffs", json={"name": "Tariff X"}, headers=auth_header)
    assert resp.status_code == 201
    tariff_id = resp.get_json()["tariff"]["id"]

    resp2 = seeded_client.get(f"/api/supplier/tariffs/{tariff_id}", headers=auth_header)
    assert resp2.status_code == 200
    data = resp2.get_json()
    assert data["id"] == tariff_id
    assert data["name"] == "Tariff X"
    assert data["is_active"] is True


def test_update_tariff_not_found(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_tariffs()

    resp = seeded_client.put("/api/supplier/tariffs/123456", json={"name": "New"}, headers=auth_header)
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "Tariff not found"


def test_update_tariff_success(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_tariffs()

    resp = seeded_client.post("/api/supplier/tariffs", json={"name": "Tariff Old"}, headers=auth_header)
    assert resp.status_code == 201
    tariff_id = resp.get_json()["tariff"]["id"]

    resp2 = seeded_client.put(
        f"/api/supplier/tariffs/{tariff_id}",
        json={"name": "Tariff New", "is_active": False},
        headers=auth_header
    )
    assert resp2.status_code == 200

    data = resp2.get_json()
    assert data["message"] == "Tariff updated"
    assert data["tariff"]["name"] == "Tariff New"
    assert data["tariff"]["is_active"] is False


def test_delete_tariff_not_found(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_tariffs()

    resp = seeded_client.delete("/api/supplier/tariffs/123456", headers=auth_header)
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "Tariff not found"


def test_delete_tariff_success(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_tariffs()

    resp = seeded_client.post("/api/supplier/tariffs", json={"name": "To Delete"}, headers=auth_header)
    assert resp.status_code == 201
    tariff_id = resp.get_json()["tariff"]["id"]

    resp2 = seeded_client.delete(f"/api/supplier/tariffs/{tariff_id}", headers=auth_header)
    assert resp2.status_code == 200
    assert resp2.get_json()["message"] == "Tariff deleted successfully"

    resp3 = seeded_client.get(f"/api/supplier/tariffs/{tariff_id}", headers=auth_header)
    assert resp3.status_code == 404


def test_get_tariffs_pagination(seeded_client, seeded_app, auth_header):
    # This test expects exactly 50 total items => clear first.
    with seeded_app.app_context():
        clear_tariffs()
        seed_tariffs([(f"Tariff {i}", True) for i in range(1, 51)])  # 50

    resp = seeded_client.get("/api/supplier/tariffs?page=1&per_page=20", headers=auth_header)
    assert resp.status_code == 200
    data = resp.get_json()
    assert len(data["items"]) == 20
    assert data["total"] == 50
    assert data["pages"] == 3
    assert data["current_page"] == 1
    assert data["per_page"] == 20

    resp2 = seeded_client.get("/api/supplier/tariffs?page=3&per_page=20", headers=auth_header)
    assert resp2.status_code == 200
    data2 = resp2.get_json()
    assert len(data2["items"]) == 10
    assert data2["current_page"] == 3


def test_get_tariffs_search(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_tariffs()
        seed_tariffs([
            ("Standard Plan", True),
            ("Premium Plan", True),
            ("Night Saver", False),
        ])

    resp = seeded_client.get("/api/supplier/tariffs?q=Prem", headers=auth_header)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["total"] == 1
    assert data["items"][0]["name"] == "Premium Plan"


def test_get_tariffs_filter_active_true(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_tariffs()
        seed_tariffs([
            ("A", True),
            ("B", False),
            ("C", True),
        ])

    resp = seeded_client.get("/api/supplier/tariffs?active=true", headers=auth_header)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["total"] == 2
    assert all(item["is_active"] is True for item in data["items"])


def test_get_tariffs_filter_active_false(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_tariffs()
        seed_tariffs([
            ("A", True),
            ("B", False),
            ("C", False),
        ])

    resp = seeded_client.get("/api/supplier/tariffs?active=false", headers=auth_header)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["total"] == 2
    assert all(item["is_active"] is False for item in data["items"])


def test_patch_tariff_status_not_found(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_tariffs()

    resp = seeded_client.patch("/api/supplier/tariffs/999999/status", json={"is_active": True}, headers=auth_header)
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "Tariff not found"


def test_patch_tariff_status_validation(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_tariffs()

    resp = seeded_client.post("/api/supplier/tariffs", json={"name": "Tariff S"}, headers=auth_header)
    assert resp.status_code == 201
    tariff_id = resp.get_json()["tariff"]["id"]

    resp2 = seeded_client.patch(f"/api/supplier/tariffs/{tariff_id}/status", json={}, headers=auth_header)
    assert resp2.status_code == 400
    assert resp2.get_json()["error"] == "'is_active' field is required"


def test_patch_tariff_status_success(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_tariffs()

    resp = seeded_client.post("/api/supplier/tariffs", json={"name": "Tariff Status"}, headers=auth_header)
    assert resp.status_code == 201
    tariff_id = resp.get_json()["tariff"]["id"]

    # set inactive
    resp2 = seeded_client.patch(f"/api/supplier/tariffs/{tariff_id}/status", json={"is_active": False}, headers=auth_header)
    assert resp2.status_code == 200
    data = resp2.get_json()
    assert data["message"] == "Tariff status updated"
    assert data["is_active"] is False

    # set active again
    resp3 = seeded_client.patch(f"/api/supplier/tariffs/{tariff_id}/status", json={"is_active": True}, headers=auth_header)
    assert resp3.status_code == 200
    data3 = resp3.get_json()
    assert data3["is_active"] is True

import pytest
from app.db import db
from app.models.pkwiu_model import Pkwiu


def seed_pkwiu(items):
    """
    Helper to seed PKWiU records quickly.
    items: list of tuples (pkwiu_nr, pkwiu_name)
    """
    for nr, name in items:
        db.session.add(Pkwiu(pkwiu_nr=nr, pkwiu_name=name))
    db.session.commit()


def test_get_pkwiu_empty(client):
    resp = client.get("/api/pkwiu")
    assert resp.status_code == 200

    data = resp.get_json()
    assert data["items"] == []
    assert data["total"] == 0
    assert data["pages"] == 0
    assert data["current_page"] == 1
    assert data["per_page"] == 20


def test_add_pkwiu_validation(client):
    # missing both fields
    resp = client.post("/api/pkwiu", json={})
    assert resp.status_code == 400
    assert "error" in resp.get_json()

    # missing pkwiu_name
    resp = client.post("/api/pkwiu", json={"pkwiu_nr": "01.11"})
    assert resp.status_code == 400

    # missing pkwiu_nr
    resp = client.post("/api/pkwiu", json={"pkwiu_name": "Some name"})
    assert resp.status_code == 400


def test_add_pkwiu_success(client):
    payload = {"pkwiu_nr": "01.11", "pkwiu_name": "Uprawa zbóż"}
    resp = client.post("/api/pkwiu", json=payload)
    assert resp.status_code == 201

    data = resp.get_json()
    assert data["message"] == "PKWiU added"
    assert "pkwiu" in data
    assert data["pkwiu"]["pkwiu_nr"] == "01.11"
    assert data["pkwiu"]["pkwiu_name"] == "Uprawa zbóż"


def test_get_pkwiu_item_not_found(client):
    resp = client.get("/api/pkwiu/999999")
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "PKWiU not found"


def test_get_pkwiu_item_success(client):
    # create
    resp = client.post("/api/pkwiu", json={"pkwiu_nr": "10.20", "pkwiu_name": "Przetwórstwo"})
    assert resp.status_code == 201
    pkwiu_id = resp.get_json()["pkwiu"]["id"]

    # read
    resp2 = client.get(f"/api/pkwiu/{pkwiu_id}")
    assert resp2.status_code == 200
    item = resp2.get_json()
    assert item["id"] == pkwiu_id
    assert item["pkwiu_nr"] == "10.20"
    assert item["pkwiu_name"] == "Przetwórstwo"


def test_update_pkwiu_not_found(client):
    resp = client.put("/api/pkwiu/123456", json={"pkwiu_name": "X"})
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "PKWiU not found"


def test_update_pkwiu_partial_success(client):
    # create
    resp = client.post("/api/pkwiu", json={"pkwiu_nr": "20.30", "pkwiu_name": "Old name"})
    pkwiu_id = resp.get_json()["pkwiu"]["id"]

    # update only name
    resp2 = client.put(f"/api/pkwiu/{pkwiu_id}", json={"pkwiu_name": "New name"})
    assert resp2.status_code == 200
    data = resp2.get_json()
    assert data["message"] == "PKWiU updated"
    assert data["pkwiu"]["pkwiu_nr"] == "20.30"
    assert data["pkwiu"]["pkwiu_name"] == "New name"

    # update only nr
    resp3 = client.put(f"/api/pkwiu/{pkwiu_id}", json={"pkwiu_nr": "20.31"})
    assert resp3.status_code == 200
    data = resp3.get_json()
    assert data["pkwiu"]["pkwiu_nr"] == "20.31"
    assert data["pkwiu"]["pkwiu_name"] == "New name"


def test_delete_pkwiu_not_found(client):
    resp = client.delete("/api/pkwiu/123456")
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "PKWiU not found"


def test_delete_pkwiu_success(client):
    # create
    resp = client.post("/api/pkwiu", json={"pkwiu_nr": "30.40", "pkwiu_name": "To delete"})
    pkwiu_id = resp.get_json()["pkwiu"]["id"]

    # delete
    resp2 = client.delete(f"/api/pkwiu/{pkwiu_id}")
    assert resp2.status_code == 200
    assert resp2.get_json()["message"] == "PKWiU deleted successfully"

    # verify gone
    resp3 = client.get(f"/api/pkwiu/{pkwiu_id}")
    assert resp3.status_code == 404


def test_get_pkwiu_pagination(client, app):
    with app.app_context():
        seed_pkwiu([(f"{i:02d}.00", f"Name {i}") for i in range(1, 51)])  # 50 items

    # default per_page=20
    resp = client.get("/api/pkwiu?page=1")
    data = resp.get_json()
    assert resp.status_code == 200
    assert len(data["items"]) == 20
    assert data["total"] == 50
    assert data["pages"] == 3
    assert data["current_page"] == 1
    assert data["per_page"] == 20

    resp2 = client.get("/api/pkwiu?page=3")
    data2 = resp2.get_json()
    assert resp2.status_code == 200
    assert len(data2["items"]) == 10
    assert data2["current_page"] == 3


def test_get_pkwiu_search_by_nr(client, app):
    with app.app_context():
        seed_pkwiu([
            ("01.11", "Uprawa zbóż"),
            ("02.22", "Leśnictwo"),
            ("10.20", "Przetwórstwo")
        ])

    resp = client.get("/api/pkwiu?q=01")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["total"] == 1
    assert data["items"][0]["pkwiu_nr"] == "01.11"


def test_get_pkwiu_search_by_name(client, app):
    with app.app_context():
        seed_pkwiu([
            ("01.11", "Uprawa zbóż"),
            ("02.22", "Leśnictwo"),
            ("10.20", "Przetwórstwo")
        ])

    resp = client.get("/api/pkwiu?q=Przet")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["total"] == 1
    assert data["items"][0]["pkwiu_name"] == "Przetwórstwo"

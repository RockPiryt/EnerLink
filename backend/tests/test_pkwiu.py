from app.db import db
from app.models.pkwiu_model import Pkwiu


def seed_pkwiu(items):
    """Helper to seed PKWiU records quickly. """
    for nr, name in items:
        db.session.add(Pkwiu(pkwiu_nr=nr, pkwiu_name=name))
    db.session.commit()


def test_get_pkwiu_returns_paginated_structure(client):
    resp = client.get("/api/pkwiu")
    assert resp.status_code == 200

    data = resp.get_json()
    assert isinstance(data, dict)
    assert "items" in data
    assert "total" in data
    assert "pages" in data
    assert "current_page" in data
    assert "per_page" in data
    assert isinstance(data["items"], list)


def test_add_pkwiu_validation(client):
    # missing both fields
    resp = client.post("/api/pkwiu", json={})
    assert resp.status_code == 400
    assert resp.get_json()["error"] == "pkwiu_nr and pkwiu_name are required"

    # missing pkwiu_name
    resp = client.post("/api/pkwiu", json={"pkwiu_nr": "01.11"})
    assert resp.status_code == 400
    assert resp.get_json()["error"] == "pkwiu_nr and pkwiu_name are required"

    # missing pkwiu_nr
    resp = client.post("/api/pkwiu", json={"pkwiu_name": "Some name"})
    assert resp.status_code == 400
    assert resp.get_json()["error"] == "pkwiu_nr and pkwiu_name are required"


def test_add_pkwiu_success(client):
    payload = {"pkwiu_nr": "01.11", "pkwiu_name": "Uprawa zbóż"}
    resp = client.post("/api/pkwiu", json=payload)
    assert resp.status_code == 201

    data = resp.get_json()
    assert data["message"] == "PKWiU added"
    assert "pkwiu" in data
    assert data["pkwiu"]["pkwiu_nr"] == "01.11"
    assert data["pkwiu"]["pkwiu_name"] == "Uprawa zbóż"
    assert "id" in data["pkwiu"]


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


def test_get_pkwiu_pagination_basic(client):
    resp = client.get("/api/pkwiu?page=1&per_page=20")
    assert resp.status_code == 200
    data = resp.get_json()

    assert data["current_page"] == 1
    assert data["per_page"] == 20
    assert isinstance(data["items"], list)
    assert len(data["items"]) <= 20
    assert data["total"] >= len(data["items"])


def test_get_pkwiu_search_by_nr_matches_seeded_data(client):
    resp = client.get("/api/pkwiu?q=35.11")
    assert resp.status_code == 200
    data = resp.get_json()

    assert data["total"] >= 1
    assert any("35.11" in item["pkwiu_nr"] for item in data["items"])


def test_get_pkwiu_search_by_name_with_local_seed(client, seeded_app):
    with seeded_app.app_context():
        seed_pkwiu([
            ("99.01", "UniqueNameAlpha"),
            ("99.02", "UniqueNameBeta"),
        ])

    resp = client.get("/api/pkwiu?q=UniqueNameAlpha")
    assert resp.status_code == 200
    data = resp.get_json()

    assert data["total"] >= 1
    assert any(item["pkwiu_name"] == "UniqueNameAlpha" for item in data["items"])

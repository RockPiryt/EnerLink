
import pytest
from app.db import db
from app.models.address_model import Country, City, District
from tests.test_auth_routes import auth_header


# ---------- helpers ----------

def clear_tables(*models):
    """
    Hard-clear given tables to keep tests independent even when the DB is seeded
    or previous tests inserted records.
    """
    for m in models:
        db.session.query(m).delete()
    db.session.commit()


def seed_countries(items):
    # items: list of tuples (name, shortcut, is_active)
    for name, shortcut, is_active in items:
        db.session.add(Country(name=name, shortcut=shortcut, is_active=is_active))
    db.session.commit()


def seed_cities(items):
    # items: list of tuples (name, is_active)
    for name, is_active in items:
        db.session.add(City(name=name, is_active=is_active))
    db.session.commit()


def seed_districts(items):
    # items: list of tuples (name, is_active)
    for name, is_active in items:
        db.session.add(District(name=name, is_active=is_active))
    db.session.commit()


# ---------- COUNTRIES ----------

def test_get_countries_returns_list(seeded_client, seeded_app, auth_header):
    resp = seeded_client.get("/api/address/countries", headers=auth_header)
    assert resp.status_code == 200
    assert resp.is_json

    data = resp.get_json()
    assert isinstance(data, list)


def test_get_countries_structure_when_not_empty(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_tables(Country)
        seed_countries([("Poland", "PL", True)])

    resp = seeded_client.get("/api/address/countries", headers=auth_header)
    assert resp.status_code == 200
    data = resp.get_json()

    # Because we hard-cleared Country, we can safely assert exact length
    assert len(data) == 1

    first = data[0]
    assert "id" in first
    assert first["name"] == "Poland"
    assert first["shortcut"] == "PL"
    assert "is_active" in first


def test_add_country_success(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_tables(Country)

    payload = {"name": "Poland", "shortcut": "PL"}
    resp = seeded_client.post("/api/address/countries", json=payload, headers=auth_header)
    assert resp.status_code == 201

    data = resp.get_json()
    assert data["message"] == "Country added"
    assert data["country"]["name"] == "Poland"
    assert data["country"]["shortcut"] == "PL"
    assert data["country"]["is_active"] is True
    assert "id" in data["country"]


def test_add_country_missing_fields(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_tables(Country)

    resp = seeded_client.post("/api/address/countries", json={"name": "Poland"}, headers=auth_header)
    assert resp.status_code == 400
    assert resp.get_json()["error"] == "name and shortcut are required"


def test_patch_country_status_success(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_tables(Country)

    resp_create = seeded_client.post("/api/address/countries", json={"name": "Germany", "shortcut": "DE"}, headers=auth_header)
    assert resp_create.status_code == 201
    country_id = resp_create.get_json()["country"]["id"]

    resp = seeded_client.patch(f"/api/address/countries/{country_id}/status", json={"is_active": False}, headers=auth_header)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["message"] == "Country status updated"
    assert data["is_active"] is False


def test_patch_country_status_not_found(client, app):
    with app.app_context():
        clear_tables(Country)

    resp = client.patch("/api/address/countries/999999/status", json={"is_active": False})
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "Country not found"


def test_patch_country_status_missing_field(client, app):
    with app.app_context():
        clear_tables(Country)

    resp_create = client.post("/api/address/countries", json={"name": "France", "shortcut": "FR"})
    assert resp_create.status_code == 201
    country_id = resp_create.get_json()["country"]["id"]

    resp = client.patch(f"/api/address/countries/{country_id}/status", json={})
    assert resp.status_code == 400
    assert resp.get_json()["error"] == "'is_active' field is required"


# ---------- CITIES ----------

def test_get_cities_empty(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_tables(City)

    resp = seeded_client.get("/api/address/cities", headers=auth_header)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["items"] == []
    assert data["total"] == 0


def test_add_city_validation(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_tables(City)

    resp = seeded_client.post("/api/address/cities", json={}, headers=auth_header)
    assert resp.status_code == 400
    assert resp.get_json()["error"] == "name is required"


def test_add_city_success(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_tables(City)

    resp = seeded_client.post("/api/address/cities", json={"name": "Gdansk"}, headers=auth_header)
    assert resp.status_code == 201
    data = resp.get_json()
    assert data["message"] == "City added"
    assert data["city"]["name"] == "Gdansk"
    assert data["city"]["is_active"] is True
    assert "id" in data["city"]


def test_get_city_not_found(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_tables(City)

    resp = seeded_client.get("/api/address/cities/999999", headers=auth_header)
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "City not found"


def test_get_city_success(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_tables(City)

    r = seeded_client.post("/api/address/cities", json={"name": "Warsaw"}, headers=auth_header)
    city_id = r.get_json()["city"]["id"]

    resp = seeded_client.get(f"/api/address/cities/{city_id}", headers=auth_header)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["id"] == city_id
    assert data["name"] == "Warsaw"


def test_update_city_not_found(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_tables(City)

    resp = seeded_client.put("/api/address/cities/999999", json={"name": "X"}, headers=auth_header)
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "City not found"


def test_update_city_success(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_tables(City)

    r = seeded_client.post("/api/address/cities", json={"name": "Old"}, headers=auth_header)
    city_id = r.get_json()["city"]["id"]

    resp = seeded_client.put(f"/api/address/cities/{city_id}", json={"name": "New", "is_active": False}, headers=auth_header)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["message"] == "City updated"
    assert data["city"]["name"] == "New"
    assert data["city"]["is_active"] is False


def test_delete_city_not_found(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_tables(City)

    resp = seeded_client.delete("/api/address/cities/999999", headers=auth_header)
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "City not found"


def test_delete_city_success(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_tables(City)

    r = seeded_client.post("/api/address/cities", json={"name": "ToDelete"}, headers=auth_header)
    city_id = r.get_json()["city"]["id"]

    resp = seeded_client.delete(f"/api/address/cities/{city_id}", headers=auth_header)
    assert resp.status_code == 200
    assert resp.get_json()["message"] == "City deleted successfully"

    resp2 = seeded_client.get(f"/api/address/cities/{city_id}", headers=auth_header)
    assert resp2.status_code == 404


def test_get_cities_search_and_active_filter(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_tables(City)
        seed_cities([
            ("Gdansk", True),
            ("Gdynia", True),
            ("Sopot", False),
        ])

    # search
    resp = seeded_client.get("/api/address/cities?q=Gd", headers=auth_header)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["total"] == 2

    # active=true
    resp2 = seeded_client.get("/api/address/cities?active=true", headers=auth_header)
    assert resp2.status_code == 200
    data2 = resp2.get_json()
    assert data2["total"] == 2
    assert all(x["is_active"] is True for x in data2["items"])

    # active=false
    resp3 = seeded_client.get("/api/address/cities?active=false", headers=auth_header)
    assert resp3.status_code == 200
    data3 = resp3.get_json()
    assert data3["total"] == 1
    assert all(x["is_active"] is False for x in data3["items"])


def test_get_cities_pagination(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_tables(City)
        seed_cities([(f"City {i}", True) for i in range(1, 51)])  # 50

    resp = seeded_client.get("/api/address/cities?page=1&per_page=20", headers=auth_header)
    data = resp.get_json()
    assert resp.status_code == 200
    assert len(data["items"]) == 20
    assert data["total"] == 50
    assert data["pages"] == 3

    resp2 = seeded_client.get("/api/address/cities?page=3&per_page=20", headers=auth_header)
    data2 = resp2.get_json()
    assert resp2.status_code == 200
    assert len(data2["items"]) == 10


# ---------- DISTRICTS ----------

def test_get_districts_empty(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_tables(District)

    resp = seeded_client.get("/api/address/districts", headers=auth_header)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["items"] == []
    assert data["total"] == 0


def test_add_district_validation(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_tables(District)

    resp = seeded_client.post("/api/address/districts", json={}, headers=auth_header)
    assert resp.status_code == 400
    assert resp.get_json()["error"] == "name is required"


def test_add_district_success(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_tables(District)

    resp = seeded_client.post("/api/address/districts", json={"name": "Pomorskie"}, headers=auth_header)
    assert resp.status_code == 201
    data = resp.get_json()
    assert data["message"] == "District added"
    assert data["district"]["name"] == "Pomorskie"
    assert data["district"]["is_active"] is True


def test_get_district_not_found(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_tables(District)

    resp = seeded_client.get("/api/address/districts/999999", headers=auth_header)
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "District not found"


def test_get_district_success(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_tables(District)

    r = seeded_client.post("/api/address/districts", json={"name": "Mazowieckie"}, headers=auth_header)
    district_id = r.get_json()["district"]["id"]

    resp = seeded_client.get(f"/api/address/districts/{district_id}", headers=auth_header)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["id"] == district_id
    assert data["name"] == "Mazowieckie"


def test_update_district_not_found(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_tables(District)

    resp = seeded_client.put("/api/address/districts/999999", json={"name": "X"}, headers=auth_header)
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "District not found"


def test_update_district_success(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_tables(District)

    r = seeded_client.post("/api/address/districts", json={"name": "Old"}, headers=auth_header)
    district_id = r.get_json()["district"]["id"]

    resp = seeded_client.put(f"/api/address/districts/{district_id}", json={"name": "New", "is_active": False}, headers=auth_header)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["message"] == "District updated"
    assert data["district"]["name"] == "New"
    assert data["district"]["is_active"] is False


def test_delete_district_not_found(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_tables(District)

    resp = seeded_client.delete("/api/address/districts/999999", headers=auth_header)
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "District not found"


def test_delete_district_success(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_tables(District)

    r = seeded_client.post("/api/address/districts", json={"name": "ToDelete"}, headers=auth_header)
    district_id = r.get_json()["district"]["id"]

    resp = seeded_client.delete(f"/api/address/districts/{district_id}", headers=auth_header)
    assert resp.status_code == 200
    assert resp.get_json()["message"] == "District deleted successfully"

    resp2 = seeded_client.get(f"/api/address/districts/{district_id}", headers=auth_header)
    assert resp2.status_code == 404


def test_patch_district_status_validation_and_success(seeded_client, seeded_app, auth_header):
    with seeded_app.app_context():
        clear_tables(District)

    r = seeded_client.post("/api/address/districts", json={"name": "StatusTest"}, headers=auth_header)
    district_id = r.get_json()["district"]["id"]

    # missing field
    resp_missing = seeded_client.patch(f"/api/address/districts/{district_id}/status", json={}, headers=auth_header)
    assert resp_missing.status_code == 400
    assert resp_missing.get_json()["error"] == "'is_active' field is required"

    # success
    resp = seeded_client.patch(f"/api/address/districts/{district_id}/status", json={"is_active": False}, headers=auth_header)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["message"] == "District status updated"
    assert data["is_active"] is False

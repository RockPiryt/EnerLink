from app.db import db
from app.models.address_model import Country, City, District


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

def test_get_countries_returns_list(client):
    resp = client.get("/api/address/countries")
    assert resp.status_code == 200
    assert resp.is_json

    data = resp.get_json()
    assert isinstance(data, list)


def test_get_countries_structure_when_not_empty(client, app):
    with app.app_context():
        clear_tables(Country)
        seed_countries([("Poland", "PL", True)])

    resp = client.get("/api/address/countries")
    assert resp.status_code == 200
    data = resp.get_json()

    # Because we hard-cleared Country, we can safely assert exact length
    assert len(data) == 1

    first = data[0]
    assert "id" in first
    assert first["name"] == "Poland"
    assert first["shortcut"] == "PL"
    assert "is_active" in first


def test_add_country_success(client, app):
    with app.app_context():
        clear_tables(Country)

    payload = {"name": "Poland", "shortcut": "PL"}
    resp = client.post("/api/address/countries", json=payload)
    assert resp.status_code == 201

    data = resp.get_json()
    assert data["message"] == "Country added"
    assert data["country"]["name"] == "Poland"
    assert data["country"]["shortcut"] == "PL"
    assert data["country"]["is_active"] is True
    assert "id" in data["country"]


def test_add_country_missing_fields(client, app):
    with app.app_context():
        clear_tables(Country)

    resp = client.post("/api/address/countries", json={"name": "Poland"})
    assert resp.status_code == 400
    assert resp.get_json()["error"] == "name and shortcut are required"


def test_patch_country_status_success(client, app):
    with app.app_context():
        clear_tables(Country)

    resp_create = client.post("/api/address/countries", json={"name": "Germany", "shortcut": "DE"})
    assert resp_create.status_code == 201
    country_id = resp_create.get_json()["country"]["id"]

    resp = client.patch(f"/api/address/countries/{country_id}/status", json={"is_active": False})
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

def test_get_cities_empty(client, app):
    with app.app_context():
        clear_tables(City)

    resp = client.get("/api/address/cities")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["items"] == []
    assert data["total"] == 0


def test_add_city_validation(client, app):
    with app.app_context():
        clear_tables(City)

    resp = client.post("/api/address/cities", json={})
    assert resp.status_code == 400
    assert resp.get_json()["error"] == "name is required"


def test_add_city_success(client, app):
    with app.app_context():
        clear_tables(City)

    resp = client.post("/api/address/cities", json={"name": "Gdansk"})
    assert resp.status_code == 201
    data = resp.get_json()
    assert data["message"] == "City added"
    assert data["city"]["name"] == "Gdansk"
    assert data["city"]["is_active"] is True
    assert "id" in data["city"]


def test_get_city_not_found(client, app):
    with app.app_context():
        clear_tables(City)

    resp = client.get("/api/address/cities/999999")
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "City not found"


def test_get_city_success(client, app):
    with app.app_context():
        clear_tables(City)

    r = client.post("/api/address/cities", json={"name": "Warsaw"})
    city_id = r.get_json()["city"]["id"]

    resp = client.get(f"/api/address/cities/{city_id}")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["id"] == city_id
    assert data["name"] == "Warsaw"


def test_update_city_not_found(client, app):
    with app.app_context():
        clear_tables(City)

    resp = client.put("/api/address/cities/999999", json={"name": "X"})
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "City not found"


def test_update_city_success(client, app):
    with app.app_context():
        clear_tables(City)

    r = client.post("/api/address/cities", json={"name": "Old"})
    city_id = r.get_json()["city"]["id"]

    resp = client.put(f"/api/address/cities/{city_id}", json={"name": "New", "is_active": False})
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["message"] == "City updated"
    assert data["city"]["name"] == "New"
    assert data["city"]["is_active"] is False


def test_delete_city_not_found(client, app):
    with app.app_context():
        clear_tables(City)

    resp = client.delete("/api/address/cities/999999")
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "City not found"


def test_delete_city_success(client, app):
    with app.app_context():
        clear_tables(City)

    r = client.post("/api/address/cities", json={"name": "ToDelete"})
    city_id = r.get_json()["city"]["id"]

    resp = client.delete(f"/api/address/cities/{city_id}")
    assert resp.status_code == 200
    assert resp.get_json()["message"] == "City deleted successfully"

    resp2 = client.get(f"/api/address/cities/{city_id}")
    assert resp2.status_code == 404


def test_get_cities_search_and_active_filter(client, app):
    with app.app_context():
        clear_tables(City)
        seed_cities([
            ("Gdansk", True),
            ("Gdynia", True),
            ("Sopot", False),
        ])

    # search
    resp = client.get("/api/address/cities?q=Gd")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["total"] == 2

    # active=true
    resp2 = client.get("/api/address/cities?active=true")
    assert resp2.status_code == 200
    data2 = resp2.get_json()
    assert data2["total"] == 2
    assert all(x["is_active"] is True for x in data2["items"])

    # active=false
    resp3 = client.get("/api/address/cities?active=false")
    assert resp3.status_code == 200
    data3 = resp3.get_json()
    assert data3["total"] == 1
    assert all(x["is_active"] is False for x in data3["items"])


def test_get_cities_pagination(client, app):
    with app.app_context():
        clear_tables(City)
        seed_cities([(f"City {i}", True) for i in range(1, 51)])  # 50

    resp = client.get("/api/address/cities?page=1&per_page=20")
    data = resp.get_json()
    assert resp.status_code == 200
    assert len(data["items"]) == 20
    assert data["total"] == 50
    assert data["pages"] == 3

    resp2 = client.get("/api/address/cities?page=3&per_page=20")
    data2 = resp2.get_json()
    assert resp2.status_code == 200
    assert len(data2["items"]) == 10


# ---------- DISTRICTS ----------

def test_get_districts_empty(client, app):
    with app.app_context():
        clear_tables(District)

    resp = client.get("/api/address/districts")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["items"] == []
    assert data["total"] == 0


def test_add_district_validation(client, app):
    with app.app_context():
        clear_tables(District)

    resp = client.post("/api/address/districts", json={})
    assert resp.status_code == 400
    assert resp.get_json()["error"] == "name is required"


def test_add_district_success(client, app):
    with app.app_context():
        clear_tables(District)

    resp = client.post("/api/address/districts", json={"name": "Pomorskie"})
    assert resp.status_code == 201
    data = resp.get_json()
    assert data["message"] == "District added"
    assert data["district"]["name"] == "Pomorskie"
    assert data["district"]["is_active"] is True


def test_get_district_not_found(client, app):
    with app.app_context():
        clear_tables(District)

    resp = client.get("/api/address/districts/999999")
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "District not found"


def test_get_district_success(client, app):
    with app.app_context():
        clear_tables(District)

    r = client.post("/api/address/districts", json={"name": "Mazowieckie"})
    district_id = r.get_json()["district"]["id"]

    resp = client.get(f"/api/address/districts/{district_id}")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["id"] == district_id
    assert data["name"] == "Mazowieckie"


def test_update_district_not_found(client, app):
    with app.app_context():
        clear_tables(District)

    resp = client.put("/api/address/districts/999999", json={"name": "X"})
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "District not found"


def test_update_district_success(client, app):
    with app.app_context():
        clear_tables(District)

    r = client.post("/api/address/districts", json={"name": "Old"})
    district_id = r.get_json()["district"]["id"]

    resp = client.put(f"/api/address/districts/{district_id}", json={"name": "New", "is_active": False})
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["message"] == "District updated"
    assert data["district"]["name"] == "New"
    assert data["district"]["is_active"] is False


def test_delete_district_not_found(client, app):
    with app.app_context():
        clear_tables(District)

    resp = client.delete("/api/address/districts/999999")
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "District not found"


def test_delete_district_success(client, app):
    with app.app_context():
        clear_tables(District)

    r = client.post("/api/address/districts", json={"name": "ToDelete"})
    district_id = r.get_json()["district"]["id"]

    resp = client.delete(f"/api/address/districts/{district_id}")
    assert resp.status_code == 200
    assert resp.get_json()["message"] == "District deleted successfully"

    resp2 = client.get(f"/api/address/districts/{district_id}")
    assert resp2.status_code == 404


def test_patch_district_status_validation_and_success(client, app):
    with app.app_context():
        clear_tables(District)

    r = client.post("/api/address/districts", json={"name": "StatusTest"})
    district_id = r.get_json()["district"]["id"]

    # missing field
    resp_missing = client.patch(f"/api/address/districts/{district_id}/status", json={})
    assert resp_missing.status_code == 400
    assert resp_missing.get_json()["error"] == "'is_active' field is required"

    # success
    resp = client.patch(f"/api/address/districts/{district_id}/status", json={"is_active": False})
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["message"] == "District status updated"
    assert data["is_active"] is False


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

def test_get_customers_returns_list(seeded_client, auth_header):
    resp = seeded_client.get("/api/customers", headers=auth_header)
    assert resp.status_code == 200
    assert resp.is_json
    assert isinstance(resp.get_json(), list)


def test_add_customer_missing_required_fields(seeded_client, auth_header):
    resp = seeded_client.post("/api/customers", json={}, headers=auth_header)
    assert resp.status_code == 400
    assert resp.get_json()["error"] == "Company and email are required"


def test_add_customer_success_without_address(seeded_client, auth_header):
    payload = {
        "company": "Test Company Sp. z o.o.",
        "email": "contact@testco.pl",
        "nip": "1234567890",
        "phone": "+48 500 600 700"
    }
    resp = seeded_client.post("/api/customers", json=payload, headers=auth_header)
    assert resp.status_code == 201
    data = resp.get_json()
    assert data["message"] == "Customer created"
    assert "customer" in data

    cust = data["customer"]
    assert cust["company"] == "Test Company Sp. z o.o."
    assert cust["email"] == "contact@testco.pl"
    assert "is_deleted" in cust
    assert "updated_at" in cust
    assert "ppes" in cust
    assert isinstance(cust["ppes"], list)


def test_add_customer_success_with_address(seeded_client, auth_header):
    payload = {
        "company": "Address Company S.A.",
        "email": "office@addrco.pl",
        "nip": "9876543210",
        "phone": "+48 111 222 333",
        "address": {
            "street_name": "Długa",
            "building_nr": 1,
            "apartment_nr": 2,
            "post_code": "80-001",
            "id_city": None,
            "id_district": None,
            "id_country": None
        }
    }
    resp = seeded_client.post("/api/customers", json=payload, headers=auth_header)
    assert resp.status_code == 201
    data = resp.get_json()
    assert data["message"] == "Customer created"


def test_get_customer_not_found(seeded_client, auth_header):
    resp = seeded_client.get("/api/customers/999999", headers=auth_header)
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "Customer not found"


def test_get_customer_success_after_create(seeded_client, auth_header):
    create = seeded_client.post("/api/customers", json={
        "company": "Lookup Company",
        "email": "lookup@co.pl"
    }, headers=auth_header)
    assert create.status_code == 201

    resp_list = seeded_client.get("/api/customers", headers=auth_header)
    assert resp_list.status_code == 200
    customers = resp_list.get_json()
    assert len(customers) > 0

    customer_id = customers[-1]["id"]

    resp_get = seeded_client.get(f"/api/customers/{customer_id}", headers=auth_header)
    assert resp_get.status_code == 200
    data = resp_get.get_json()
    assert data["id"] == customer_id


def test_update_customer_not_found(seeded_client, auth_header):
    resp = seeded_client.put("/api/customers/999999", json={"company": "X"}, headers=auth_header)
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "Customer not found"


def test_update_customer_success_without_address(seeded_client, auth_header):
    create = seeded_client.post("/api/customers", json={
        "company": "Update Company",
        "email": "update@co.pl",
        "nip": "1111111111",
        "phone": "123"
    }, headers=auth_header)
    customer_id = create.get_json()["customer"]["id"]

    resp = seeded_client.put(f"/api/customers/{customer_id}", json={
        "company": "Update Company NEW",
        "email": "update_new@co.pl",
        "phone": "999",
        "description": "Updated description"
    }, headers=auth_header)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["message"] == "Customer updated"
    assert data["customer"]["id"] == customer_id
    assert data["customer"]["description"] == "Updated description"


def test_update_customer_adds_address_when_missing(seeded_client, auth_header):
    create = seeded_client.post("/api/customers", json={
        "company": "No Address Co",
        "email": "noaddr@co.pl"
    }, headers=auth_header)
    customer_id = create.get_json()["customer"]["id"]

    resp = seeded_client.put(f"/api/customers/{customer_id}", json={
        "address": {
            "street_name": "Grunwaldzka",
            "building_nr": 100,
            "apartment_nr": None,
            "post_code": "80-244",
            "id_city": None,
            "id_district": None,
            "id_country": None
        }
    }, headers=auth_header)
    assert resp.status_code == 200
    assert resp.get_json()["message"] == "Customer updated"


def test_patch_customer_status_missing_field(seeded_client, auth_header):
    create = seeded_client.post("/api/customers", json={
        "company": "Status Co",
        "email": "status@co.pl"
    }, headers=auth_header)
    customer_id = create.get_json()["customer"]["id"]

    resp = seeded_client.patch(f"/api/customers/{customer_id}", json={}, headers=auth_header)
    assert resp.status_code == 400
    assert resp.get_json()["error"] == "'active' field is required"


def test_patch_customer_status_success(seeded_client, auth_header):
    create = seeded_client.post("/api/customers", json={
        "company": "Status Co 2",
        "email": "status2@co.pl"
    }, headers=auth_header)
    customer_id = create.get_json()["customer"]["id"]

    resp = seeded_client.patch(f"/api/customers/{customer_id}", json={"active": False}, headers=auth_header)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["message"] == "Customer status updated"
    assert data["active"] is False


def test_patch_customer_status_not_found(seeded_client, auth_header):
    resp = seeded_client.patch("/api/customers/999999", json={"active": False}, headers=auth_header)
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "Customer not found"


def test_get_customers_excludes_deleted_by_default_and_includes_with_flag(seeded_client, auth_header):
    # create and soft-delete
    create = seeded_client.post("/api/customers", json={
        "company": "Deleted Co",
        "email": "deleted@co.pl"
    }, headers=auth_header)
    cid = create.get_json()["customer"]["id"]

    upd = seeded_client.put(f"/api/customers/{cid}", json={"is_deleted": True}, headers=auth_header)
    assert upd.status_code == 200
    assert upd.get_json()["customer"]["is_deleted"] is True

    # default list should not include deleted
    resp_list = seeded_client.get("/api/customers", headers=auth_header)
    assert resp_list.status_code == 200
    ids_default = [c["id"] for c in resp_list.get_json()]
    assert cid not in ids_default

    # include_deleted should include it
    resp_list2 = seeded_client.get("/api/customers?include_deleted=true", headers=auth_header)
    assert resp_list2.status_code == 200
    ids_incl = [c["id"] for c in resp_list2.get_json()]
    assert cid in ids_incl

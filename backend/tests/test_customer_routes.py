def test_get_customers_returns_list(client):
    resp = client.get("/api/customers")
    assert resp.status_code == 200
    assert resp.is_json
    assert isinstance(resp.get_json(), list)


def test_add_customer_missing_required_fields(client):
    resp = client.post("/api/customers", json={})
    assert resp.status_code == 400
    assert resp.get_json()["error"] == "Company and email are required"


def test_add_customer_success_without_address(client):
    payload = {
        "company": "Test Company Sp. z o.o.",
        "email": "contact@testco.pl",
        "nip": "1234567890",
        "phone": "+48 500 600 700"
    }
    resp = client.post("/api/customers", json=payload)
    assert resp.status_code == 201
    data = resp.get_json()
    assert data["message"] == "Customer created"
    assert "customer" in data


def test_add_customer_success_with_address(client):
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
    resp = client.post("/api/customers", json=payload)
    assert resp.status_code == 201
    data = resp.get_json()
    assert data["message"] == "Customer created"


def test_get_customer_not_found(client):
    resp = client.get("/api/customers/999999")
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "Customer not found"


def test_get_customer_success_after_create(client):
    create = client.post("/api/customers", json={
        "company": "Lookup Company",
        "email": "lookup@co.pl"
    })
    assert create.status_code == 201

    # spróbuj znaleźć nowo dodanego klienta poprzez listę
    resp_list = client.get("/api/customers")
    assert resp_list.status_code == 200
    customers = resp_list.get_json()
    assert len(customers) > 0

    # bierzemy ostatniego (najczęściej będzie to nowy rekord)
    customer_id = customers[-1]["id"]

    resp_get = client.get(f"/api/customers/{customer_id}")
    assert resp_get.status_code == 200
    data = resp_get.get_json()
    assert data["id"] == customer_id


def test_update_customer_not_found(client):
    resp = client.put("/api/customers/999999", json={"company": "X"})
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "Customer not found"


def test_update_customer_success_without_address(client):
    create = client.post("/api/customers", json={
        "company": "Update Company",
        "email": "update@co.pl",
        "nip": "1111111111",
        "phone": "123"
    })
    customer_id = create.get_json()["customer"]["id"]

    resp = client.put(f"/api/customers/{customer_id}", json={
        "company": "Update Company NEW",
        "email": "update_new@co.pl",
        "phone": "999"
    })
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["message"] == "Customer updated"
    assert data["customer"]["id"] == customer_id


def test_update_customer_adds_address_when_missing(client):
    create = client.post("/api/customers", json={
        "company": "No Address Co",
        "email": "noaddr@co.pl"
    })
    customer_id = create.get_json()["customer"]["id"]

    resp = client.put(f"/api/customers/{customer_id}", json={
        "address": {
            "street_name": "Grunwaldzka",
            "building_nr": 100,
            "apartment_nr": None,
            "post_code": "80-244",
            "id_city": None,
            "id_district": None,
            "id_country": None
        }
    })
    assert resp.status_code == 200
    assert resp.get_json()["message"] == "Customer updated"


def test_patch_customer_status_missing_field(client):
    create = client.post("/api/customers", json={
        "company": "Status Co",
        "email": "status@co.pl"
    })
    customer_id = create.get_json()["customer"]["id"]

    resp = client.patch(f"/api/customers/{customer_id}", json={})
    assert resp.status_code == 400
    assert resp.get_json()["error"] == "'active' field is required"


def test_patch_customer_status_success(client):
    create = client.post("/api/customers", json={
        "company": "Status Co 2",
        "email": "status2@co.pl"
    })
    customer_id = create.get_json()["customer"]["id"]

    resp = client.patch(f"/api/customers/{customer_id}", json={"active": False})
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["message"] == "Customer status updated"
    assert data["active"] is False


def test_patch_customer_status_not_found(client):
    resp = client.patch("/api/customers/999999", json={"active": False})
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "Customer not found"

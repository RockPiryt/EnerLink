from datetime import date


def _get_first_ids(app):
    from app.models.customer_model import Customer
    from app.models.tag_model import Tag
    from app.models.user_model import User
    from app.models.supplier_model import SupplierOffer

    with app.app_context():
        customer = Customer.query.first()
        tag = Tag.query.first()
        user = User.query.first()
        offer = SupplierOffer.query.first()

        return {
            "customer_id": customer.id if customer else None,
            "tag_id": tag.id if tag else None,
            "user_id": user.id if user else None,
            "offer_id": offer.id if offer else None,
        }


def _create_contract_via_api(client, app, contract_number="CNTR-TEST-0001", status="NEW"):
    ids = _get_first_ids(app)
    assert ids["customer_id"] is not None, "Seed must create at least one Customer"

    payload = {
        "id_customer": ids["customer_id"],
        "contract_number": contract_number,
        "id_user": ids["user_id"],
        "id_tag": ids["tag_id"],
        "id_supplier_offer": ids["offer_id"],
        "signed_at": date.today().isoformat(),
        "contract_from": date.today().isoformat(),
        "status": status,
        "description": "Created by test",
    }
    resp = client.post("/api/contracts", json=payload)
    assert resp.status_code == 201, resp.get_json()
    return resp.get_json()["contract"]["id"]


def test_get_contracts_returns_list(client):
    resp = client.get("/api/contracts")
    assert resp.status_code == 200
    assert resp.is_json
    assert isinstance(resp.get_json(), list)


def test_add_contract_missing_required_fields(client):
    resp = client.post("/api/contracts", json={})
    assert resp.status_code == 400
    assert resp.get_json()["error"] == "id_customer and contract_number are required"


def test_add_contract_invalid_date_format(client, app):
    ids = _get_first_ids(app)
    assert ids["customer_id"] is not None

    payload = {
        "id_customer": ids["customer_id"],
        "contract_number": "CNTR-TEST-BADDATE",
        "signed_at": "2025/01/01",  # invalid
    }
    resp = client.post("/api/contracts", json=payload)
    assert resp.status_code == 400

    err = resp.get_json()["error"]
    assert "Invalid date format" in err
    assert "signed_at" in err


def test_add_contract_success_and_timeline_present(client, app):
    contract_id = _create_contract_via_api(client, app, contract_number="CNTR-TEST-0002", status="NEW")

    resp = client.get(f"/api/contracts/{contract_id}")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["id"] == contract_id
    assert "timelines" in data
    assert isinstance(data["timelines"], list)

    # status should be present in timelines
    assert any(t.get("status") == "NEW" for t in data["timelines"])


def test_get_contract_not_found(client):
    resp = client.get("/api/contracts/999999")
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "Contract not found"


def test_update_contract_success(client, app):
    contract_id = _create_contract_via_api(client, app, contract_number="CNTR-TEST-0003")

    resp = client.put(f"/api/contracts/{contract_id}", json={
        "contract_number": "CNTR-TEST-0003-UPDATED",
        "signed_at": None,  # clear date
    })
    assert resp.status_code == 200
    data = resp.get_json()

    assert data["message"] == "Contract updated"
    assert data["contract"]["contract_number"] == "CNTR-TEST-0003-UPDATED"
    assert data["contract"]["signed_at"] is None


def test_update_contract_invalid_date_format(client, app):
    contract_id = _create_contract_via_api(client, app, contract_number="CNTR-TEST-0004")

    resp = client.put(f"/api/contracts/{contract_id}", json={
        "contract_from": "01-01-2025"  # invalid
    })
    assert resp.status_code == 400

    err = resp.get_json()["error"]
    assert "Invalid date format" in err
    assert "contract_from" in err


def test_toggle_contract_deleted_requires_field(client, app):
    contract_id = _create_contract_via_api(client, app, contract_number="CNTR-TEST-0005")

    resp = client.patch(f"/api/contracts/{contract_id}/deleted", json={})
    assert resp.status_code == 400
    assert resp.get_json()["error"] == "'is_deleted' field is required"


def test_toggle_contract_deleted_success(client, app):
    contract_id = _create_contract_via_api(client, app, contract_number="CNTR-TEST-0006")

    # mark deleted
    resp = client.patch(f"/api/contracts/{contract_id}/deleted", json={"is_deleted": True})
    assert resp.status_code == 200
    data = resp.get_json()

    assert data["message"] == "Contract deleted flag updated"
    assert data["is_deleted"] is True

    # default GET should hide deleted
    resp2 = client.get("/api/contracts")
    assert resp2.status_code == 200
    ids = [c["id"] for c in resp2.get_json()]
    assert contract_id not in ids

    # include_deleted should show it
    resp3 = client.get("/api/contracts?include_deleted=true")
    assert resp3.status_code == 200
    ids3 = [c["id"] for c in resp3.get_json()]
    assert contract_id in ids3


def test_filter_contracts_by_customer(client, app):
    ids = _get_first_ids(app)
    assert ids["customer_id"] is not None

    # create 2 contracts for same customer
    _create_contract_via_api(client, app, contract_number="CNTR-TEST-CUST-01")
    _create_contract_via_api(client, app, contract_number="CNTR-TEST-CUST-02")

    resp = client.get(f"/api/contracts?customer_id={ids['customer_id']}")
    assert resp.status_code == 200
    data = resp.get_json()

    assert isinstance(data, list)
    assert all(c["id_customer"] == ids["customer_id"] for c in data)


def test_get_timeline_list(client, app):
    contract_id = _create_contract_via_api(client, app, contract_number="CNTR-TEST-TL-01")

    resp = client.get(f"/api/contracts/{contract_id}/timeline")
    assert resp.status_code == 200
    assert isinstance(resp.get_json(), list)


def test_add_timeline_entry_success(client, app):
    contract_id = _create_contract_via_api(client, app, contract_number="CNTR-TEST-TL-02")

    resp = client.post(f"/api/contracts/{contract_id}/timeline", json={
        "status": "SIGNED",
        "description": "Signed by customer"
    })
    assert resp.status_code == 201
    data = resp.get_json()

    assert data["message"] == "Timeline entry added"
    assert data["timeline"]["status"] == "SIGNED"

    # verify it appears in timeline list
    resp2 = client.get(f"/api/contracts/{contract_id}/timeline")
    assert resp2.status_code == 200
    statuses = [t["status"] for t in resp2.get_json()]
    assert "SIGNED" in statuses


def test_add_timeline_entry_missing_status(client, app):
    contract_id = _create_contract_via_api(client, app, contract_number="CNTR-TEST-TL-03")

    resp = client.post(f"/api/contracts/{contract_id}/timeline", json={})
    assert resp.status_code == 400
    assert resp.get_json()["error"] == "status is required"


def test_add_timeline_entry_contract_not_found(client):
    resp = client.post("/api/contracts/999999/timeline", json={"status": "NEW"})
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "Contract not found"


def test_get_contract_history_returns_list(client, app):
    contract_id = _create_contract_via_api(client, app, contract_number="CNTR-TEST-HIST-01")

    resp = client.get(f"/api/contracts/{contract_id}/history")
    assert resp.status_code == 200
    assert isinstance(resp.get_json(), list)

    # at least one entry from initial timeline
    history = resp.get_json()
    assert len(history) >= 1
    assert all("new_value" in h for h in history)

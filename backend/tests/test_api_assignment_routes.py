import pytest

def get_token(client):
    resp = client.post("/api/login", json={
        "email": "david.wilson@enerlink.com",
        "password": "analyst123"
    })
    assert resp.status_code == 200
    return resp.get_json()["token"]

@pytest.fixture()
def auth_header(seeded_client):
    token = get_token(seeded_client)
    return {"Authorization": f"Bearer {token}"}

def _get_first_ids(seeded_app):
    from app.models.customer_model import Customer
    from app.models.user_model import User
    with seeded_app.app_context():
        customer = Customer.query.first()
        user = User.query.first()
        return {
            "customer_id": customer.id if customer else None,
            "sales_rep_id": user.id if user else None,
        }

def test_assign_customer_and_list(seeded_client, seeded_app, auth_header):
    ids = _get_first_ids(seeded_app)
    assert ids["customer_id"]
    assert ids["sales_rep_id"]
    # Assign
    payload = {"customer_id": ids["customer_id"], "sales_rep_id": ids["sales_rep_id"]}
    resp = seeded_client.post("/api/sales/customers", json=payload, headers=auth_header)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["message"] == "Customer assigned"
    # List
    resp2 = seeded_client.get(f"/api/sales/customers?rep_id={ids['sales_rep_id']}", headers=auth_header)
    assert resp2.status_code == 200
    customers = resp2.get_json()
    assert any(c["id"] == ids["customer_id"] for c in customers)

def test_assign_customer_missing_fields(seeded_client, auth_header):
    # Missing customer_id
    resp = seeded_client.post("/api/sales/customers", json={"sales_rep_id": "SAL001"}, headers=auth_header)
    assert resp.status_code == 400
    # Missing sales_rep_id
    resp = seeded_client.post("/api/sales/customers", json={"customer_id": 1}, headers=auth_header)
    assert resp.status_code == 400

def test_list_sales_customers_without_rep_id_returns_empty(seeded_client, auth_header):
    resp = seeded_client.get("/api/sales/customers", headers=auth_header)
    assert resp.status_code == 200
    assert resp.get_json() == []

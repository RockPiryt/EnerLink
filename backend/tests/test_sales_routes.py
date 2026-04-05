

from datetime import date
BASE = "/api/sales"

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


def test_list_sales_customers_without_rep_id_returns_empty_list(seeded_client, auth_header):
    resp = seeded_client.get(f"{BASE}/customers", headers=auth_header)
    assert resp.status_code == 200
    assert resp.get_json() == []


def test_assign_customer_missing_customer_id(seeded_client, auth_header):
    resp = seeded_client.post(f"{BASE}/customers", json={"sales_rep_id": "SAL001"}, headers=auth_header)
    assert resp.status_code == 400


def test_assign_customer_missing_sales_rep_id(seeded_client, auth_header):
    resp = seeded_client.post(f"{BASE}/customers", json={"customer_id": 1}, headers=auth_header)
    assert resp.status_code == 400


def test_assign_customer_success_and_list(seeded_client, seeded_app, auth_header):
    ids = _get_first_ids(seeded_app)
    assert ids["customer_id"]
    assert ids["sales_rep_id"]

    payload = {
        "customer_id": ids["customer_id"],
        "sales_rep_id": ids["sales_rep_id"],
    }

    resp = seeded_client.post(f"{BASE}/customers", json=payload, headers=auth_header)
    assert resp.status_code == 200

    resp2 = seeded_client.get(f"{BASE}/customers?rep_id={ids['sales_rep_id']}", headers=auth_header)
    assert resp2.status_code == 200
    customers = resp2.get_json()
    assert any(c["id"] == ids["customer_id"] for c in customers)


def test_contract_analytics_returns_structure(seeded_client, auth_header):
    resp = seeded_client.get(f"{BASE}/analytics/contracts", headers=auth_header)
    assert resp.status_code == 200
    data = resp.get_json()
    assert "monthly" in data
    assert "yearly" in data


def test_contract_analytics_year_filter(seeded_client, auth_header):
    year = date.today().year
    resp = seeded_client.get(f"{BASE}/analytics/contracts?year={year}", headers=auth_header)
    assert resp.status_code == 200

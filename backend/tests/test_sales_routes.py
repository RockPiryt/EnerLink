from datetime import date

BASE = "/api/sales"

def _get_first_ids(app):
    from app.models.customer_model import Customer
    from app.models.user_model import User

    with app.app_context():
        customer = Customer.query.first()
        user = User.query.first()
        return {
            "customer_id": customer.id if customer else None,
            "sales_rep_id": user.id if user else None,
        }


def test_list_sales_customers_without_rep_id_returns_empty_list(client):
    resp = client.get(f"{BASE}/customers")
    assert resp.status_code == 200
    assert resp.get_json() == []


def test_assign_customer_missing_customer_id(client):
    resp = client.post(f"{BASE}/customers", json={"sales_rep_id": "SAL001"})
    assert resp.status_code == 400


def test_assign_customer_missing_sales_rep_id(client):
    resp = client.post(f"{BASE}/customers", json={"customer_id": 1})
    assert resp.status_code == 400


def test_assign_customer_success_and_list(client, app):
    ids = _get_first_ids(app)
    assert ids["customer_id"]
    assert ids["sales_rep_id"]

    payload = {
        "customer_id": ids["customer_id"],
        "sales_rep_id": ids["sales_rep_id"],
    }

    resp = client.post(f"{BASE}/customers", json=payload)
    assert resp.status_code == 200

    resp2 = client.get(f"{BASE}/customers?rep_id={ids['sales_rep_id']}")
    assert resp2.status_code == 200
    customers = resp2.get_json()
    assert any(c["id"] == ids["customer_id"] for c in customers)


def test_contract_analytics_returns_structure(client):
    resp = client.get(f"{BASE}/analytics/contracts")
    assert resp.status_code == 200
    data = resp.get_json()
    assert "monthly" in data
    assert "yearly" in data


def test_contract_analytics_year_filter(client):
    year = date.today().year
    resp = client.get(f"{BASE}/analytics/contracts?year={year}")
    assert resp.status_code == 200

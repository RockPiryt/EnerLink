
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


def test_manager_ranking_returns_expected_structure(seeded_client, auth_header):
    """Test if the /api/manager/ranking endpoint returns the expected structure."""
    resp = seeded_client.get("/api/manager/ranking", headers=auth_header)
    assert resp.status_code == 200
    assert resp.is_json
    data = resp.get_json()
    assert "ranking" in data
    assert "generated_at" in data
    assert isinstance(data["ranking"], list)


def test_manager_ranking_contains_seeded_sales_rep(seeded_client, auth_header):
    """Test if the seeded sales representative Michael Brown appears in the ranking with at least 1 contract."""
    resp = seeded_client.get("/api/manager/ranking", headers=auth_header)
    assert resp.status_code == 200
    data = resp.get_json()
    ranking = data["ranking"]
    found = any(
        (item["name"] == "Michael Brown" and item["value"] >= 1)
        for item in ranking
    )
    assert found, "Michael Brown should appear in the ranking with at least 1 contract."


def test_manager_ranking_sorted_descending(seeded_client, auth_header):
    """Test if the ranking is sorted in descending order by contract count."""
    resp = seeded_client.get("/api/manager/ranking", headers=auth_header)
    assert resp.status_code == 200
    data = resp.get_json()
    ranking = data["ranking"]
    values = [item["value"] for item in ranking]
    assert values == sorted(values, reverse=True), "Ranking should be sorted in descending order."


def test_manager_ranking_requires_auth(seeded_client):
    """Test if authentication is required for the ranking endpoint."""
    resp = seeded_client.get("/api/manager/ranking")
    assert resp.status_code in (401, 422), "Missing token should result in access denied."

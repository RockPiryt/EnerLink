
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
    resp = seeded_client.get("/api/manager/ranking", headers=auth_header)
    assert resp.status_code == 200
    assert resp.is_json
    data = resp.get_json()
    assert "ranking" in data
    assert "generated_at" in data
    assert isinstance(data["ranking"], list)

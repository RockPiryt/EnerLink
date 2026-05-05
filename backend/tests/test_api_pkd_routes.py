import pytest
from tests.test_auth_routes import auth_header

def test_get_all_pkd(seeded_client, seeded_app, auth_header):
    # No PKD entries in DB
    resp = seeded_client.get("/api/", headers=auth_header)
    assert resp.status_code == 200
    assert resp.is_json
    data = resp.get_json()
    assert isinstance(data, list)

def test_list_routes(seeded_app):
    print("\nRegistered routes:")
    for rule in seeded_app.url_map.iter_rules():
        print(rule)

def test_manager_ranking_returns_expected_structure(client):
    resp = client.get("/manager/ranking")
    assert resp.status_code == 200
    assert resp.is_json
    data = resp.get_json()
    assert "ranking" in data
    assert "generated_at" in data
    assert isinstance(data["ranking"], list)

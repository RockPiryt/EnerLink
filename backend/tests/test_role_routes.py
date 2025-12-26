def test_get_roles_returns_list(client):
    resp = client.get("/roles")
    assert resp.status_code == 200
    assert resp.is_json
    assert isinstance(resp.get_json(), list)


def test_add_role_missing_role_name(client):
    resp = client.post("/roles", json={})
    assert resp.status_code == 400
    assert resp.get_json()["error"] == "Field 'role_name' is required"


def test_add_role_success(client):
    resp = client.post("/roles", json={"role_name": "Test Role"})
    assert resp.status_code == 201
    data = resp.get_json()
    assert data["message"] == "Role created"
    assert data["role"]["role_name"] == "Test Role"
    assert "id" in data["role"]


def test_get_role_not_found(client):
    resp = client.get("/roles/999999")
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "Role not found"


def test_get_role_success(client):
    created = client.post("/roles", json={"role_name": "Role For Get"})
    role_id = created.get_json()["role"]["id"]

    resp = client.get(f"/roles/{role_id}")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["id"] == role_id
    assert data["role_name"] == "Role For Get"


def test_update_role_not_found(client):
    resp = client.put("/roles/999999", json={"role_name": "X"})
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "Role not found"


def test_update_role_success(client):
    created = client.post("/roles", json={"role_name": "Role To Update"})
    role_id = created.get_json()["role"]["id"]

    resp = client.put(f"/roles/{role_id}", json={"role_name": "Updated Role", "active": False})
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["message"] == "Role updated"
    assert data["role"]["id"] == role_id
    assert data["role"]["role_name"] == "Updated Role"
    assert data["role"]["active"] is False


def test_delete_role_not_found(client):
    resp = client.delete("/roles/999999")
    assert resp.status_code == 404
    assert resp.get_json()["error"] == "Role not found"


def test_delete_role_success(client):
    created = client.post("/roles", json={"role_name": "Role To Delete"})
    role_id = created.get_json()["role"]["id"]

    resp = client.delete(f"/roles/{role_id}")
    assert resp.status_code == 200
    assert resp.get_json()["message"] == "Role deleted"

    # confirm it's gone
    resp2 = client.get(f"/roles/{role_id}")
    assert resp2.status_code == 404

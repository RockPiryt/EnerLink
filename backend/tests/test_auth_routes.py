def test_login_success(client, seeded_app):
    resp = client.post("/api/login", json={
        "email": "david.wilson@enerlink.com",
        "password": "demo123"
    })
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["message"] == "Login successful"
    assert data["user"]["email"] == "david.wilson@enerlink.com"
    assert "token" in data


def test_login_missing_fields(client):
    resp = client.post("/api/login", json={})
    assert resp.status_code == 400
    assert resp.get_json()["error"] == "Email and password are required"


def test_login_invalid_email(client, seeded_app):
    resp = client.post("/api/login", json={
        "email": "wrong@enerlink.com",
        "password": "demo123"
    })
    assert resp.status_code == 401
    assert resp.get_json()["error"] == "Invalid credentials"


def test_login_invalid_password(client, seeded_app):
    resp = client.post("/api/login", json={
        "email": "david.wilson@enerlink.com",
        "password": "wrongpass"
    })
    assert resp.status_code == 401
    assert resp.get_json()["error"] == "Invalid credentials"


def test_login_deactivated_user(client, app):
    from app.db import db
    from app.models.user_model import User

    with app.app_context():
        user = User.query.filter_by(email="david.wilson@enerlink.com").first()
        user.active = False
        db.session.commit()

    resp = client.post("/api/login", json={
        "email": "david.wilson@enerlink.com",
        "password": "demo123"
    })
    assert resp.status_code == 401
    assert resp.get_json()["error"] == "Account is deactivated"


def test_logout(client):
    resp = client.post("/api/logout")
    assert resp.status_code == 200
    assert resp.get_json()["message"] == "Logout successful"

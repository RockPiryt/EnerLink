def get_token(seeded_client):
    resp = seeded_client.post("/api/login", json={
        "email": "david.wilson@enerlink.com",
        "password": "analyst123"
    })
    assert resp.status_code == 200, f"Login failed: {resp.data}"
    return resp.get_json()["token"]

import pytest

@pytest.fixture()
def auth_header(seeded_client, seeded_app):
    # Always activate user before login to avoid test interference
    from app.models.user_model import User
    with seeded_app.app_context():
        user = User.query.filter_by(email="david.wilson@enerlink.com").first()
        if user and not user.active:
            user.active = True
            from app.db import db
            db.session.commit()
    token = get_token(seeded_client)
    return {"Authorization": f"Bearer {token}"}
import pytest
from app.db import db
from app.models.user_model import User

# Uwaga: dane z seed_database():
# david.wilson@enerlink.com  / analyst123  / active=True

def test_login_success(seeded_client, seeded_app):
    resp = seeded_client.post("/api/login", json={
        "email": "david.wilson@enerlink.com",
        "password": "analyst123"
    })
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["message"] == "Login successful"
    assert data["user"]["email"] == "david.wilson@enerlink.com"
    assert "token" in data


def test_login_missing_fields(seeded_client):
    resp = seeded_client.post("/api/login", json={})
    assert resp.status_code == 400
    assert resp.get_json()["error"] == "Email and password are required"


def test_login_invalid_email(seeded_client, seeded_app):
    resp = seeded_client.post("/api/login", json={
        "email": "wrong@enerlink.com",
        "password": "analyst123"
    })
    assert resp.status_code == 403
    assert resp.get_json()["error"] == "Invalid credentials"


def test_login_invalid_password(seeded_client, seeded_app):
    resp = seeded_client.post("/api/login", json={
        "email": "david.wilson@enerlink.com",
        "password": "wrongpass"
    })
    assert resp.status_code == 403
    assert resp.get_json()["error"] == "Invalid credentials"


def test_login_deactivated_user(seeded_client, seeded_app):
    # Deactivate user in DB
    from app.db import db
    with seeded_app.app_context():
        user = User.query.filter_by(email="david.wilson@enerlink.com").first()
        assert user is not None
        user.active = False
        db.session.commit()

    resp = seeded_client.post("/api/login", json={
        "email": "david.wilson@enerlink.com",
        "password": "analyst123"
    })
    assert resp.status_code == 403
    assert resp.get_json()["error"] == "Account is deactivated"

    # Restore activity for other tests
    with seeded_app.app_context():
        user = User.query.filter_by(email="david.wilson@enerlink.com").first()
        user.active = True
        db.session.commit()


def test_logout_success(seeded_client, auth_header):
    resp = seeded_client.post("/api/logout", headers=auth_header)
    assert resp.status_code == 200
    assert resp.get_json()["message"] == "Logout successful"

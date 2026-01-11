import os
import sys
import pytest

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from app import create_app
from app.db import db

TEST_DB_PATH = os.path.join(os.path.dirname(__file__), "test.db")

@pytest.fixture(scope="session")
def app():
    os.environ["DATABASE_URL"] = f"sqlite:///{TEST_DB_PATH}"
    os.environ["TESTING"] = "1"

    if os.path.exists(TEST_DB_PATH):
        os.remove(TEST_DB_PATH)

    app = create_app()
    app.config.update(TESTING=True)

    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

    if os.path.exists(TEST_DB_PATH):
        os.remove(TEST_DB_PATH)


@pytest.fixture(scope="session")
def seeded_app(app):
    from seed_database import seed_database
    seed_database(app)
    return app


# ✅ CLEAN DB CLIENT (default)
@pytest.fixture()
def client(app):
    return app.test_client()


# ✅ SEEDED CLIENT (for tests that require seed)
@pytest.fixture()
def seeded_client(seeded_app):
    return seeded_app.test_client()

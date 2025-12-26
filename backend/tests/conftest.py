import os
import pytest
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
    seed_database()
    return app


@pytest.fixture()
def client(seeded_app):
    return seeded_app.test_client()

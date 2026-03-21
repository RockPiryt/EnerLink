import os
from datetime import timedelta


class Config:
    """Flask application configuration."""
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev_secret_key")
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "c85c96e4216313e07875bb204349cbe2e784ff67dee22074a4f49e721972e38b")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)


    # Local SQLite database for development
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        f"sqlite:///{os.path.join(BASE_DIR, 'enerlink_dev.db')}"
    )    
    
    # # Database connection (PostgreSQL)
    # SQLALCHEMY_DATABASE_URI = os.environ.get(
    #     "DATABASE_URL",
    #     "postgresql+psycopg2://ener:link@localhost:5432/enerlink_db"
    # )

    # Disable SQLAlchemy modification tracking warnings
    SQLALCHEMY_TRACK_MODIFICATIONS = False

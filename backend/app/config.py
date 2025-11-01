import os

class Config:
    """Flask application configuration."""
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev_secret_key")

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

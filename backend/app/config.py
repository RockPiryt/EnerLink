import os

class Config:
    """Konfiguracja aplikacji Flask."""
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev_secret_key")

    # Połączenie z bazą danych (PostgreSQL)
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        "postgresql+psycopg2://user:password@localhost:5432/mydb"
    )

    # Wyłączenie ostrzeżeń SQLAlchemy
    SQLALCHEMY_TRACK_MODIFICATIONS = False

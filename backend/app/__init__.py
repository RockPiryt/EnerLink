from flask import Flask
from flask_migrate import Migrate
from .config import Config
from .db import db
from . import models

migrate = Migrate()

def create_app():
    """Factory function to create a Flask app instance."""
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize database and migrations
    db.init_app(app)
    migrate.init_app(app, db)

    # Register blueprints
    from .routes.user_routes import user_bp
    app.register_blueprint(user_bp, url_prefix="/api/users")

    @app.route("/api/health")
    def health_check():
        return {"status": "ok"}

    return app

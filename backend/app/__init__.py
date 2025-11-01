from flask import Flask
from flask_migrate import Migrate
from flasgger import Swagger
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

    # Initialize Swagger
    swagger = Swagger(app)

    # Register blueprints
    from .routes.user_routes import user_bp
    app.register_blueprint(user_bp, url_prefix="/api/users")

    from .routes.auth_routes import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    @app.route("/api/health")
    def health_check():
        """Health check endpoint.
        ---
        responses:
          200:
            description: API is healthy
        """
        return {"status": "ok"}

    return app

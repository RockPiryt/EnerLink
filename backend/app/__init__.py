from flask import Flask
from flask_migrate import Migrate
from flask_cors import CORS
from flasgger import Swagger
from .config import Config
from .db import db
from . import models
from .routes import register_routes

migrate = Migrate()

def create_app():
    """Factory function to create a Flask app instance."""
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for frontend communication
    CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000"])

    # Initialize database and migrations
    db.init_app(app)
    migrate.init_app(app, db)

    # Initialize Swagger
    swagger = Swagger(app, template_file="../openapi.yaml")

    # Register blueprints
    register_routes(app)


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

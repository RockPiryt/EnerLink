from flask import Flask
from .config import Config
from .db import db

def create_app():
    """Factory function do tworzenia instancji aplikacji Flask."""
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)

    from .routes.user_routes import user_bp
    app.register_blueprint(user_bp, url_prefix="/api/users")

    @app.route("/api/health")
    def health_check():
        return {"status": "ok"}

    return app

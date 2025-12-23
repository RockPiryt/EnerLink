from .auth_routes import auth_bp
from .user_routes import user_bp
from .customer_routes import customer_bp
from .dictionary_routes import dictionary_bp
from .manager_routes import manager_bp
from .provider_routes import provider_bp
from .role_routes import role_bp
from .sales_routes import sale_bp
from .tag_routes import tag_bp

def register_routes(app):
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(user_bp, url_prefix="/api/users")
    app.register_blueprint(customer_bp, url_prefix="/api/customers/")
    app.register_blueprint(dictionary_bp, url_prefix="/api/dictionary")
    app.register_blueprint(manager_bp, url_prefix="/api/manager")
    app.register_blueprint(provider_bp, url_prefix="/api/providers")
    app.register_blueprint(role_bp, url_prefix="/api/roles")
    app.register_blueprint(sale_bp, url_prefix="/api/sales")
    app.register_blueprint(tag_bp, url_prefix="/api/tags")

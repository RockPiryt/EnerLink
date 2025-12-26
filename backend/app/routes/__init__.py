from .address_routes import address_bp
from .auth_routes import auth_bp
from .contract_routes import contract_bp
from .customer_routes import customer_bp
from .manager_routes import manager_bp
from .provider_routes import provider_bp
from .role_routes import role_bp
from .sales_routes import sale_bp
from .tag_routes import tag_bp
from .user_routes import user_bp

def register_routes(app):
    app.register_blueprint(address_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(contract_bp, url_prefix="/api")
    app.register_blueprint(customer_bp, url_prefix="/api")
    app.register_blueprint(manager_bp, url_prefix="/api")
    app.register_blueprint(provider_bp, url_prefix="/api")
    app.register_blueprint(role_bp, url_prefix="/api")
    app.register_blueprint(sale_bp, url_prefix="/api")
    app.register_blueprint(tag_bp, url_prefix="/api")
    app.register_blueprint(user_bp, url_prefix="/api")

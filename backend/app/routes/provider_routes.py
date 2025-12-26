from flask import Blueprint, request, jsonify
from app.models.supplier_model import EnergySupplier
from app import db

provider_bp = Blueprint("provider_bp", __name__)

# GET /providers  – list of energy providers
@provider_bp.route("/providers", methods=["GET"])
def get_providers():
    providers = EnergySupplier.query.all()
    return jsonify([p.to_dict() for p in providers]), 200

# POST /providers – add new provider
@provider_bp.route("/providers", methods=["POST"])
def add_provider():
    data = request.get_json() or {}
    name = data.get("name")

    if not name:
        return jsonify({"error": "Field 'name' is required"}), 400

    new_provider = EnergySupplier(name=name)
    db.session.add(new_provider)
    db.session.commit()

    return jsonify({
        "message": "Provider added",
        "provider": new_provider.to_dict()
    }), 201
 
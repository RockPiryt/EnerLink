from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError
from app.models.supplier_model import EnergySupplier
from app import db

provider_bp = Blueprint("provider_bp", __name__)


# GET /providers – list of energy providers
@provider_bp.route("/providers", methods=["GET"])
def get_providers():
    providers = EnergySupplier.query.all()
    return jsonify([p.to_dict() for p in providers]), 200


# POST /providers – add new provider
@provider_bp.route("/providers", methods=["POST"])
def add_provider():
    data = request.get_json(silent=True) or {}
    name = data.get("name")

    if not name:
        return jsonify({"error": "Field 'name' is required"}), 400

    new_provider = EnergySupplier(name=name)
    db.session.add(new_provider)

    try:
        db.session.flush()
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Provider already exists"}), 409

    return jsonify({
        "message": "Provider added",
        "provider": new_provider.to_dict()
    }), 201


# GET /providers/<id> – get single provider
@provider_bp.route("/providers/<int:id>", methods=["GET"])
def get_provider(id: int):
    provider = db.session.get(EnergySupplier, id)
    if not provider:
        return jsonify({"error": "Provider not found"}), 404

    return jsonify(provider.to_dict()), 200


# PUT /providers/<id> – update provider
@provider_bp.route("/providers/<int:id>", methods=["PUT"])
def update_provider(id: int):
    provider = db.session.get(EnergySupplier, id)
    if not provider:
        return jsonify({"error": "Provider not found"}), 404

    data = request.get_json(silent=True) or {}

    if "name" in data:
        provider.name = data["name"]

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Provider name already exists"}), 409

    return jsonify({"message": "Provider updated", "provider": provider.to_dict()}), 200


# DELETE /providers/<id> – delete provider
@provider_bp.route("/providers/<int:id>", methods=["DELETE"])
def delete_provider(id: int):
    provider = db.session.get(EnergySupplier, id)
    if not provider:
        return jsonify({"error": "Provider not found"}), 404

    db.session.delete(provider)

    try:
        db.session.commit()
    finally:
        db.session.remove()

    return jsonify({"message": "Provider deleted successfully"}), 200

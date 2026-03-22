from flask import Blueprint, request, jsonify
from app.models.supplier_model import EnergyTariff
from app.db import db
from flask_jwt_extended import jwt_required
supplier_bp = Blueprint("supplier_bp", __name__)

# GET /api/supplier/tariffs
@supplier_bp.route("/supplier/tariffs", methods=["GET"])
@jwt_required()
def get_tariffs():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    search = request.args.get('q', '', type=str)
    active = request.args.get('active', type=str)

    query = EnergyTariff.query

    if search:
        query = query.filter(EnergyTariff.name.ilike(f'%{search}%'))

    if active is not None:
        is_active = active.lower() == 'true'
        query = query.filter(EnergyTariff.is_active == is_active)

    tariffs = query.paginate(
        page=page,
        per_page=per_page,
        error_out=False
    )

    return jsonify({
        "items": [t.to_dict() for t in tariffs.items],
        "total": tariffs.total,
        "pages": tariffs.pages,
        "current_page": tariffs.page,
        "per_page": tariffs.per_page
    }), 200

# POST /api/supplier/tariffs
@supplier_bp.route("/supplier/tariffs", methods=["POST"])
@jwt_required()
def add_tariff():
    data = request.get_json(silent=True) or {}

    name = data.get("name")

    if not name:
        return jsonify({"error": "name is required"}), 400

    new_tariff = EnergyTariff(
        name=name,
        is_active=True
    )

    db.session.add(new_tariff)
    db.session.commit()

    return jsonify({"message": "Tariff added", "tariff": new_tariff.to_dict()}), 201

# GET /api/supplier/tariffs/<id>
@supplier_bp.route("/supplier/tariffs/<int:id>", methods=["GET"])
@jwt_required()
def get_tariff(id):
    tariff = EnergyTariff.query.get(id)
    if not tariff:
        return jsonify({"error": "Tariff not found"}), 404

    return jsonify(tariff.to_dict()), 200

# PUT /api/supplier/tariffs/<id>
@supplier_bp.route("/supplier/tariffs/<int:id>", methods=["PUT"])
@jwt_required()
def update_tariff(id):
    tariff = EnergyTariff.query.get(id)
    if not tariff:
        return jsonify({"error": "Tariff not found"}), 404

    data = request.get_json(silent=True) or {}

    if "name" in data:
        tariff.name = data["name"]

    if "is_active" in data:
        tariff.is_active = bool(data["is_active"])

    db.session.commit()

    return jsonify({"message": "Tariff updated", "tariff": tariff.to_dict()}), 200

# DELETE /api/supplier/tariffs/<id>
@supplier_bp.route("/supplier/tariffs/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_tariff(id):
    tariff = EnergyTariff.query.get(id)
    if not tariff:
        return jsonify({"error": "Tariff not found"}), 404

    db.session.delete(tariff)
    db.session.commit()

    return jsonify({"message": "Tariff deleted successfully"}), 200

# PATCH /api/supplier/tariffs/<id>/status
@supplier_bp.route("/supplier/tariffs/<int:id>/status", methods=["PATCH"])
@jwt_required()
def update_tariff_status(id):
    tariff = EnergyTariff.query.get(id)
    if not tariff:
        return jsonify({"error": "Tariff not found"}), 404

    data = request.get_json(silent=True) or {}
    if "is_active" not in data:
        return jsonify({"error": "'is_active' field is required"}), 400

    tariff.is_active = bool(data["is_active"])
    db.session.commit()

    return jsonify({"message": "Tariff status updated", "is_active": tariff.is_active}), 200
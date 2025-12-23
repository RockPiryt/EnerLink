from flask import Blueprint, request, jsonify
from app.models.address_model import Country
from app.db import db

address_bp = Blueprint("address_bp", __name__)

# GET /api/address/countries
@address_bp.route("/address/countries", methods=["GET"])
def get_countries():
    countries = Country.query.all()
    return jsonify([c.to_dict() for c in countries]), 200

# POST /api/address/countries
@address_bp.route("/address/countries", methods=["POST"])
def add_country():
    data = request.get_json(silent=True) or {}

    name = data.get("name")
    shortcut = data.get("shortcut")

    if not name or not shortcut:
        return jsonify({"error": "name and shortcut are required"}), 400

    new_country = Country(
        name=name,
        shortcut=shortcut,
        is_active=True
    )

    db.session.add(new_country)
    db.session.commit()

    return jsonify({"message": "Country added", "country": new_country.to_dict()}), 201

# PATCH /api/address/countries/<id>/status
@address_bp.route("/address/countries/<int:id>/status", methods=["PATCH"])
def update_country_status(id):
    country = Country.query.get(id)
    if not country:
        return jsonify({"error": "Country not found"}), 404

    data = request.get_json(silent=True) or {}
    if "is_active" not in data:
        return jsonify({"error": "'is_active' field is required"}), 400

    country.is_active = bool(data["is_active"])
    db.session.commit()

    return jsonify({"message": "Country status updated", "is_active": country.is_active}), 200

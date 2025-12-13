from flask import Blueprint, request, jsonify
from app.models.country_model import Country
from app import db

dictionary_bp = Blueprint("dictionary_bp", __name__)


# GET /dictionary/countries – list of countries
@dictionary_bp.route("/dictionary/countries", methods=["GET"])
def get_countries():
    countries = Country.query.all()
    return jsonify([c.to_dict() for c in countries]), 200



# POST /dictionary/countries – add new country
@dictionary_bp.route("/dictionary/countries", methods=["POST"])
def add_country():
    data = request.get_json()

    name = data.get("name")
    shortcut = data.get("shortcut")

    if not name or not shortcut:
        return jsonify({"error": "name and shortcut are required"}), 400

    new_country = Country(
        name=name,
        shortcut=shortcut,
        active=True
    )

    db.session.add(new_country)
    db.session.commit()

    return jsonify({
        "message": "Country added",
        "country": new_country.to_dict()
    }), 201



# PATCH /dictionary/countries/<id>/status – activate / deactivate country
@dictionary_bp.route("/dictionary/countries/<int:id>/status", methods=["PATCH"])
def update_country_status(id):
    country = Country.query.get(id)
    if not country:
        return jsonify({"error": "Country not found"}), 404

    data = request.get_json()

    if "active" not in data:
        return jsonify({"error": "'active' field is required"}), 400

    country.active = data["active"]
    db.session.commit()

    return jsonify({
        "message": "Country status updated",
        "active": country.active
    }), 200

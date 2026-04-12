from flask import Blueprint, request, jsonify
from app.db import db
from app.models.address_model import District, City, Country
from app.services.teryt_service import get_districts, get_localities
from app.services.countries_service import get_countries
from flask_jwt_extended import jwt_required


location_bp = Blueprint("location", __name__, url_prefix="/api/location")

@location_bp.route("/districts/sync", methods=["POST"])
@jwt_required()
def sync_districts():
    try:
        districts_from_teryt = get_districts()

        existing_names = {d.name for d in District.query.all()}

        new_districts = []
        for item in districts_from_teryt:
            name = item["name"]
            if name not in existing_names:
                new_districts.append(District(name=name))

        if new_districts:
            db.session.add_all(new_districts)
            db.session.commit()

        return jsonify({
            "message": "Synchronization completed.",
            "added": len(new_districts),
            "total": District.query.count()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    

@location_bp.route("/localities/sync", methods=["POST"])
@jwt_required()
def sync_localities():
    try:
        localities_from_teryt = get_localities()

        existing_names = {c.name for c in City.query.all()}

        new_cities = []
        for item in localities_from_teryt:
            name = item["name"]
            if name not in existing_names:
                new_cities.append(City(name=name))

        if new_cities:
            db.session.add_all(new_cities)
            db.session.commit()

        return jsonify({
            "message": "Synchronization completed.",
            "added": len(new_cities),
            "total": City.query.count()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@location_bp.route("/countries/sync", methods=["POST"])
@jwt_required()
def sync_countries():
    try:
        countries_from_lib = get_countries()

        existing_names = {c.name for c in Country.query.all()}

        new_countries = []
        for item in countries_from_lib:
            if item["name"] not in existing_names:
                new_countries.append(Country(
                    name=item["name"],
                    shortcut=item["shortcut"]
                ))

        if new_countries:
            db.session.add_all(new_countries)
            db.session.commit()

        return jsonify({
            "message": "Synchronization completed.",
            "added": len(new_countries),
            "total": Country.query.count()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

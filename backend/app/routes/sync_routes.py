
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from app.services.teryt_service import get_districts, get_localities
from app.services.countries_service import get_countries
from app.db import db
from app.models.address_model import District, City, Country, Address
from app.services.postcode_service import get_postcodes_for_city

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from app.services.teryt_service import get_districts, get_localities
from app.services.countries_service import get_countries
from app.db import db
from app.models.address_model import District, City, Country, Address
from app.services.postcode_service import get_postcodes_for_city
sync_bp = Blueprint("sync_bp", __name__)
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from app.services.teryt_service import get_districts, get_localities
from app.services.countries_service import get_countries
from app.db import db
from app.models.address_model import District, City, Country, Address
from app.services.postcode_service import get_postcodes_for_city

sync_bp = Blueprint("sync_bp", __name__)

@sync_bp.route("/sync/postcodes", methods=["POST", "OPTIONS"])
@jwt_required()
def sync_postcodes():
    # Pobierz wszystkie miasta z bazy
    cities = City.query.all()
    total_added = 0
    for city in cities:
        postcodes = get_postcodes_for_city(city.name)
        for postcode in postcodes:
            # Dodaj jeśli nie istnieje
            exists = Address.query.filter_by(post_code=postcode, id_city=city.id).first()
            if not exists:
                addr = Address(post_code=postcode, id_city=city.id)
                db.session.add(addr)
                total_added += 1
    db.session.commit()
    return jsonify({"added": total_added, "total": Address.query.count(), "message": "Postcodes synchronized"}), 200

@sync_bp.route("/sync/countries", methods=["POST"])
@jwt_required()
def sync_countries():
    countries_from_lib = get_countries()
    existing_names = {c.name for c in Country.query.all()}
    new_countries = [Country(name=item["name"], shortcut=item["shortcut"]) for item in countries_from_lib if item["name"] not in existing_names]
    if new_countries:
        db.session.add_all(new_countries)
        db.session.commit()
    return jsonify({"added": len(new_countries), "total": Country.query.count(), "message": "Countries synchronized"}), 200

@sync_bp.route("/sync/districts", methods=["POST"])
@jwt_required()
def sync_districts():
    districts_from_teryt = get_districts()
    existing_names = {d.name for d in District.query.all()}
    new_districts = [District(name=item["name"]) for item in districts_from_teryt if item["name"] not in existing_names]
    if new_districts:
        db.session.add_all(new_districts)
        db.session.commit()
    return jsonify({"added": len(new_districts), "total": District.query.count(), "message": "Districts synchronized"}), 200

@sync_bp.route("/sync/cities", methods=["POST"])
@jwt_required()
def sync_cities():
    localities_from_teryt = get_localities()
    existing_names = {c.name for c in City.query.all()}
    new_cities = [City(name=item["name"]) for item in localities_from_teryt if item["name"] not in existing_names]
    if new_cities:
        db.session.add_all(new_cities)
        db.session.commit()
    return jsonify({"added": len(new_cities), "total": City.query.count(), "message": "Cities synchronized"}), 200

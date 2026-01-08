from flask import Blueprint, request, jsonify
from app.models.address_model import Country, City
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

# GET /api/address/cities
@address_bp.route("/address/cities", methods=["GET"])
def get_cities():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    search = request.args.get('q', '', type=str)
    active = request.args.get('active', type=str)

    query = City.query

    # Search filter
    if search:
        query = query.filter(City.name.ilike(f'%{search}%'))

    # Active filter
    if active is not None:
        is_active = active.lower() == 'true'
        query = query.filter(City.is_active == is_active)

    # Pagination
    cities = query.paginate(
        page=page,
        per_page=per_page,
        error_out=False
    )

    return jsonify({
        "items": [c.to_dict() for c in cities.items],
        "total": cities.total,
        "pages": cities.pages,
        "current_page": cities.page,
        "per_page": cities.per_page
    }), 200

# POST /api/address/cities
@address_bp.route("/address/cities", methods=["POST"])
def add_city():
    data = request.get_json(silent=True) or {}

    name = data.get("name")

    if not name:
        return jsonify({"error": "name is required"}), 400

    new_city = City(
        name=name,
        is_active=True
    )

    db.session.add(new_city)
    db.session.commit()

    return jsonify({"message": "City added", "city": new_city.to_dict()}), 201

# GET /api/address/cities/<id>
@address_bp.route("/address/cities/<int:id>", methods=["GET"])
def get_city(id):
    city = City.query.get(id)
    if not city:
        return jsonify({"error": "City not found"}), 404

    return jsonify(city.to_dict()), 200

# PUT /api/address/cities/<id>
@address_bp.route("/address/cities/<int:id>", methods=["PUT"])
def update_city(id):
    city = City.query.get(id)
    if not city:
        return jsonify({"error": "City not found"}), 404

    data = request.get_json(silent=True) or {}

    if "name" in data:
        city.name = data["name"]

    if "is_active" in data:
        city.is_active = bool(data["is_active"])

    db.session.commit()

    return jsonify({"message": "City updated", "city": city.to_dict()}), 200

# DELETE /api/address/cities/<id>
@address_bp.route("/address/cities/<int:id>", methods=["DELETE"])
def delete_city(id):
    city = City.query.get(id)
    if not city:
        return jsonify({"error": "City not found"}), 404

    db.session.delete(city)
    db.session.commit()

    return jsonify({"message": "City deleted successfully"}), 200

# GET /api/address/districts
@address_bp.route("/address/districts", methods=["GET"])
def get_districts():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    search = request.args.get('q', '', type=str)
    active = request.args.get('active', type=str)

    query = District.query

    if search:
        query = query.filter(District.name.ilike(f'%{search}%'))

    if active is not None:
        is_active = active.lower() == 'true'
        query = query.filter(District.is_active == is_active)

    districts = query.paginate(
        page=page,
        per_page=per_page,
        error_out=False
    )

    return jsonify({
        "items": [d.to_dict() for d in districts.items],
        "total": districts.total,
        "pages": districts.pages,
        "current_page": districts.page,
        "per_page": districts.per_page
    }), 200

# POST /api/address/districts
@address_bp.route("/address/districts", methods=["POST"])
def add_district():
    data = request.get_json(silent=True) or {}

    name = data.get("name")

    if not name:
        return jsonify({"error": "name is required"}), 400

    new_district = District(
        name=name,
        is_active=True
    )

    db.session.add(new_district)
    db.session.commit()

    return jsonify({"message": "District added", "district": new_district.to_dict()}), 201

# GET /api/address/districts/<id>
@address_bp.route("/address/districts/<int:id>", methods=["GET"])
def get_district(id):
    district = District.query.get(id)
    if not district:
        return jsonify({"error": "District not found"}), 404

    return jsonify(district.to_dict()), 200

# PUT /api/address/districts/<id>
@address_bp.route("/address/districts/<int:id>", methods=["PUT"])
def update_district(id):
    district = District.query.get(id)
    if not district:
        return jsonify({"error": "District not found"}), 404

    data = request.get_json(silent=True) or {}

    if "name" in data:
        district.name = data["name"]

    if "is_active" in data:
        district.is_active = bool(data["is_active"])

    db.session.commit()

    return jsonify({"message": "District updated", "district": district.to_dict()}), 200

# DELETE /api/address/districts/<id>
@address_bp.route("/address/districts/<int:id>", methods=["DELETE"])
def delete_district(id):
    district = District.query.get(id)
    if not district:
        return jsonify({"error": "District not found"}), 404

    db.session.delete(district)
    db.session.commit()

    return jsonify({"message": "District deleted successfully"}), 200

# PATCH /api/address/districts/<id>/status
@address_bp.route("/address/districts/<int:id>/status", methods=["PATCH"])
def update_district_status(id):
    district = District.query.get(id)
    if not district:
        return jsonify({"error": "District not found"}), 404

    data = request.get_json(silent=True) or {}
    if "is_active" not in data:
        return jsonify({"error": "'is_active' field is required"}), 400

    district.is_active = bool(data["is_active"])
    db.session.commit()

    return jsonify({"message": "District status updated", "is_active": district.is_active}), 200
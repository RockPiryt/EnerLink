from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from flask_cors import cross_origin
from app.services.postcode_service import get_postcode, get_postcodes_for_city, get_city_for_postcode
import re

postcode_bp = Blueprint("postcode", __name__, url_prefix="/api/postcode")



# Add support for OPTIONS (CORS preflight)

@postcode_bp.route("/search", methods=["GET", "OPTIONS"])
@cross_origin(origins=["http://localhost:3000", "http://127.0.0.1:3000"], supports_credentials=True)
def search_postcode():
    if request.method == "OPTIONS":
        return ('', 204)

    # Require JWT only for GET
    from flask_jwt_extended import verify_jwt_in_request
    verify_jwt_in_request()

    city   = request.args.get("city", "").strip()
    street = request.args.get("street", "").strip()
    number = request.args.get("number", "").strip()

    if not city:
        return jsonify({"error": "Parameter 'city' is required."}), 400

    postcode = get_postcode(city, street, number)
    if postcode:
        return jsonify({
            "source":   "nominatim",
            "type":     "single",
            "postcode": postcode,
        }), 200

    postcodes = get_postcodes_for_city(city)
    if postcodes:
        return jsonify({
            "source":    "intami",
            "type":      "list",
            "postcodes": postcodes,
        }), 200

    return jsonify({"error": f"No postcode found for city '{city}'."}), 404




@postcode_bp.route("/city/<string:postcode>", methods=["GET", "OPTIONS"])
@cross_origin(origins=["http://localhost:3000", "http://127.0.0.1:3000"], supports_credentials=True)
def search_city_by_postcode(postcode):
    if request.method == "OPTIONS":
        # Do NOT require JWT for OPTIONS
        return ('', 204)

    # Require JWT only for GET
    from flask_jwt_extended import verify_jwt_in_request
    verify_jwt_in_request()

    if not re.match(r"^\d{2}-\d{3}$", postcode):
        return jsonify({"error": "Invalid postcode format — expected XX-XXX."}), 400

    cities = get_city_for_postcode(postcode)
    if not cities:
        return jsonify({"error": f"No cities found for postcode '{postcode}'."}), 404

    return jsonify({
        "postcode": postcode,
        "cities":   cities,
    }), 200
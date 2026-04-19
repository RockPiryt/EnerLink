from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from app.services.post_code_service import get_postcode, get_postcodes_for_city

postcode_bp = Blueprint("postcode", __name__, url_prefix="/api/postcode")


@postcode_bp.route("/search", methods=["GET"])
@jwt_required()
def search_postcode():
    
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
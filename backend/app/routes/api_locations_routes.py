from flask import Blueprint, request, jsonify
from app.db import db
from app.models.address_model import District
from app.services.teryt_service import get_districts
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
            "message": "Synchronizacja zakończona.",
            "added": len(new_districts),
            "total": District.query.count()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

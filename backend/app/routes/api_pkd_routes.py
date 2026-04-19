from flask import Blueprint, jsonify
from app.db import db
from app.models.pkwiu_model import Pkwiu
from app.services.gus_service import fetch_pkd_catalog
from flask_jwt_extended import jwt_required

pkd_bp = Blueprint("pkd", __name__, url_prefix="/api/pkd")


@pkd_bp.route("/", methods=["GET"])
@jwt_required()
def get_all_pkd():
    items = Pkwiu.query.all()
    return jsonify([item.to_dict() for item in items]), 200


@pkd_bp.route("/import", methods=["POST"])
@jwt_required()
def import_pkd():
    try:
        catalog = fetch_pkd_catalog()
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 502

    try:
        Pkwiu.query.delete()

        for entry in catalog:
            pkd = Pkwiu(
                pkwiu_nr=entry["code"],
                pkwiu_name=entry["name"]
            )
            db.session.add(pkd)

        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Database error: {str(e)}"}), 500

    return jsonify({"message": f"Imported {len(catalog)} PKD entries."}), 201


@pkd_bp.route("/<string:pkd_nr>", methods=["GET"])
@jwt_required()
def get_pkd_by_nr(pkd_nr):
    item = Pkwiu.query.filter_by(pkwiu_nr=pkd_nr).first()
    if not item:
        return jsonify({"error": f"PKD '{pkd_nr}' not found."}), 404
    return jsonify(item.to_dict()), 200
from flask import Blueprint, request, jsonify
from app.models.pkwiu_model import Pkwiu
from app.db import db

pkwiu_bp = Blueprint("pkwiu_bp", __name__)

# GET /api/pkwiu
@pkwiu_bp.route("/pkwiu", methods=["GET"])
def get_pkwiu():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    search = request.args.get('q', '', type=str)

    query = Pkwiu.query

    # Search filter
    if search:
        query = query.filter(
            db.or_(
                Pkwiu.pkwiu_nr.ilike(f'%{search}%'),
                Pkwiu.pkwiu_name.ilike(f'%{search}%')
            )
        )

    # Pagination
    pkwiu_items = query.paginate(
        page=page,
        per_page=per_page,
        error_out=False
    )

    return jsonify({
        "items": [p.to_dict() for p in pkwiu_items.items],
        "total": pkwiu_items.total,
        "pages": pkwiu_items.pages,
        "current_page": pkwiu_items.page,
        "per_page": pkwiu_items.per_page
    }), 200

# POST /api/pkwiu
@pkwiu_bp.route("/pkwiu", methods=["POST"])
def add_pkwiu():
    data = request.get_json(silent=True) or {}

    pkwiu_nr = data.get("pkwiu_nr")
    pkwiu_name = data.get("pkwiu_name")

    if not pkwiu_nr or not pkwiu_name:
        return jsonify({"error": "pkwiu_nr and pkwiu_name are required"}), 400

    new_pkwiu = Pkwiu(
        pkwiu_nr=pkwiu_nr,
        pkwiu_name=pkwiu_name
    )

    db.session.add(new_pkwiu)
    db.session.commit()

    return jsonify({"message": "PKWiU added", "pkwiu": new_pkwiu.to_dict()}), 201

# GET /api/pkwiu/<id>
@pkwiu_bp.route("/pkwiu/<int:id>", methods=["GET"])
def get_pkwiu_item(id):
    pkwiu = Pkwiu.query.get(id)
    if not pkwiu:
        return jsonify({"error": "PKWiU not found"}), 404

    return jsonify(pkwiu.to_dict()), 200

# PUT /api/pkwiu/<id>
@pkwiu_bp.route("/pkwiu/<int:id>", methods=["PUT"])
def update_pkwiu(id):
    pkwiu = Pkwiu.query.get(id)
    if not pkwiu:
        return jsonify({"error": "PKWiU not found"}), 404

    data = request.get_json(silent=True) or {}

    if "pkwiu_nr" in data:
        pkwiu.pkwiu_nr = data["pkwiu_nr"]

    if "pkwiu_name" in data:
        pkwiu.pkwiu_name = data["pkwiu_name"]

    db.session.commit()

    return jsonify({"message": "PKWiU updated", "pkwiu": pkwiu.to_dict()}), 200

# DELETE /api/pkwiu/<id>
@pkwiu_bp.route("/pkwiu/<int:id>", methods=["DELETE"])
def delete_pkwiu(id):
    pkwiu = Pkwiu.query.get(id)
    if not pkwiu:
        return jsonify({"error": "PKWiU not found"}), 404

    db.session.delete(pkwiu)
    db.session.commit()

    return jsonify({"message": "PKWiU deleted successfully"}), 200
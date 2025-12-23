from flask import Blueprint, request, jsonify
from app.db import db
from app.models.tag_model import Tag

tag_bp = Blueprint("tag_bp", __name__)

# GET /tags – list of tags
@tag_bp.route("/tags", methods=["GET"])
def get_tags():
    tags = Tag.query.all()
    return jsonify([tag.to_dict() for tag in tags]), 200


# POST /tags – add tag
@tag_bp.route("/tags", methods=["POST"])
def add_tag():
    data = request.get_json(silent=True) or {}

    name = data.get("name")
    if not name:
        return jsonify({"error": "Tag name is required"}), 400

    # optional: prevent duplicates
    if Tag.query.filter_by(name=name).first():
        return jsonify({"error": "Tag already exists"}), 409

    new_tag = Tag(name=name)
    db.session.add(new_tag)
    db.session.commit()

    return jsonify({
        "message": "Tag added",
        "tag": new_tag.to_dict()
    }), 201

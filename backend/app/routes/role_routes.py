from flask import Blueprint, request, jsonify
from app.models.user_model import Role
from app import db
from flask_jwt_extended import jwt_required
role_bp = Blueprint("role_bp", __name__)

# GET /roles – list all roles
@role_bp.route("/roles", methods=["GET"])
@jwt_required()
def get_roles():
    roles = Role.query.all()
    return jsonify([r.to_dict() for r in roles]), 200

# POST /roles – create a new role
@role_bp.route("/roles", methods=["POST"])
@jwt_required()
def add_role():
    data = request.get_json(silent=True) or {}
    role_name = data.get("role_name")

    if not role_name:
        return jsonify({"error": "Field 'role_name' is required"}), 400

    new_role = Role(role_name=role_name)
    db.session.add(new_role)
    db.session.commit()

    return jsonify({"message": "Role created", "role": new_role.to_dict()}), 201

# GET /roles/<id> – get role details
@role_bp.route("/roles/<int:id>", methods=["GET"])
@jwt_required()
def get_role(id):
    role = Role.query.get(id)
    if not role:
        return jsonify({"error": "Role not found"}), 404
    return jsonify(role.to_dict()), 200

# PUT /roles/<id> – update role
@role_bp.route("/roles/<int:id>", methods=["PUT"])
@jwt_required()
def update_role(id):
    role = Role.query.get(id)
    if not role:
        return jsonify({"error": "Role not found"}), 404

    data = request.get_json(silent=True) or {}
    role.role_name = data.get("role_name", role.role_name)
    role.active = data.get("active", role.active)

    db.session.commit()
    return jsonify({"message": "Role updated", "role": role.to_dict()}), 200
# DELETE /roles/<id> – delete role
@role_bp.route("/roles/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_role(id):
    role = Role.query.get(id)
    if not role:
        return jsonify({"error": "Role not found"}), 404

    db.session.delete(role)
    db.session.commit()
    return jsonify({"message": "Role deleted"}), 200

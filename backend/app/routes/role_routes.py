from flask import Blueprint, request, jsonify
from app.models.role_model import Role
from app import db

role_bp = Blueprint("role_bp", __name__)



# GET /roles – list all roles
@role_bp.route("/roles", methods=["GET"])
def get_roles():
    roles = Role.query.all()
    return jsonify([r.to_dict() for r in roles]), 200



# POST /roles – create a new role
@role_bp.route("/roles", methods=["POST"])
def add_role():
    data = request.get_json()

    name = data.get("name")

    if not name:
        return jsonify({"error": "Field 'name' is required"}), 400

    new_role = Role(name=name)

    db.session.add(new_role)
    db.session.commit()

    return jsonify({
        "message": "Role created",
        "role": new_role.to_dict()
    }), 201



# GET /roles/<id> – get role details
@role_bp.route("/roles/<int:id>", methods=["GET"])
def get_role(id):
    role = Role.query.get(id)

    if not role:
        return jsonify({"error": "Role not found"}), 404

    return jsonify(role.to_dict()), 200



# PUT /roles/<id> – update role
@role_bp.route("/roles/<int:id>", methods=["PUT"])
def update_role(id):
    role = Role.query.get(id)

    if not role:
        return jsonify({"error": "Role not found"}), 404

    data = request.get_json()

    role.name = data.get("name", role.name)

    db.session.commit()

    return jsonify({
        "message": "Role updated",
        "role": role.to_dict()
    }), 200



# DELETE /roles/<id> – delete role
@role_bp.route("/roles/<int:id>", methods=["DELETE"])
def delete_role(id):
    role = Role.query.get(id)

    if not role:
        return jsonify({"error": "Role not found"}), 404

    db.session.delete(role)
    db.session.commit()

    return jsonify({"message": "Role deleted"}), 200

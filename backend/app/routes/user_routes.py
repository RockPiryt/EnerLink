from flask import Blueprint, request, jsonify
from flasgger import swag_from

from app.db import db
from app.models.user_model import User, Role

user_bp = Blueprint("user_bp", __name__)

@user_bp.route("/users", methods=["GET"])
@swag_from({
    "tags": ["Users"],
    "summary": "Get all users",
    "responses": {
        200: {
            "description": "List of all users",
            "examples": {
                "application/json": [
                    {
                        "id": "ADM001",
                        "first_name": "John",
                        "last_name": "Smith",
                        "e_mail": "admin@enerlink.com",
                        "id_role": 1,
                        "role_name": "Administrator",
                        "active": True,
                        "created_at": "2025-01-01T00:00:00"
                    }
                ]
            }
        }
    }
})
def get_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users]), 200


def _pick_default_role_id() -> int:
    # Prefer Analyst if exists, otherwise first role.
    role = Role.query.filter_by(role_name="Analyst").first() or Role.query.first()
    return role.id if role else 1  # fallback; in praktyce Role powinien istnieć po seedzie


def _generate_user_id() -> str:
    # Generates USR001, USR002... based on existing USR* ids.
    existing = User.query.filter(User.id.like("USR%")).all()
    nums = []
    for u in existing:
        suf = u.id[3:]
        if suf.isdigit():
            nums.append(int(suf))
    next_num = (max(nums) + 1) if nums else 1
    return f"USR{next_num:03d}"


@user_bp.route("/users", methods=["POST"])
@swag_from({
    "tags": ["Users"],
    "summary": "Create new user (minimal, test-compatible)",
    "parameters": [
        {
            "name": "body",
            "in": "body",
            "required": True,
            "schema": {
                "type": "object",
                "required": ["username", "email"],
                "properties": {
                    "username": {"type": "string", "example": "testuser1"},
                    "email": {"type": "string", "example": "test1@example.com"}
                }
            }
        }
    ],
    "responses": {
        201: {"description": "User created successfully"},
        400: {"description": "Missing data or user already exists"},
        500: {"description": "Internal server error"}
    }
})
def create_user():
    data = request.get_json(silent=True) or {}
    username = data.get("username")
    email = data.get("email")

    if not username or not email:
        return jsonify({"error": "Missing username or email"}), 400

    existing = User.query.filter_by(e_mail=email).first()
    if existing:
        return jsonify({"error": "User already exists"}), 400

    try:
        new_user = User(
            id=_generate_user_id(),
            first_name=str(username),
            last_name="User",              # wymagane przez model
            e_mail=str(email),
            id_role=_pick_default_role_id(),  # wymagane przez model
            active=True
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify(new_user.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

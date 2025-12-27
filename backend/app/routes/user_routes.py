from flask import Blueprint, request, jsonify
from flasgger import swag_from
from sqlalchemy import or_
from werkzeug.security import generate_password_hash

from app.db import db
from app.models.user_model import User, Role, Password

user_bp = Blueprint("user_bp", __name__)

def _pick_default_role_id(role_name: str | None) -> int:
    if role_name:
        role = Role.query.filter_by(role_name=role_name).first()
        if role:
            return role.id
    # fallback
    role = Role.query.filter_by(role_name="Analyst").first() or Role.query.first()
    return role.id

def _generate_user_id(prefix: str = "USR") -> str:
    existing = User.query.filter(User.id.like(f"{prefix}%")).all()
    nums = []
    for u in existing:
        suf = u.id[len(prefix):]
        if suf.isdigit():
            nums.append(int(suf))
    next_num = (max(nums) + 1) if nums else 1
    return f"{prefix}{next_num:03d}"


@user_bp.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users]), 200


@user_bp.route("/users", methods=["POST"])
@swag_from({
    "tags": ["Users"],
    "summary": "Create new user",
    "parameters": [{
        "name": "body",
        "in": "body",
        "required": True,
        "schema": {
            "type": "object",
            "required": ["username", "email", "password", "first_name", "last_name"],
            "properties": {
                "username": {"type": "string", "example": "johnsmith"},
                "email": {"type": "string", "example": "john@enerlink.com"},
                "password": {"type": "string", "example": "secret123"},
                "first_name": {"type": "string", "example": "John"},
                "last_name": {"type": "string", "example": "Smith"},
                "role_name": {"type": "string", "example": "Analyst"}
            }
        }
    }],
    "responses": {
        201: {"description": "User created successfully"},
        400: {"description": "Missing data or user already exists"}
    }
})
def create_user():
    data = request.get_json(silent=True) or {}

    username = (data.get("username") or "").strip()
    email = (data.get("email") or "").strip()
    password_plain = data.get("password")
    first_name = (data.get("first_name") or "").strip()
    last_name = (data.get("last_name") or "").strip()
    role_name = (data.get("role_name") or "").strip() or None

    if not username or not email or not password_plain or not first_name or not last_name:
        return jsonify({"error": "username, email, password, first_name, last_name are required"}), 400

    # Unikalność username i email
    existing = User.query.filter(or_(User.username == username, User.email == email)).first()
    if existing:
        return jsonify({"error": "User with this username or email already exists"}), 400

    try:
        # Hash hasła
        pw_hash = generate_password_hash(str(password_plain))

        pw = Password(pass_hash=pw_hash)
        db.session.add(pw)
        db.session.flush()

        user = User(
            id=_generate_user_id("USR"),
            username=username,
            first_name=first_name,
            last_name=last_name,
            email=email,
            id_role=_pick_default_role_id(role_name),
            id_pass=pw.id,
            active=True
        )
        db.session.add(user)
        db.session.commit()

        return jsonify(user.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

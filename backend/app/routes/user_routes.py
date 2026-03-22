from flask import Blueprint, request, jsonify
from flasgger import swag_from
from sqlalchemy import or_
from werkzeug.security import generate_password_hash
from flask_jwt_extended import jwt_required
from app.db import db
from app.models.user_model import User, Role, Password

user_bp = Blueprint("user_bp", __name__)

# Helpers
def _pick_default_role_id(role_name: str | None) -> int:
    if role_name:
        role = Role.query.filter_by(role_name=role_name).first()
        if role:
            return role.id
    role = Role.query.filter_by(role_name="Analyst").first() or Role.query.first()
    return role.id


def _get_role_id_or_400(role_name: str | None):
    if not role_name:
        return None
    role = Role.query.filter_by(role_name=role_name).first()
    if not role:
        return jsonify({"error": f"Unknown role_name: {role_name}"}), 400
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


def _conflict_check(username: str | None, email: str | None, exclude_user_id: str | None = None) -> bool:
    q = User.query
    if exclude_user_id:
        q = q.filter(User.id != exclude_user_id)
    filters = []
    if username:
        filters.append(User.username == username)
    if email:
        filters.append(User.email == email)
    if not filters:
        return False
    return q.filter(or_(*filters)).first() is not None


def _set_new_password_for_user(user: User, password_plain: str):
    pw_hash = generate_password_hash(str(password_plain))
    pw = Password(pass_hash=pw_hash)
    db.session.add(pw)
    db.session.flush()
    user.id_pass = pw.id



# READ: list
@user_bp.route("/users", methods=["GET"])
@jwt_required()
@swag_from({
    "tags": ["Users"],
    "summary": "List users",
    "parameters": [
        {"name": "q", "in": "query", "type": "string", "required": False,
         "description": "Search in username/email/first_name/last_name"},
        {"name": "active", "in": "query", "type": "boolean", "required": False,
         "description": "Filter by active status"},
        {"name": "page", "in": "query", "type": "integer", "required": False, "default": 1},
        {"name": "per_page", "in": "query", "type": "integer", "required": False, "default": 50},
    ],
    "responses": {200: {"description": "Users list"}}
})
def get_users():
    q = (request.args.get("q") or "").strip()
    active_raw = request.args.get("active")
    page = int(request.args.get("page") or 1)
    per_page = int(request.args.get("per_page") or 50)
    per_page = max(1, min(per_page, 200))

    query = User.query

    if active_raw is not None:
        active = str(active_raw).lower() in ("1", "true", "yes", "y", "t")
        query = query.filter(User.active == active)

    if q:
        like = f"%{q}%"
        query = query.filter(or_(
            User.username.ilike(like),
            User.email.ilike(like),
            User.first_name.ilike(like),
            User.last_name.ilike(like),
        ))

    pagination = query.order_by(User.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        "items": [u.to_dict() for u in pagination.items],
        "page": page,
        "per_page": per_page,
        "total": pagination.total,
        "pages": pagination.pages,
    }), 200



# READ: single
@user_bp.route("/users/<string:user_id>", methods=["GET"])
@jwt_required()
@swag_from({
    "tags": ["Users"],
    "summary": "Get user by id",
    "parameters": [{"name": "user_id", "in": "path", "type": "string", "required": True}],
    "responses": {200: {"description": "User"}, 404: {"description": "Not found"}}
})
def get_user(user_id: str):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.to_dict()), 200



# CREATE
@user_bp.route("/users", methods=["POST"])
@jwt_required()
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
                "role_name": {"type": "string", "example": "Analyst"},
                "active": {"type": "boolean", "example": True},
            }
        }
    }],
    "responses": {
        201: {"description": "User created successfully"},
        400: {"description": "Missing/invalid data"},
        409: {"description": "Username/email already exists"},
        500: {"description": "Server error"},
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
    active = bool(data.get("active", True))

    if not username or not email or not password_plain or not first_name or not last_name:
        return jsonify({"error": "username, email, password, first_name, last_name are required"}), 400

    if _conflict_check(username=username, email=email):
        return jsonify({"error": "User with this username or email already exists"}), 409

    role_id = _pick_default_role_id(role_name)

    try:
        user = User(
            id=_generate_user_id("USR"),
            username=username,
            first_name=first_name,
            last_name=last_name,
            email=email,
            id_role=role_id,
            active=active
        )
        db.session.add(user)

        _set_new_password_for_user(user, password_plain)

        db.session.commit()
        return jsonify(user.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500



# UPDATE (partial) - PATCH
@user_bp.route("/users/<string:user_id>", methods=["PATCH"])
@jwt_required()
@swag_from({
    "tags": ["Users"],
    "summary": "Update user (partial)",
    "parameters": [
        {"name": "user_id", "in": "path", "type": "string", "required": True},
        {
            "name": "body",
            "in": "body",
            "required": True,
            "schema": {
                "type": "object",
                "properties": {
                    "username": {"type": "string"},
                    "email": {"type": "string"},
                    "first_name": {"type": "string"},
                    "last_name": {"type": "string"},
                    "role_name": {"type": "string"},
                    "active": {"type": "boolean"},
                    "password": {"type": "string", "description": "If provided, creates a new Password and re-links user"},
                }
            }
        }
    ],
    "responses": {
        200: {"description": "User updated"},
        400: {"description": "Invalid data"},
        404: {"description": "Not found"},
        409: {"description": "Username/email conflict"},
        500: {"description": "Server error"},
    }
})
def update_user(user_id: str):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json(silent=True) or {}

    username = (data.get("username") or "").strip() if "username" in data else None
    email = (data.get("email") or "").strip() if "email" in data else None
    first_name = (data.get("first_name") or "").strip() if "first_name" in data else None
    last_name = (data.get("last_name") or "").strip() if "last_name" in data else None
    role_name = (data.get("role_name") or "").strip() if "role_name" in data else None
    password_plain = data.get("password") if "password" in data else None
    active = data.get("active") if "active" in data else None

    for field_name, value in [("username", username), ("email", email), ("first_name", first_name), ("last_name", last_name)]:
        if value is not None and value == "":
            return jsonify({"error": f"{field_name} cannot be empty"}), 400

    if (username is not None or email is not None) and _conflict_check(username=username, email=email, exclude_user_id=user.id):
        return jsonify({"error": "User with this username or email already exists"}), 409

    try:
        if username is not None:
            user.username = username
        if email is not None:
            user.email = email
        if first_name is not None:
            user.first_name = first_name
        if last_name is not None:
            user.last_name = last_name
        if active is not None:
            user.active = bool(active)

        if role_name is not None:
            role_id_or_resp = _get_role_id_or_400(role_name)
            if isinstance(role_id_or_resp, tuple):
                return role_id_or_resp
            user.id_role = role_id_or_resp

        if password_plain is not None:
            if not str(password_plain):
                return jsonify({"error": "password cannot be empty"}), 400
            _set_new_password_for_user(user, password_plain)

        db.session.commit()
        return jsonify(user.to_dict()), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500



# UPDATE (full) - PUT
@user_bp.route("/users/<string:user_id>", methods=["PUT"])
@jwt_required()
@swag_from({
    "tags": ["Users"],
    "summary": "Replace user (full update)",
    "parameters": [
        {"name": "user_id", "in": "path", "type": "string", "required": True},
        {
            "name": "body",
            "in": "body",
            "required": True,
            "schema": {
                "type": "object",
                "required": ["username", "email", "first_name", "last_name", "role_name", "active"],
                "properties": {
                    "username": {"type": "string"},
                    "email": {"type": "string"},
                    "first_name": {"type": "string"},
                    "last_name": {"type": "string"},
                    "role_name": {"type": "string"},
                    "active": {"type": "boolean"},
                    "password": {"type": "string", "description": "Optional: if provided, creates new Password and re-links user"},
                }
            }
        }
    ],
    "responses": {
        200: {"description": "User replaced"},
        400: {"description": "Invalid/missing data"},
        404: {"description": "Not found"},
        409: {"description": "Username/email conflict"},
        500: {"description": "Server error"},
    }
})
def replace_user(user_id: str):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json(silent=True) or {}

    username = (data.get("username") or "").strip()
    email = (data.get("email") or "").strip()
    first_name = (data.get("first_name") or "").strip()
    last_name = (data.get("last_name") or "").strip()
    role_name = (data.get("role_name") or "").strip()
    active = data.get("active", None)
    password_plain = data.get("password", None)

    if not username or not email or not first_name or not last_name or active is None or not role_name:
        return jsonify({"error": "username, email, first_name, last_name, role_name, active are required"}), 400

    if _conflict_check(username=username, email=email, exclude_user_id=user.id):
        return jsonify({"error": "User with this username or email already exists"}), 409

    role_id_or_resp = _get_role_id_or_400(role_name)
    if isinstance(role_id_or_resp, tuple):
        return role_id_or_resp

    try:
        user.username = username
        user.email = email
        user.first_name = first_name
        user.last_name = last_name
        user.id_role = role_id_or_resp
        user.active = bool(active)

        if password_plain is not None and str(password_plain):
            _set_new_password_for_user(user, password_plain)

        db.session.commit()
        return jsonify(user.to_dict()), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500



# DELETE 
@user_bp.route("/users/<string:user_id>", methods=["DELETE"])
@jwt_required()
@swag_from({
    "tags": ["Users"],
    "summary": "Delete user (soft delete: sets active=false)",
    "parameters": [
        {"name": "user_id", "in": "path", "type": "string", "required": True},
    ],
    "responses": {
        204: {"description": "User deactivated"},
        404: {"description": "Not found"},
        500: {"description": "Server error"},
    }
})
def delete_user(user_id: str):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        user.active = False
        db.session.commit()
        return ("", 204)

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@user_bp.route("/users/<string:user_id>/reset-password", methods=["POST"])
@jwt_required()
@swag_from({
    "tags": ["Users"],
    "summary": "Reset user password (creates new Password and re-links user)",
    "parameters": [
        {"name": "user_id", "in": "path", "type": "string", "required": True},
        {
            "name": "body",
            "in": "body",
            "required": True,
            "schema": {
                "type": "object",
                "required": ["password"],
                "properties": {
                    "password": {"type": "string", "example": "newSecret123"}
                }
            }
        }
    ],
    "responses": {
        200: {"description": "Password reset successfully"},
        400: {"description": "Invalid data"},
        404: {"description": "User not found"},
        500: {"description": "Server error"},
    }
})
def reset_password(user_id: str):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json(silent=True) or {}
    password_plain = data.get("password")

    if not password_plain or not str(password_plain).strip():
        return jsonify({"error": "password is required"}), 400

    try:
        _set_new_password_for_user(user, password_plain)
        db.session.commit()
        return jsonify({"message": "Password reset successfully", "user": user.to_dict()}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@user_bp.route("/users/<string:user_id>/activate", methods=["PATCH"])
@jwt_required()
@swag_from({
    "tags": ["Users"],
    "summary": "Activate user (sets active=true)",
    "parameters": [
        {"name": "user_id", "in": "path", "type": "string", "required": True},
    ],
    "responses": {
        200: {"description": "User activated"},
        404: {"description": "User not found"},
        500: {"description": "Server error"},
    }
})
def activate_user(user_id: str):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        user.active = True
        db.session.commit()
        return jsonify({"message": "User activated", "user": user.to_dict()}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

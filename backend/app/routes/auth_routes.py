from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from app.models.user_model import User, Role, Password
from flask_jwt_extended import create_access_token
auth_bp = Blueprint("auth_bp", __name__)

@auth_bp.route("/debug_reset_admin", methods=["POST"])
def debug_reset_admin():
    from app.db import db
    # Delete all users and passwords
    User.query.delete()
    Password.query.delete()
    db.session.commit()

    role = Role.query.filter_by(role_name="Administrator").first()
    if not role:
        role = Role(role_name="Administrator", active=True)
        db.session.add(role)
        db.session.commit()

    # Create debug admin user
    email = "debug_admin@enerlink.com"
    username = "debugadmin"
    password = "test1234"
    first_name = "Debug"
    last_name = "Admin"
    pw = Password(pass_hash=generate_password_hash(password))
    db.session.add(pw)
    db.session.flush()
    user = User(
        id="DBG001",
        username=username,
        first_name=first_name,
        last_name=last_name,
        email=email,
        id_role=role.id,
        id_pass=pw.id,
        active=True,
    )
    db.session.add(user)
    db.session.commit()
    return {"email": email, "password": password}, 201

@auth_bp.route("/debug_users_passwords", methods=["GET"])
def debug_users_passwords():
    users = User.query.all()
    result = []
    for u in users:
        result.append({
            "email": u.email,
            "username": u.username,
            "active": u.active,
            "password_hash": u.password.pass_hash if u.password else None
        })
    return {"users": result}, 200

@auth_bp.route("/debug_users", methods=["GET"])
def debug_users():
    users = User.query.all()
    return {"users": [u.to_dict() for u in users]}, 200

def _password_matches(stored: str, provided: str) -> bool:
    if not stored:
        return False
    if ":" in stored:
        try:
            return check_password_hash(stored, provided)
        except Exception:
            return stored == provided
    return stored == provided

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401
    if not user.active:
        return jsonify({"error": "Account is deactivated"}), 401
    stored_hash = user.password.pass_hash if user.password else None
    if stored_hash and _password_matches(stored_hash, str(password)):
        access_token = create_access_token(identity=str(user.id))
        return jsonify({
            "message": "Login successful",
            "token": access_token,
            "user": user.to_dict()
        }), 200
    return jsonify({"error": "Invalid credentials"}), 401

@auth_bp.route("/logout", methods=["POST"])
def logout():
    return jsonify({"message": "Logout successful"}), 200

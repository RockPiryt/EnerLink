from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash

from app.models.user_model import User

auth_bp = Blueprint("auth_bp", __name__)

def _password_matches(stored: str, provided: str) -> bool:
    """stored is a werkzeug hash (recommended)"""
    if not stored:
        return False

    # Heuristic: werkzeug hashes usually contain method prefix like "scrypt:" or "pbkdf2:"
    if ":" in stored:
        try:
            return check_password_hash(stored, provided)
        except Exception:
            # if something is malformed, fall back to plain compare
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

    # user.password is relationship to Password row
    stored_hash = user.password.pass_hash if user.password else None

    if stored_hash and _password_matches(stored_hash, str(password)):
        return jsonify({
            "message": "Login successful",
            "token": "fake-jwt",
            "user": user.to_dict()
        }), 200

    return jsonify({"error": "Invalid credentials"}), 401

@auth_bp.route("/logout", methods=["POST"])
def logout():
    """User logout."""
    return jsonify({"message": "Logout successful"}), 200

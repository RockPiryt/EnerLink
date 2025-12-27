from flask import Blueprint, request, jsonify
from app.models.user_model import User

auth_bp = Blueprint("auth_bp", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    """User login with database verification."""
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Find user by email
    user = User.query.filter_by(email=email).first()
    
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401
    
    # Check if user is active
    if not user.active:
        return jsonify({"error": "Account is deactivated"}), 401
    
    # Check password (in real app, use hashed passwords)
    if user.password and user.password.pass_hash == password:
        user_data = user.to_dict()
        return jsonify({
            "message": "Login successful", 
            "token": "fake-jwt",
            "user": user_data
        }), 200
    
    return jsonify({"error": "Invalid credentials"}), 401

@auth_bp.route("/logout", methods=["POST"])
def logout():
    """User logout."""
    return jsonify({"message": "Logout successful"}), 200

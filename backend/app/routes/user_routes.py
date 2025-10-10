from flask import Blueprint, request, jsonify
from app.db import db
from app.models.user_model import User

user_bp = Blueprint("user_bp", __name__)

@user_bp.route("/", methods=["GET"])
def get_users():
    """Zwraca listę wszystkich użytkowników."""
    users = User.query.all()
    return jsonify([user.to_dict() for user in users]), 200


@user_bp.route("/", methods=["POST"])
def create_user():
    """Dodaje nowego użytkownika."""
    data = request.get_json()

    if not data or "username" not in data or "email" not in data:
        return jsonify({"error": "Missing username or email"}), 400

    existing = User.query.filter(
        (User.username == data["username"]) | (User.email == data["email"])
    ).first()
    if existing:
        return jsonify({"error": "User already exists"}), 400

    new_user = User(username=data["username"], email=data["email"])
    db.session.add(new_user)
    db.session.commit()

    return jsonify(new_user.to_dict()), 201

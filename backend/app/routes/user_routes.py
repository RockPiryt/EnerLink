from flask import Blueprint, request, jsonify
from app.db import db
from app.models.user_model import User
from flasgger import swag_from

user_bp = Blueprint("user_bp", __name__)

@user_bp.route("/", methods=["GET"])
@swag_from({
    'tags': ['Users'],
    'summary': 'Get all users',
    'responses': {
        200: {
            'description': 'List of all users',
            'examples': {
                'application/json': [
                    {"id": 1, "username": "admin", "email": "admin@example.com"}
                ]
            }
        }
    }
})
def get_users():
    """Return list of all users."""
    users = User.query.all()
    return jsonify([user.to_dict() for user in users]), 200


@user_bp.route("/", methods=["POST"])
@swag_from({
    'tags': ['Users'],
    'summary': 'Create new user',
    'parameters': [
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'username': {'type': 'string'},
                    'email': {'type': 'string'}
                },
                'required': ['username', 'email']
            }
        }
    ],
    'responses': {
        201: {'description': 'User created successfully'},
        400: {'description': 'Missing data or user already exists'}
    }
})
def create_user():
    """Add a new user to the database."""
    data = request.get_json()

    if not data or not data.get("username") or not data.get("email"):
        return jsonify({"error": "Missing username or email"}), 400

    existing = User.query.filter(
        (User.username == data["username"]) | (User.email == data["email"])
    ).first()
    if existing:
        return jsonify({"error": "User already exists"}), 400

    try:
        new_user = User(username=data["username"], email=data["email"])
        db.session.add(new_user)
        db.session.commit()
        return jsonify(new_user.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

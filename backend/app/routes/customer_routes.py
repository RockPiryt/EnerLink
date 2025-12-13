from flask import Blueprint, request, jsonify
from app.models.customer_model import Customer
from app import db

customer_bp = Blueprint("customer_bp", __name__)


# GET /customers  – list of customers
@customer_bp.route("/customers", methods=["GET"])
def get_customers():
    customers = Customer.query.all()
    return jsonify([customer.to_dict() for customer in customers]), 200



# POST /customers – create new customer
@customer_bp.route("/customers", methods=["POST"])
def add_customer():
    data = request.get_json()

    company = data.get("company")
    email = data.get("email")

    if not company or not email:
        return jsonify({"error": "Company and email are required"}), 400

    new_customer = Customer(
        company=company,
        email=email,
        nip=data.get("nip"),
        phone=data.get("phone"),
        active=True
    )

    db.session.add(new_customer)
    db.session.commit()

    return jsonify({"message": "Customer created", "customer": new_customer.to_dict()}), 201



# GET /customers/<id> – customer details
@customer_bp.route("/customers/<int:id>", methods=["GET"])
def get_customer(id):
    customer = Customer.query.get(id)

    if not customer:
        return jsonify({"error": "Customer not found"}), 404

    return jsonify(customer.to_dict()), 200



# PUT /customers/<id> – update customer
@customer_bp.route("/customers/<int:id>", methods=["PUT"])
def update_customer(id):
    customer = Customer.query.get(id)
    if not customer:
        return jsonify({"error": "Customer not found"}), 404

    data = request.get_json()

    customer.company = data.get("company", customer.company)
    customer.email = data.get("email", customer.email)
    customer.nip = data.get("nip", customer.nip)
    customer.phone = data.get("phone", customer.phone)

    db.session.commit()
    return jsonify({"message": "Customer updated", "customer": customer.to_dict()}), 200



# PATCH /customers/<id> – activate/deactivate customer
@customer_bp.route("/customers/<int:id>", methods=["PATCH"])
def toggle_customer_status(id):
    customer = Customer.query.get(id)
    if not customer:
        return jsonify({"error": "Customer not found"}), 404

    data = request.get_json()
    if "active" not in data:
        return jsonify({"error": "'active' field is required"}), 400
    
    customer.active = data["active"]
    db.session.commit()

    return jsonify({"message": "Customer status updated", "active": customer.active}), 200

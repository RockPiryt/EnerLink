from flask import Blueprint, request, jsonify
from app.db import db
from app.models.customer_model import Customer
from app.models.address_model import Address
from app.models.address_relation_model import CustomerAddress
from flask_jwt_extended import jwt_required
customer_bp = Blueprint("customer_bp", __name__)


# GET /api/customers – list of customers
@customer_bp.route("/customers", methods=["GET"])
@jwt_required()
def get_customers():
    include_deleted = (request.args.get("include_deleted", "false").lower() == "true")

    q = Customer.query
    if not include_deleted and hasattr(Customer, "is_deleted"):
        q = q.filter(Customer.is_deleted.is_(False))

    customers = q.all()
    return jsonify([c.to_dict() for c in customers]), 200


# POST /api/customers – create new customer
@customer_bp.route("/customers", methods=["POST"])
@jwt_required()
def add_customer():
    data = request.get_json(silent=True) or {}

    company = data.get("company")
    email = data.get("email")

    if not company or not email:
        return jsonify({"error": "Company and email are required"}), 400

    new_customer = Customer(
        company=company,
        email=email,
        nip=data.get("nip"),
        phone=data.get("phone"),
        active=True,
        id_user=data.get("id_user"),
        id_tag=data.get("id_tag"),
        description=data.get("description"),
        is_deleted=bool(data.get("is_deleted")) if "is_deleted" in data else False,
    )

    db.session.add(new_customer)
    db.session.flush()

    addr_data = data.get("address")
    if addr_data:
        address = Address(
            street_name=addr_data.get("street_name"),
            building_nr=addr_data.get("building_nr"),
            apartment_nr=addr_data.get("apartment_nr"),
            post_code=addr_data.get("post_code"),
            id_city=addr_data.get("id_city"),
            id_district=addr_data.get("id_district"),
            id_country=addr_data.get("id_country"),
        )
        db.session.add(address)
        db.session.flush()

        link = CustomerAddress(
            id_customer=new_customer.id,
            id_address=address.id
        )
        db.session.add(link)

    db.session.commit()
    return jsonify({"message": "Customer created", "customer": new_customer.to_dict()}), 201

# GET /api/customers/<id> – customer details
@customer_bp.route("/customers/<int:id>", methods=["GET"])
@jwt_required()
def get_customer(id: int):
    customer = Customer.query.get(id)
    if not customer:
        return jsonify({"error": "Customer not found"}), 404

    return jsonify(customer.to_dict()), 200


# PUT /api/customers/<id> – update customer
@customer_bp.route("/customers/<int:id>", methods=["PUT"])
@jwt_required()
def update_customer(id: int):
    customer = Customer.query.get(id)
    if not customer:
        return jsonify({"error": "Customer not found"}), 404

    data = request.get_json(silent=True) or {}

    customer.company = data.get("company", customer.company)
    customer.email = data.get("email", customer.email)
    customer.nip = data.get("nip", customer.nip)
    customer.phone = data.get("phone", customer.phone)

    if "id_user" in data:
        customer.id_user = data.get("id_user")
    if "id_tag" in data:
        customer.id_tag = data.get("id_tag")
    if "description" in data:
        customer.description = data.get("description")
    if "is_deleted" in data:
        customer.is_deleted = bool(data.get("is_deleted"))

    addr_data = data.get("address")
    if addr_data is not None:
        if customer.customer_address and customer.customer_address.address:
            address = customer.customer_address.address
            address.street_name = addr_data.get("street_name", address.street_name)
            address.building_nr = addr_data.get("building_nr", address.building_nr)
            address.apartment_nr = addr_data.get("apartment_nr", address.apartment_nr)
            address.post_code = addr_data.get("post_code", address.post_code)
            address.id_city = addr_data.get("id_city", address.id_city)
            address.id_district = addr_data.get("id_district", address.id_district)
            address.id_country = addr_data.get("id_country", address.id_country)
        else:
            address = Address(
                street_name=addr_data.get("street_name"),
                building_nr=addr_data.get("building_nr"),
                apartment_nr=addr_data.get("apartment_nr"),
                post_code=addr_data.get("post_code"),
                id_city=addr_data.get("id_city"),
                id_district=addr_data.get("id_district"),
                id_country=addr_data.get("id_country"),
            )
            db.session.add(address)
            db.session.flush()

            link = CustomerAddress(id_customer=customer.id, id_address=address.id)
            db.session.add(link)

    db.session.commit()
    return jsonify({"message": "Customer updated", "customer": customer.to_dict()}), 200


# PATCH /api/customers/<id> – activate/deactivate
@customer_bp.route("/customers/<int:id>", methods=["PATCH"])
@jwt_required()
def toggle_customer_status(id: int):
    customer = Customer.query.get(id)
    if not customer:
        return jsonify({"error": "Customer not found"}), 404

    data = request.get_json(silent=True) or {}
    if "active" not in data:
        return jsonify({"error": "'active' field is required"}), 400

    customer.active = bool(data["active"])
    db.session.commit()

    return jsonify({"message": "Customer status updated", "active": customer.active}), 200

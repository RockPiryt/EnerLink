from flask import Blueprint, request, jsonify
from sqlalchemy import func, extract
from app.db import db

from app.models.customer_model import Customer
from app.models.contract_model import Contract
from app.models.assignment_model import Assignment

sale_bp = Blueprint("sale_bp", __name__)

# GET /api/sales/customers?rep_id=SAL001
@sale_bp.route("/sales/customers", methods=["GET"])
def list_sales_customers():
    rep_id = request.args.get("rep_id", type=str)
    if not rep_id:
        return jsonify([]), 200

    customers = (
        Customer.query
        .join(Assignment, Assignment.customer_id == Customer.id)
        .filter(Assignment.sales_rep_id == rep_id, Assignment.active.is_(True))
        .all()
    )

    return jsonify([
        {
            "id": c.id,
            "name": getattr(c, "company", None) or getattr(c, "name", None),
        }
        for c in customers
    ]), 200


# POST /api/sales/customers  { "customer_id": 1, "sales_rep_id": "SAL001" }
@sale_bp.route("/sales/customers", methods=["POST"])
def assign_customer_to_sales_rep():
    data = request.get_json(silent=True) or {}

    customer_id = data.get("customer_id")
    sales_rep_id = data.get("sales_rep_id")

    if not customer_id:
        return jsonify({"error": "customer_id is required"}), 400
    if not sales_rep_id:
        return jsonify({"error": "sales_rep_id is required (temporary until auth is enforced)"}), 400

    existing = Assignment.query.filter_by(
        customer_id=int(customer_id),
        sales_rep_id=str(sales_rep_id)
    ).first()

    if existing:
        if not existing.active:
            existing.active = True
            db.session.commit()
        return jsonify({
            "message": "Customer assigned",
            "customer_id": int(customer_id),
            "sales_rep_id": str(sales_rep_id)
        }), 200

    assignment = Assignment(customer_id=int(customer_id), sales_rep_id=str(sales_rep_id), active=True)
    db.session.add(assignment)
    db.session.commit()

    return jsonify({
        "message": "Customer assigned",
        "customer_id": int(customer_id),
        "sales_rep_id": str(sales_rep_id)
    }), 200


# GET /api/sales/analytics/contracts?year=2025
@sale_bp.route("/sales/analytics/contracts", methods=["GET"])
def contract_analytics():
    year = request.args.get("year", type=int)

    q = Contract.query
    if year:
        q = q.filter(extract("year", Contract.created_at) == year)

    monthly_rows = (
        q.with_entities(
            extract("month", Contract.created_at).label("month"),
            func.count(Contract.id).label("count")
        )
        .group_by("month")
        .order_by("month")
        .all()
    )

    yearly_rows = (
        Contract.query.with_entities(
            extract("year", Contract.created_at).label("year"),
            func.count(Contract.id).label("count")
        )
        .group_by("year")
        .order_by("year")
        .all()
    )

    monthly = [{"month": int(m), "count": int(c)} for m, c in monthly_rows]
    yearly = [{"year": int(y), "count": int(c)} for y, c in yearly_rows]

    return jsonify({"monthly": monthly, "yearly": yearly}), 200

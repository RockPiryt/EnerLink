from flask import Blueprint, request, jsonify
from sqlalchemy import func, extract
from app.db import db

from app.models.customer_model import Customer
from app.models.contract_model import Contract
from app.models.user_model import User

sale_bp = Blueprint("sale_bp", __name__)


# GET /api/sales/customers
@sale_bp.route("/customers", methods=["GET"])
def list_sales_customers():
    """List of sales representative customers."""
    rep_id = request.args.get("rep_id")  
    if rep_id is None:
        return jsonify([]), 200

    customers = (Customer.query
                 .join(Customer.assignments)  
                 .filter(Assignment.sales_rep_id == rep_id)
                 .all())
    return jsonify([{
        "id": c.id,
        "name": c.company,             
        "last_contact": c.last_contact  
    } for c in customers]), 200

    return jsonify([]), 200



# POST /api/sales/customers
@sale_bp.route("/customers", methods=["POST"])
def assign_customer_to_sales_rep():
    """Assign customer to representative."""
    data = request.get_json(silent=True) or {}
    customer_id = data.get("customer_id")

    if not customer_id:
        return jsonify({"error": "customer_id is required"}), 400

    sales_rep_id = data.get("sales_rep_id")  
    if not sales_rep_id:
        return jsonify({"error": "sales_rep_id is required (temporary until auth is enforced)"}), 400

    assignment = Assignment(customer_id=customer_id, sales_rep_id=sales_rep_id)
    db.session.add(assignment)
    db.session.commit()

    return jsonify({"message": "Customer assigned", "customer_id": customer_id, "sales_rep_id": sales_rep_id}), 200

# GET /api/sales/analytics/contracts
@sale_bp.route("/analytics/contracts", methods=["GET"])
def contract_analytics():
    """Contract statistics (monthly/yearly) for charts."""
    year = request.args.get("year", type=int)

    q = Contract.query
    if year:
        q = q.filter(extract("year", Contract.created_at) == year)
    
    monthly_rows = (q.with_entities(
        extract("month", Contract.created_at).label("month"),
        func.count(Contract.id).label("count")
    ).group_by("month").order_by("month").all())
    
    yearly_rows = (Contract.query.with_entities(
        extract("year", Contract.created_at).label("year"),
        func.count(Contract.id).label("count")
    ).group_by("year").order_by("year").all())
    
    monthly = [{"month": int(m), "count": int(c)} for m, c in monthly_rows]
    yearly = [{"year": int(y), "count": int(c)} for y, c in yearly_rows]
    
    return jsonify({"monthly": monthly, "yearly": yearly}), 200

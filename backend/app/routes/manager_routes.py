

from flask import Blueprint, jsonify, request
from datetime import datetime
from sqlalchemy import func, extract
from app.models.contract_model import Contract, ContractTimeline
from app.models.user_model import User
from app.models.customer_model import Customer
from app import db

manager_bp = Blueprint("manager", __name__)

@manager_bp.route("/manager/customer_service_report", methods=["GET"])
def customer_service_report():
    try:
        month = request.args.get("month", type=int)
        year = request.args.get("year", type=int)

        q = Contract.query
        if year:
            q = q.filter(extract("year", Contract.created_at) == year)
        if month:
            q = q.filter(extract("month", Contract.created_at) == month)

        contracts = q.all()
        customer_ids = set(c.id_customer for c in contracts if c.id_customer)
        num_customers = len(customer_ids)

        times = []
        for c in contracts:
            if c.signed_at and c.created_at:
                try:
                    delta = (c.signed_at - c.created_at.date()).days
                    if delta >= 0:
                        times.append(delta)
                except Exception as e:
                    print(f"Error calculating delta for contract {c.id}: {e}")
        avg_realization_days = round(sum(times) / len(times), 2) if times else None

        signed = sum(1 for c in contracts if c.signed_at)
        cancelled = sum(1 for c in contracts if hasattr(c, 'timelines') and c.timelines and any(t.status == "CANCELLED" for t in c.timelines))
        new = sum(1 for c in contracts if not c.signed_at and (not hasattr(c, 'timelines') or not c.timelines or all(t.status != "CANCELLED" for t in c.timelines)))

        return jsonify({
            "num_customers": num_customers,
            "avg_realization_days": avg_realization_days,
            "signed_contracts": signed,
            "cancelled_contracts": cancelled,
            "new_contracts": new
        }), 200
    except Exception as e:
        import traceback
        print("Error in customer_service_report:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500
from flask import Blueprint, jsonify




from sqlalchemy import func, extract
from app.models.contract_model import Contract
from app.models.user_model import User
from flask import request

@manager_bp.route("/manager/ranking", methods=["GET"])
def get_ranking():
    month = request.args.get("month", type=int)
    year = request.args.get("year", type=int)

    q = Contract.query
    if year:
        q = q.filter(extract("year", Contract.created_at) == year)
    if month:
        q = q.filter(extract("month", Contract.created_at) == month)

    rows = (
        q.with_entities(
            Contract.id_user,
            func.count(Contract.id).label("count")
        )
        .group_by(Contract.id_user)
        .order_by(func.count(Contract.id).desc())
        .all()
    )
    user_ids = [r[0] for r in rows if r[0] is not None]
    users = {u.id: f"{u.first_name} {u.last_name}" for u in User.query.filter(User.id.in_(user_ids)).all()}

    ranking = [
        {
            "id": id_user,
            "name": users.get(id_user, id_user),
            "value": count
        }
        for id_user, count in rows if id_user is not None
    ]

    from datetime import datetime
    ranking_data = {
        "ranking": ranking,
        "generated_at": datetime.utcnow().isoformat()
    }
    return jsonify(ranking_data), 200

@manager_bp.route("/manager/efficiency", methods=["GET"])
def get_salesperson_efficiency():
    year = None
    try:
        from flask import request
        year = request.args.get("year", type=int)
    except Exception:
        pass

    q = Contract.query
    if year:
        q = q.filter(extract("year", Contract.created_at) == year)

    rows = (
        q.with_entities(
            Contract.id_user,
            extract("month", Contract.created_at).label("month"),
            func.count(Contract.id).label("count")
        )
        .group_by(Contract.id_user, "month")
        .order_by(Contract.id_user, "month")
        .all()
    )

    user_ids = list({r[0] for r in rows if r[0] is not None})
    users = {u.id: f"{u.first_name} {u.last_name}" for u in User.query.filter(User.id.in_(user_ids)).all()}

    result = {}
    for id_user, month, count in rows:
        if id_user is None:
            continue
        name = users.get(id_user, id_user)
        if name not in result:
            result[name] = {}
        result[name][int(month)] = int(count)

    formatted = [
        {
            "salesperson": name,
            "monthly": [
                {"month": m, "count": result[name].get(m, 0)} for m in range(1, 13)
            ]
        }
        for name in sorted(result.keys())
    ]

    return jsonify({"efficiency": formatted}), 200

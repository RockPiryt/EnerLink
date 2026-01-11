from flask import Blueprint, jsonify

manager_bp = Blueprint("manager_bp", __name__)


from sqlalchemy import func, extract
from app.models.contract_model import Contract
from app.models.user_model import User

# Existing ranking endpoint
@manager_bp.route("/manager/ranking", methods=["GET"])
def get_ranking():
    ranking_data = {
        "ranking": [],
        "generated_at": None
    }
    return jsonify(ranking_data), 200

# New: Salesperson efficiency per month (contracts per salesperson per month)
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

    # Group by user (salesperson) and month
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

    # Get user names for id_user
    user_ids = list({r[0] for r in rows if r[0] is not None})
    users = {u.id: f"{u.first_name} {u.last_name}" for u in User.query.filter(User.id.in_(user_ids)).all()}

    # Build response: {salesperson: {month: count}}
    result = {}
    for id_user, month, count in rows:
        if id_user is None:
            continue
        name = users.get(id_user, id_user)
        if name not in result:
            result[name] = {}
        result[name][int(month)] = int(count)

    # Format for frontend: list of {salesperson, monthly: [{month, count}]}
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

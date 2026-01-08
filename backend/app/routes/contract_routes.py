
from flask import Blueprint, request, jsonify
from app.db import db
from app.models.contract_model import Contract, ContractTimeline
from app.models.user_model import User

contract_bp = Blueprint("contract_bp", __name__)

# GET /api/contracts/<id>/history – contract change history
@contract_bp.route("/contracts/<int:id>/history", methods=["GET"])
def get_contract_history(id: int):
    contract = Contract.query.get(id)
    if not contract:
        return jsonify({"error": "Contract not found"}), 404

    # Join ContractTimeline with User (if possible)
    history = []
    for t in contract.timelines:
        # Try to get user who changed status (if such info is available)
        # For now, fallback to None or 'System'
        changed_by = "System"
        # If you store user_id in timeline, you can fetch user here
        # Example: changed_by = User.query.get(t.id_user).username if t.id_user else "System"
        history.append({
            "id": t.id,
            "contract_id": t.id_contract,
            "changed_at": t.created_at.isoformat() if t.created_at else None,
            "changed_by": changed_by,
            "field": "status",
            "old_value": None,  # Not tracked in current model
            "new_value": t.status,
            "description": t.description,
        })
    # Sort by date ascending
    history.sort(key=lambda x: x["changed_at"])
    return jsonify(history), 200


# GET /api/contracts – list contracts
@contract_bp.route("/contracts", methods=["GET"])
def get_contracts():
    customer_id = request.args.get("customer_id", type=int)
    user_id = request.args.get("user_id", type=str)
    tag_id = request.args.get("tag_id", type=int)
    include_deleted = (request.args.get("include_deleted", "false").lower() == "true")

    from sqlalchemy.orm import joinedload
    q = Contract.query.options(joinedload(Contract.timelines))

    if not include_deleted:
        q = q.filter(Contract.is_deleted.is_(False))

    if customer_id is not None:
        q = q.filter(Contract.id_customer == customer_id)

    if user_id:
        q = q.filter(Contract.id_user == user_id)

    if tag_id is not None:
        q = q.filter(Contract.id_tag == tag_id)

    contracts = q.order_by(Contract.created_at.desc()).all()
    return jsonify([c.to_dict() for c in contracts]), 200


# POST /api/contracts – create contract
@contract_bp.route("/contracts", methods=["POST"])
def add_contract():
    data = request.get_json(silent=True) or {}

    id_customer = data.get("id_customer")
    contract_number = data.get("contract_number")

    if not id_customer or not contract_number:
        return jsonify({"error": "id_customer and contract_number are required"}), 400

    def parse_date(key: str):
        val = data.get(key)
        if not val:
            return None
        try:
            from datetime import date
            return date.fromisoformat(val)
        except Exception:
            raise ValueError(f"Invalid date format for '{key}'. Expected YYYY-MM-DD.")

    try:
        signed_at = parse_date("signed_at")
        contract_from = parse_date("contract_from")
        contract_to = parse_date("contract_to")
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


    try:
        contract = Contract(
            id_customer=int(id_customer),
            contract_number=str(contract_number),
            id_user=data.get("id_user"),
            id_tag=data.get("id_tag"),
            id_supplier_offer=data.get("id_supplier_offer"),
            signed_at=signed_at,
            contract_from=contract_from,
            contract_to=contract_to,
            is_deleted=False
        )
        db.session.add(contract)
        db.session.commit()


        status = data.get("status") or "Signed"  # Default to 'Signed' if not provided
        description = data.get("description")
        tl = ContractTimeline(
            id_contract=contract.id,
            status=str(status),
            description=str(description) if description else None
        )
        db.session.add(tl)
        db.session.commit()
        db.session.refresh(contract)  # Ensure timelines are up to date
        # Re-query contract to ensure timelines are loaded
        contract = Contract.query.get(contract.id)
        return jsonify({"message": "Contract created", "contract": contract.to_dict()}), 201
    except Exception as e:
        import traceback
        print("[ERROR] add_contract exception:", e)
        traceback.print_exc()
        db.session.rollback()
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500



# GET /api/contracts/<id> – contract details + timelines
@contract_bp.route("/contracts/<int:id>", methods=["GET"])
def get_contract(id: int):
    contract = Contract.query.get(id)
    if not contract:
        return jsonify({"error": "Contract not found"}), 404

    payload = contract.to_dict()
    payload["timelines"] = [t.to_dict() for t in contract.timelines] if contract.timelines else []
    return jsonify(payload), 200



# PUT /api/contracts/<id> – update contract
@contract_bp.route("/contracts/<int:id>", methods=["PUT"])
def update_contract(id: int):
    contract = Contract.query.get(id)
    if not contract:
        return jsonify({"error": "Contract not found"}), 404

    data = request.get_json(silent=True) or {}

    if "contract_number" in data:
        contract.contract_number = str(data["contract_number"])

    if "id_user" in data:
        contract.id_user = data["id_user"]

    if "id_tag" in data:
        contract.id_tag = data["id_tag"]

    if "id_supplier_offer" in data:
        contract.id_supplier_offer = data["id_supplier_offer"]

    def parse_date_if_present(key: str):
        if key not in data:
            return None, False
        val = data.get(key)
        if val is None or val == "":
            return None, True
        try:
            from datetime import date
            return date.fromisoformat(val), True
        except Exception:
            raise ValueError(f"Invalid date format for '{key}'. Expected YYYY-MM-DD.")

    try:
        signed_at, present = parse_date_if_present("signed_at")
        if present:
            contract.signed_at = signed_at

        contract_from, present = parse_date_if_present("contract_from")
        if present:
            contract.contract_from = contract_from

        contract_to, present = parse_date_if_present("contract_to")
        if present:
            contract.contract_to = contract_to

    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    db.session.commit()
    return jsonify({"message": "Contract updated", "contract": contract.to_dict()}), 200


# PATCH /api/contracts/<id>/deleted – soft delete / restore
@contract_bp.route("/contracts/<int:id>/deleted", methods=["PATCH"])
def toggle_contract_deleted(id: int):
    contract = Contract.query.get(id)
    if not contract:
        return jsonify({"error": "Contract not found"}), 404

    data = request.get_json(silent=True) or {}
    if "is_deleted" not in data:
        return jsonify({"error": "'is_deleted' field is required"}), 400

    contract.is_deleted = bool(data["is_deleted"])
    db.session.commit()

    return jsonify({"message": "Contract deleted flag updated", "is_deleted": contract.is_deleted}), 200

# GET /api/contracts/<id>/timeline – list timeline
@contract_bp.route("/contracts/<int:id>/timeline", methods=["GET"])
def get_contract_timeline(id: int):
    contract = Contract.query.get(id)
    if not contract:
        return jsonify({"error": "Contract not found"}), 404

    timelines = ContractTimeline.query.filter_by(id_contract=contract.id).order_by(ContractTimeline.created_at.desc()).all()
    return jsonify([t.to_dict() for t in timelines]), 200

# POST /api/contracts/<id>/timeline – add timeline entry
@contract_bp.route("/contracts/<int:id>/timeline", methods=["POST"])
def add_contract_timeline(id: int):
    contract = Contract.query.get(id)
    if not contract:
        return jsonify({"error": "Contract not found"}), 404

    data = request.get_json(silent=True) or {}
    status = data.get("status")
    if not status:
        return jsonify({"error": "status is required"}), 400

    tl = ContractTimeline(
        id_contract=contract.id,
        status=str(status),
        description=str(data.get("description")) if data.get("description") else None
    )
    db.session.add(tl)
    db.session.commit()

    return jsonify({"message": "Timeline entry added", "timeline": tl.to_dict()}), 201

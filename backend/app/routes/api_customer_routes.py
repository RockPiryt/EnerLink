from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from app.services.gus_service import gus_lookup
from app.services.mf_service import mf_lookup
from app.services.tool_methods import validate_nip

lookup_bp = Blueprint("lookup", __name__, url_prefix="/api/lookup")


@lookup_bp.route("/nip/<string:nip>", methods=["GET"])
@jwt_required()
def lookup_by_nip(nip):
    nip_clean = nip.replace("-", "").strip()

    if not validate_nip(nip_clean):
        return jsonify({"error": "Wrong NIP."}), 400

    data = mf_lookup(nip_clean)
    if data:
        return jsonify({**data, "source": "mf"}), 200

    data = gus_lookup(nip_clean)
    if data:
        return jsonify({**data, "source": "gus"}), 200

    return jsonify({"error": f"No data found for NIP {nip_clean}."}), 404
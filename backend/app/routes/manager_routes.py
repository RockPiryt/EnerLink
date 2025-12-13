from flask import Blueprint, jsonify
from app.services.analytics_service import get_sales_ranking

manager_bp = Blueprint("manager_bp", __name__)

# GET /manager/ranking – sales ranking
@manager_bp.route("/manager/ranking", methods=["GET"])
def get_ranking():
    """
    Returns sales ranking for managers or sales representatives.
    Structure matches OpenAPI example.
    """
    ranking_data = get_sales_ranking()

    return jsonify(ranking_data), 200

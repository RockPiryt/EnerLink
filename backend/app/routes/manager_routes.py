from flask import Blueprint, jsonify

manager_bp = Blueprint("manager_bp", __name__)

@manager_bp.route("/manager/ranking", methods=["GET"])
def get_ranking():
    ranking_data = {
        "ranking": [],
        "generated_at": None
    }
    return jsonify(ranking_data), 200

from flask import Blueprint, jsonify, request
from app.models.user import User

auth = Blueprint('auth', __name__)

@auth.route('/test', methods=['POST'])
def test_db():
    return jsonify({"message": "Auth is working"})
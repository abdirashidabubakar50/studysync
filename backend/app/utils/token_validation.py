from functools import wraps
from app.utils.jwt_helper import decode_jwt
from flask import request, jsonify
from app.models.user import User


token_blacklist = set()

def token_required(func):
    """ Decorateor to validate token and prevent access if invalid """
    @wraps(func)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        print("Authorization Header:", token)
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            token = token.split(" ")[1]
        except IndexError:
            return jsonify({'message': 'Invalid token format'}), 401

        if token in token_blacklist:
            return jsonify({'message': 'invalid token'}), 401
        
        try:
            decoded_payload = decode_jwt(token)
            user_id = decoded_payload.get('user_id')
            if not user_id:
                return jsonify({'message': 'Token payload missing user_id'}), 401

            user = User.objects(id=user_id).first()
            if not user:
                return jsonify({'message': 'User not found'}), 404
        except Exception as e:
            print(f"Token decoding error: {e}")
            return jsonify({'message': 'Token is invalid or expired'}), 401
        
        return func(decoded_payload, *args, **kwargs)
    return decorated_function

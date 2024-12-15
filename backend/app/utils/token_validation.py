from functools import wraps
from app.utils.jwt_helper import decode_jwt
from flask import request, jsonify


token_blacklist = set()

def token_required(func):
    """ Decorateor to validate token and prevent access if invalid """
    @wraps(func)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Tokein is missing'}), 401
        
        try:
            token = token.split(" ")[1]
        except IndexError:
            return jsonify({'message': 'Invalid token format'}), 401

        if token in token_blacklist:
            return jsonify({'meesage': 'invalid token'})
        
        try:
            decoded_payload = decode_jwt(token)
        except Exception as e:
            return jsonify({'message': 'Token is invalid or expired'}), 401
        
        return func(decoded_payload, *args, **kwargs)
    return decorated_function
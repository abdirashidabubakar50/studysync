import jwt
import datetime
from flask import current_app
from app.config import Config

def generate_jwt(user_id):
    """ Generate a jwt token for the user"""
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=4),
        'iat': datetime.datetime.utcnow()
    }
    secret_key = Config.SECRET_KEY
    token = jwt.encode(payload,secret_key, algorithm='HS256')
    return token

def decode_jwt(token):
    """
    Decode JWT token to extract the payload
    """
    secret_key = Config.SECRET_KEY
    try:
        payload = jwt.decode(token,secret_key, algorithms=['HS256'])
        print(payload)
        return payload
    except jwt.ExpiredSignatureError:
        raise Exception('Token has expired')
    except jwt.InvalidTokenError:
        raise Exception("Invalid token")
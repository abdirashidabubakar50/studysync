from flask import Blueprint, jsonify, request, session, make_response, redirect, url_for
from app.models.user import User
from mongoengine.errors import NotUniqueError
from app.utils.jwt_helper import generate_jwt
from app.utils.token_validation import token_required

auth = Blueprint('auth', __name__)

@auth.route('/register', methods=['POST'])
def register_user():
    try:
        # get the data from the request body
        data = request.get_json()

        username = data.get('username')
        email = data.get('email')
        password = data.get('password')


        if not username or not email or not password:
            return jsonify({'message': 'All fileds (username, email and password) are required'}), 409

        user = User(username=username, email=email, password_hash=User.hash_password(password))
        user.save()

        return jsonify({'message': 'User registered successfully!'}), 201
    except NotUniqueError:
        return jsonify({'message': 'Username or email already exists'}), 409
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@auth.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        try:
            data = request.get_json()

            email = data.get('email')
            password = data.get('password')

            if not email or not password:
                return jsonify({'message': 'Email and Password are required'}), 400
            
            user = User.objects(email=email).first()
            if not user or not user.verify_password(password):
                return jsonify({'message': 'invalid Email or Password'}), 401
            
            # generate JWT
            token = generate_jwt(str(user.id))
            
            return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': {
                'id': str(user.id),
                'username': user.username
            }
        }), 200
        except Exception as e:
            return jsonify({'message': str(e)}), 500
    return f'not the right method used'


token_blacklist = set()

@auth.route('/logout', methods=['POST'])
@token_required
def logout(decoded_payload):
    try:
        token = request.headers.get('Authorization').split(" ")[1]

        token_blacklist.add(token)

        return jsonify({'message': 'Logout successful'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

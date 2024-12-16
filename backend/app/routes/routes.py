from flask import Blueprint, jsonify, redirect, request
from app.utils.token_validation import token_required
from app.models.user import User
from app.models.course import Course

api = Blueprint('api', __name__)

@api.route('/home', methods=['GET'])
def home():
    return jsonify({'message': 'Welcome to studysync'})


@api.route('/dashboard', methods=['GET'])
@token_required
def dashboard(decoded_payload):
    user_id = decoded_payload.get('user_id')
    user = User.objects(id=user_id).first()
    return jsonify({
        'message': f'Welcome {user.username}'
    }), 200


@api.route('/courses', methods=['POST'])
@token_required
def add_course(decoded_payload):
    user_id = decoded_payload['user_id']
    data = request.get_json()

    title = data.get('title')
    description = data.get('description', ' ')

    if not title:
        return jsonify({'message': 'Title is required'})
    
    user = User.objects(id=user_id).first()
    course = Course(title=title, description=description, created_by=user)

    try:
        course.save()
        return jsonify({
            'message': 'Course created successfully',
            'course': {
                'id': str(course.id),
                'title': course.title,
                'description': course.description,
                'created_at': course.created_at,
                'updated_at': course.updated_at
            }
        }), 201
    except Exception as e:
        return jsonify({'message': 'Error creating course', 'error': str(e)}), 500


@api.route('/courses/<course_id>/modules', methods=['POST'])
@token_required
def add_module(decoded_payload, course_id):
    """ Add module to a specific course for the authenticated user."""
    user_id = decoded_payload['user_id']
    user = User.objects(id=user_id).first()

    if not user:
        return jsonify({'message': 'user not found'})
    
    course = Course.objects(id=course_id).first()
    if not course:
        return jsonify({'message':'Course not found or does not belong to the user'})
    
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')

    if not title:
        return jsonify({'message': 'Module title is required'}), 400
    
    course.add_module(title=title, description=description)

    return jsonify({
        'message': 'Module added successfully',
        'course' : {
            'id': str(course.id),
            'title': course.title,
            'description': course.description,
            'modules' : [
                {
                    'title': module.title,
                    'descriptioni': module.description,
                    'created_at': mole.created_at,
                    'updated_at': module.updated_at
                } for module in course.modules
            ],
            'created_at': course.created_at,
            'updated_at': course.updated_at
        }
    }), 201

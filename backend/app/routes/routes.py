from flask import Blueprint, jsonify, redirect, request
from app.utils.token_validation import token_required
from app.models.user import User
from app.models.course import Course
from app.models.assignment import Assignment
from app.models.module import Module

api = Blueprint('api', __name__)


@api.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'Welcome to studysync'})


@api.route('/dashboard', methods=['GET'])
@token_required
def dashboard(decoded_payload):
    user_id = decoded_payload.get('user_id')
    user = User.objects(id=user_id).first()
    return jsonify({
        'message': 'Welcome to the dashboard',
        'username': user.username,
        'email': user.email
    }), 200


@api.route('/courses', methods=['GET'])
@token_required
def get_courses(decoded_payload):
    """ Retrieve all courses for the authenticated user"""
    user_id = decoded_payload['user_id']
    user = User.objects(id=user_id).first()

    if not user:
        return jsonify({'message': 'User not found'}), 404

    courses = Course.objects(created_by=user)
    return jsonify({
        'message': 'courses retrieved successfully',
        'courses': [
            {
                'id': str(course.id),
                'title': course.title,
                'description': course.description,
                'created_at': course.created_at,
                'updated-at': course.updated_at
            } for course in courses
        ]
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
        return jsonify({
            'message': 'Error creating course', 'error': str(e)
        }), 500


@api.route('/courses/<course_id>', methods=['GET'])
@token_required
def view_course_details(decoded_payload, course_id):
    user_id = decoded_payload['user_id']
    course = Course.objects(id=course_id, created_by=user_id).first()

    if not course:
        return jsonify({"message": 'course not found'}), 500

    # Fetch associated modules
    modules = [
        {
            'id': str(module.id),
            'title': module.title,
            'description': module.description,
            'created_at': module.created_at,
        }
        for module in course.modules
    ]

    return jsonify({
        'course': {
            'id': str(course.id),
            'title': course.title,
            'description': course.description,
            'updated_at': course.updated_at,
        },
        'modules': modules
    }), 200


@api.route('/courses/<course_id>/modules', methods=['POST'])
@token_required
def add_module(decoded_payload, course_id):
    """ Add module to a specific course for the authenticated user."""
    user_id = decoded_payload['user_id']
    user = User.objects(id=user_id).first()

    if not user:
        return jsonify({'message': 'user not found'}), 404

    course = Course.objects(id=course_id).first()
    if not course:
        return jsonify({
            'message': 'Course not found or does not belong to the user'
        }), 404

    data = request.get_json()
    title = data.get('title')
    description = data.get('description')

    if not title:
        return jsonify({'message': 'Module title is required'}), 400

    course.add_module(title=title, description=description)

    return jsonify({
        'message': 'Module added successfully',
        'course': {
            'id': str(course.id),
            'title': course.title,
            'description': course.description,
            'modules': [
                {
                    'id': module.id,
                    'title': module.title,
                    'description': module.description,
                    'created_at': module.created_at,
                    'updated_at': module.updated_at
                } for module in course.modules
            ],
            'created_at': course.created_at,
            'updated_at': course.updated_at
        }
    }), 201



@api.route('/courses/<course_id>', methods=['DELETE'])
@token_required
def delete_course(decoded_payload, course_id):
    """ Delete the course by its ID"""
    user_id = decoded_payload['user_id']
    course = Course.objects(id=course_id, created_by=user_id).first()

    if not course:
        return jsonify({'message': 'Course not found'})

    course.delete_course()
    return jsonify({'message': 'Course deleted successfuly'})


@api.route('/courses/<course_id>/modules/<module_id>', methods=['DELETE'])
@token_required
def delete_module(decoded_payload, course_id, module_id):
    """ Delete a specifif module from a course for the authenticated user """
    user_id = decoded_payload['user_id']
    user = User.objects(id=user_id).first()

    if not user:
        return jsonify({'message': 'User not found'}), 404

    """ Check if the course exists and belongs to the user"""
    course = Course.objects(id=course_id, created_by=user).first()
    if not course:
        return jsonify({
            'message': 'Course not found or does nto belong to the user'
        }), 404

    try:
        course.remove_module(module_id)
    except ValueError as e:
        return jsonify({'message': str(e)}), 404

    return jsonify({
        'message': 'module deleted successfully',
        'course': {
            'id': str(course.id),
            'title': course.title,
            'description': course.description,
            'modules': [
                {
                    'id': str(module.id),
                    'title': module.title,
                    'description': module.description,
                    'created_at': module.created_at,
                    'updated_at': module.updated_at
                } for module in course.modules
            ],
            'created_at': course.created_at,
            'updated_at': course.updated_at
        }
    }), 200


@api.route('/modules/<module_id>/assignments', methods=['POST'])
@token_required
def add_assignment(decoded_payload, module_id):
    data = request.get_json()
    title = data.get('title')
    description = data.get('description', '')
    status = data.get('status', 'pending')

    if not title:
        return jsonify({"message": "Title is  required"})

    course = Course.objects(modules__match={"id": module_id}).first()

    module = next((mod for mod in course.modules if str(mod.id) == module_id), None)
    if not module:
        return jsonify({"message": "Module  not found"}), 404

    assignment = Assignment(
        title=title,
        description=description,
        status=status
    )
    module.assigments.append(assignment)
    course.save()

    return jsonify({
        "Message": "Assignment added successfully",
        "assignment": {
            "id": str(assignment.id),
            "title": assignment.title,
            "description": assignment.description,
            "status": assignment.status
        }
    }), 201


@api.route('/modules/<module_id>/', methods=['GET'])
@token_required
def get_assignment(decoded_payload, module_id):
    course = Course.objects(modules__match={"id": module_id}).first()
    if not course:
        return jsonify({"message": "course nott found"}), 404

    module = next((mod for mod in course.modules if str(mod.id) == module_id), None)
    if not module:
        return jsonify({'message': 'Module not found'}), 404
    

    assignments = [
        {
            'id': str(a.id),
            'title': a.title,
            'description': a.description,
            'created-at': a.created_at,
            'updated_at': a.updated_at
        }
        for a in module.assigments
    ]
    return jsonify({"assignments": assignments}),  200


@api.route('/modules/<module_id>/assignments/<assignment_id>',
           methods=['PATCH'])
@token_required
def update_assignment(decoded_payload, module_id, assignment_id):
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    status = data.get('status')
    course = Course.objects(modules__match={"id": module_id}).first()
    if not course:
        return jsonify({"message": "course nott found"}), 404

    module = next((mod for mod in course.modules if str(mod.id) == module_id), None)
    if not module:
        return jsonify({'message': 'Module not found'}), 404
    
    assignment = next((a for a in module.assigments if str(a.id) == assignment_id), None)
    if not assignment:
        return jsonify({"message": "Assignment not found"}), 404

    assignment.update(title, description, status)
    course.save()

    return jsonify({
        "message": "Assignment updated successfully",
        "assignment": {
            "id": str(assignment.id),
            "title": assignment.title,
            "description": assignment.title,
            "status": assignment.status
        }
    }), 200


@api.route('/modules/<module_id>/assignments/<assignments_id>',
           methods=['DELETE'])
@token_required
def delete_assignment(decoded_payload, module_id, assignment_id):
    module = Module.objects(id=module_id).first()
    if not module:
        return jsonify({"message": "Module not found"}), 404

    assignment = next((a for a in module.assignments if str(a.id) == assignment_id), None)
    if not assignment:
        return jsonify({"message": "Assignment not found"}), 404

    module.assignments = [a for a in module.assignments if str(a.id) != assignment_id]
    module.save()

    return jsonify({"message": "Assigment deleted successfully"}), 200

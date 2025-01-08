from flask import Blueprint, jsonify, redirect, request, send_from_directory
from app.utils.token_validation import token_required
from app.models.user import User
from app.models.course import Course
from app.models.assignment import Assignment
from app.models.module import Module
from app.models.material import Material
import os
from werkzeug.utils import secure_filename
import datetime
from datetime import datetime
from app.config import Config
from flask_cors import cross_origin

api = Blueprint('api', __name__)


@api.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'Welcome to studysync'})



@api.route('/profile/user_id', methods=['GET'])
@token_required
def update_profile(decoded_payload):
    """ update the user profile """
    user_id = decoded_payload['user_id']
    user = User.objects(id=user_id).first()
    if not user:
        return jsonify({"message": 'User not found'}), 404
    
    data = request.get_json()

    username = data.get('username')
    email = data.get('email')


    user.update(username=username, email=email)
    user.save()

    return jsonify({
        'username': user.username,
        'email': user.email,
    });



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
                'progress': course.calculate_progress(),
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
            'materials': [material.to_dict() for material in module.materials]
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


@api.route('/courses/overall_progress', methods=['GET'])
@token_required
def calculate_overall_progress(decoded_payload):
    user_id = decoded_payload['user_id']
    user_courses = Course.objects(created_by=user_id)

    if not user_courses:
        return jsonify({"message": "No courses found for this user", "overall_progress": 0}), 200

    # Calculate overall progress
    overall_progress = Course.calculate_overall_progress(user_courses)
    
    return jsonify({
        "message": "Overall progress calculated successfully",
        "overall_progress": overall_progress
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

@api.route('/courses/<course_id>/modules/<module_id>', methods=['OPTIONS', 'POST'])
@token_required
def mark_module_completed(decoded_payload, course_id, module_id):
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'CORS preflight successful'})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173/')
        response.headers.add('Access-Control-Allow-Methods', 'OPTIONS, POST')
        response.headers.add('Access-Control-Allow-Headers', 'Authorization, Content-Type')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response, 200

    course = Course.objects(id=course_id).first()
    if not course:
        return jsonify({"message": "Course not found"})
    
    try:
        progress = course.mark_module_completed(module_id)
        return jsonify({"message": "Module marked as completed", "progress": progress}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@api.route('/courses/<course_id>/modules/<module_id>/material', methods=['POST'])
@token_required
def add_material(decoded_payload, course_id, module_id):
    user_id = decoded_payload['user_id']
    course = Course.objects(id=course_id, created_by=user_id).first()

    if not course:
        return jsonify({'message': 'Course not found'}), 404
    
    module = next((m for m in course.modules if str(m.id) == module_id), None)
    if not module:
        return jsonify({'message': 'Module not found'}), 404

    title = request.form.get('title')
    material_type = request.form.get('type')
    print("Material type received", material_type, 'title received', title) #Debug

    if material_type not in ['note', 'file']:
        return jsonify({'message': 'Invalid material type'}), 400
    
    if material_type == 'note':
        content = request.form.get('content')
        if not content:
            return jsonify({'message': 'Note content is required'}), 400
        
        material = Material(title=title, type='note', content=content)
        print("Added material with id", material.id)
    
    elif material_type == 'file':
        if 'file' not in request.files:
            return jsonify({'message': 'File is required for file materials'})
        
        file = request.files['file']
        if file:
            upload_folder = Config.UPLOAD_FOLDER
            filename = secure_filename(file.filename)
            file_path = os.path.join(upload_folder, filename)
            file.save(file_path)

            file_url = f"/{filename}"
            material = Material(title=title, type='file', file_url=file_url)
        else:
            return jsonify({'message': 'Invalid file type.'}), 400

    module.materials.append(material)

    course.save()

    return jsonify({
        'id': str(material.id),
        'type': material.type,
        'title': material.title,
        'content': material.content if material.type == 'note' else None,
        'file_url': material.file_url if material.type == 'file' else None
    }), 200


@api.route('/api/courses/<course_id>/modules/<module_id>/materials/<material_id>', methods=['PUT', 'OPTIONS'])
@cross_origin(headers=['Authorization'])
@token_required
def update_material(decoded_payload, course_id, module_id, material_id):
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'CORS preflight successful'})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173/')
        response.headers.add('Access-Control-Allow-Methods', 'OPTIONS, POST')
        response.headers.add('Access-Control-Allow-Headers', 'Authorization, Content-Type')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response, 200
    user_id = decoded_payload['user_id']
    course = Course.objects(id=course_id, created_by=user_id).first()

    if not course:
        return jsonify({'message': 'Course not found'}), 404

    module = next((m for m in course.modules if str(m.id) == module_id), None)
    if not module:
        return jsonify({'message': 'Module not found'}), 404

    material = next((mat for mat in module.materials if str(mat.id) == material_id), None)
    if not material:
        return jsonify({'message': 'Material not found'}), 404

    # Extract fields from request
    title = request.form.get('title')
    material_type = request.form.get('type')
    content = request.form.get('content')
    file = request.files.get('file')

    # Validate type
    if material_type and material_type not in ['note', 'file']:
        return jsonify({'message': 'Invalid material type'}), 400

    if material_type == 'note' and not content:
        return jsonify({'message': 'Content is required for note type'}), 400

    if material_type == 'file' and file:
        upload_folder = Config.UPLOAD_FOLDER
        filename = secure_filename(file.filename)
        file_path = os.path.join(upload_folder, filename)
        file.save(file_path)

        file_url = f"{filename}"
        material.update(title=title, type='file', file_url=file_url)
    else:
        material.update(title=title, type=material_type, content=content)

    material.updated_at = datetime.datetime.utcnow()
    course.save()

    return jsonify({'message': 'Material updated successfully'})


@api.route('/uploads/<path:filename>', methods=['GET', 'OPTIONS'])
@cross_origin(headers=['Authorization'])
@token_required
def get_upload(decoded_payload, filename):
    if request.method == 'OPTIONS':
        return '', 200
    upload_folder = Config.UPLOAD_FOLDER
    safe_path = os.path.join(upload_folder, filename)

    # Ensure the file exists
    if not os.path.isfile(safe_path):
        return {"error": "File not found"}, 404

    return send_from_directory(upload_folder, filename)

""" Assignments routes"""
@api.route('/assignments/add', methods=['POST'])
@token_required
def add_assignment(decoded_payload):
    user_id = decoded_payload['user_id']
    data = request.get_json()

    title = data.get('title')
    description = data.get('description')
    due_date = data.get('due_date')
    status = data.get('status', 'pending')
    tags = data.get('tags', [])

    if not title:
        return jsonify({"error": "Title is required"}), 400
    
    if not isinstance(due_date, str):
        return jsonify({'error': "Due date must be in a valid ISO 8601 format"}), 400

    try:
        due_date = datetime.fromisoformat(due_date)
    except ValueError:
        return jsonify({"error": "Due date must be in valid ISO 8601 format"}), 400
    
    user = User.objects(id=user_id).first()

    if not user:
        return jsonify({"error": "Current user not found"})
    
    # create new assignment
    assignment = Assignment(
        title=title,
        description=description,
        created_by=user,
        status=status,
        due_date=due_date,
        tags=tags
    )

    assignment.save()

    return jsonify({
        "message": "Assignment created successfully",
        "assignment": {
            "id": str(assignment.id),
            "title": assignment.title,
            "description": assignment.description,
            "status": assignment.status,
            "due_date": assignment.due_date.strftime('%Y-%m-%d'),
            "tags": assignment.tags,
            "created_at": assignment.created_at.isoformat(),
            "updated_at": assignment.updated_at.isoformat()
        }
    }), 201


@api.route('/assignments', methods=['GET'])
@token_required
def get_assignments(decoded_payload):
    user_id = decoded_payload['user_id']

    # Fetch all assignments created by the authenticated user
    assignments = Assignment.objects(created_by=user_id)

    # Prepare the response
    response = [
        {
            "id": str(assignment.id),
            "title": assignment.title,
            "description": assignment.description,
            "status": assignment.status,
            "due_date": assignment.due_date.isoformat() if assignment.due_date else None,
            "tags": assignment.tags,
            "created_at": assignment.created_at.isoformat(),
            "updated_at": assignment.updated_at.isoformat()
        }
        for assignment in assignments
    ]

    return jsonify({"assignments": response}), 200


@api.route('/assignments/<assignment_id>', methods=['PUT'])
@token_required
def update_assignment(decoded_payload, assignment_id):
    user_id = decoded_payload['user_id']
    user = User.objects(id=user_id).first()
    assignment = Assignment.objects(id=assignment_id, created_by=user).first()

    if not assignment:
        return jsonify({"error": 'assignment not found'})
    
    data = request.get_json()

    title = data.get('title')
    description= data.get('description')
    status = data.get('status')
    due_date = data.get('due_date')
    tags = data.get('tags')

    assignment.update(title=title, description=description, status=status, due_date=due_date, tags=tags)
    assignment.save()

    return jsonify({
        "id": str(assignment.id),
        "title": assignment.title,
        "description": assignment.description,
        "due_date": assignment.due_date,
        "status": assignment.status,
        "tags": assignment.tags,
        "created_at": assignment.created_at,
        "updated_at": assignment.updated_at
    }), 200


@api.route('/assignments/<assignment_id>', methods=['DELETE'])
@token_required
def delete_assignment(decoded_payload, assignment_id):
    user_id = decoded_payload['user_id']
    user = User.objects(id=user_id).first()

    assignment = Assignment.objects(id=assignment_id, created_by=user).first()

    if not assignment:
        return jsonify({"error": "Assignment not found"}), 400
    
    assignment.delete()

    return jsonify({"message": "Assignment deleted successfully"}), 200

@api.route('/assignments/<assignment_id>/complete', methods=['PATCH'])
@token_required
def mark_assignment_complete(decoded_payload, assignment_id):
    user_id = decoded_payload['user_id']
    user = User.objects(id=user_id).first()
    assignment = Assignment.objects(id=assignment_id, created_by=user).first()

    assignment.status = 'completed'
    assignment.save()

    return jsonify({"messge": 'Marked assignment as completed'})
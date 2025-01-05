from flask import Flask
from flask_cors import CORS
from app.models.mongo_setup import global_init
from dotenv import load_dotenv
import os
from flask_restx import Api, Resource



def create_app():
    load_dotenv()
    app = Flask(__name__)

    app.config.from_object('app.config')

    global_init()

    api = Api(app,
            title = 'studysync',
            version = '1.0',
            description = 'A all in one learning platform to manage all of your learning resources'
    )

    CORS(app, resources={r"/*": {"origins": "http://localhost:5174"}}, supports_credentials=True)    # Register blueprints
    from app.routes.auth_routes import auth
    from app.routes.routes import api
    app.register_blueprint(auth, url_prefix='/auth')
    app.register_blueprint(api, url_prefix='/api')

    return app

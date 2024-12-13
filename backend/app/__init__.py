from flask import Flask
from app.extensions import db
from app.routes.auth_routes import auth
from app.routes.routes import api


def create_app():
    app = Flask(__name__)

    app.config.from_object('app.config')

    db.init_app(app)

    # Register blueprints
    app.register_blueprint(auth, url_prefix='/auth')
    app.register_blueprint(api, url_prefix='/api')

    return app
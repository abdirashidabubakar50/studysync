import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    DB_ALIAS = os.getenv('DB_ALIAS', 'core')
    DB_NAME = os.getenv('DB_NAME', 'studysync')
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_PORT = os.getenv('DB_PORT', '27017')
    DB_USERNAME = os.getenv('DB_USERNAME')
    DB_PASSWORD = os.getenv('DB_PASSWORD')
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
    SECRET_KEY = os.getenv('SECRET_KEY')

    #static method
    def get_mongo_uri():
        if Config.DB_USERNAME and Config.DB_PASSWORD:
            return f"mongodb://{Config.DB_USERNAME}:{Config.DB_PASSWORD}@{Config.DB_HOST}:{Config.DB_PORT}/{Config.DB_NAME}"
        return f"mongodb://{Config.DB_HOST}:{Config.DB_PORT}/{Config.DB_NAME}"

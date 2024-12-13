import os
from dotenv import load_dotenv

load_dotenv()

class config:
    MONGDB_SETTINGS = {
        'db': os.getenv('DB_NAME', 'studysync'),
        'host': os.getenv('DB_HOST', 'localhost'),
        'port': int(os.getenv('DB_PORT', 27017))
    }

    SECRET_KEY = os.getenv('SECRET_KEY')
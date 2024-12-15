import mongoengine
from app.config import Config

def global_init():
    """
    Initialize MongoDB connection using configuration
    """
    db_alias = Config.DB_ALIAS
    mongo_uri = Config.get_mongo_uri()

    mongoengine.register_connection(alias=db_alias, host=mongo_uri, name='studysync')
    print(f"MongoDB initialized with alias {db_alias}, Database: {Config.DB_NAME}, Port: {Config.DB_PORT}")

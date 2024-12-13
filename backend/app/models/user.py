from app.extensions import db
import datetime

class User(db.Document):
    username = db.StringField(required=True, unique=True, max_length=50)
    email = db.EmailField(required=True, unique=True)
    created_at = db.DateTimeField(default=datetime.datetime.now)
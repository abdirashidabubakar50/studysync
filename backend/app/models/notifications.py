from app.extensions import db
import datetime
from app.models.module import Module
from app.models.user import User

class Notification(db.Document):
    user = db.ReferenceField(User, required=True, reverse_delete_rule=db.CASCADE)
    message = db.StringField(required=True, max_length=500)
    read = db.BooleanField(default=False)
    created_at = db.DateTimeField(default=datetime.datetime.utcnow)
    type =  db.StringField(choices=["info", "warning", "error", "success"], max_length=50)

    meta = {
        'db_alias': 'core',
        'collection': 'notifications'
    }
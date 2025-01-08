from app.extensions import db
import datetime
from app.models.module import Module
from app.models.user import User

class Notification(db.Document):
    user = ReferenceField(User, required=True)
    message = StringField(required=True)
    read = BooleanField(default=False)
    created_at = DateTimeField(default=datetime.utcnow)
    type =  StringField()
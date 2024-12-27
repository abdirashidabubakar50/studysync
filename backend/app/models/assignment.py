from app.extensions import db
import datetime
from app.models.user import User
import  uuid

class Assignment(db.EmbeddedDocument):
    id = db.StringField(required=True, default=lambda: str(uuid.uuid4()))
    title = db.StringField(required=True, max_length=100)
    description = db.StringField()
    status = db.StringField(choices=['pending', 'completed'], defalut='pending')
    created_at = db.DateTimeField(default=datetime.datetime.now)
    updated_at = db.DateTimeField(default=datetime.datetime.now)

    def update_status(self, status):
        if status in ['pending', 'completed']:
            self.status = status
            self.updated = datetime.datetime.now()

    def  update(self, title=None, description=None, status=None):
        """ update assignment details"""
        if title:
            self.title = title
        if description:
            self.description = description
        if status:
            self.status = status
        
        self.updated_at = datetime.datetime.now()
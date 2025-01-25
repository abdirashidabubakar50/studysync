from app.extensions import db
from app.models.material import Material
import datetime
import uuid


class Module(db.EmbeddedDocument):
    id = db.StringField(required=True, default=lambda: str(uuid.uuid4()))
    title = db.StringField(required=True, max_length=100)
    description = db.StringField()
    materials = db.ListField(db.EmbeddedDocumentField(Material))
    status = db.StringField(choices=['pending', 'completed'], default='pending')
    created_at = db.DateTimeField(default=datetime.datetime.now)
    updated_at = db.DateTimeField(default=datetime.datetime.now)


    def update_module(self, title=None, description=None):
        """ update module details"""
        if title:
            self.title = title
        if description:
            self.description = description
        self.updated_at = datetime.datetime.now()
    
    def mark_completed(self):
        """ Mark module as completed"""
        self.status = 'completed'
        self.updated_at = datetime.datetime.now()
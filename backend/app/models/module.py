from app.extensions import db
from app.models.assignment import Assignment
import datetime
import uuid


class Module(db.EmbeddedDocument):
    id = db.StringField(required=True, default=lambda: str(uuid.uuid4()))
    title = db.StringField(required=True, max_length=100)
    description = db.StringField()
    assigments = db.ListField(db.EmbeddedDocumentField(Assignment))
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

    def calculate_progress(self):
        """ calculate module progress based on assignmemts"""
        if not self.assigments:
            return 100 if self.status == 'completed' else 0
        completed = sum(1 for a in self.assignments if a.status == 'completed')
        return (completed / len(self.assignments)) * 100
    
    def update_status(self):
        """ Update module status based on assignments"""
        if not self.assignments:
            self.status = 'completed'
        elif all(a.status == 'completed' for a in self.assignments):
            self.status = 'completed'
        else:
            self.status = '[pending]'
        
        self.updated_at = datetime.datetime.now()
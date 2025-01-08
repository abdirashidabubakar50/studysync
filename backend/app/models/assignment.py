from app.extensions import db
import datetime
from app.models.user import User
import  uuid

class Assignment(db.Document):
    title = db.StringField(required=True, max_length=100)
    description = db.StringField()
    created_by = db.ReferenceField('User', required=True, reverse_delete_rule=db.CASCADE)
    status = db.StringField(choices=['pending', 'completed'], default='pending')
    due_date = db.DateTimeField()
    tags = db.ListField(db.StringField()) 
    created_at = db.DateTimeField(default=datetime.datetime.now)
    updated_at = db.DateTimeField(default=datetime.datetime.now)

    meta = {
        'db_alias': 'core',
        'collection': 'assignments'
    }

    def update_status(self, status):
        if status in ['pending', 'completed']:
            self.status = status
            self.updated = datetime.datetime.now()

    def  update(self, title=None, description=None, status=None, due_date=None, tags=None):
        """ update assignment details"""
        if title:
            self.title = title
        if description:
            self.description = description
        if status:
            self.status = status
        if due_date:
            self.due_date = due_date
        if tags:
            self.tags = tags
        self.updated_at = datetime.datetime.now()
    
    def save(self, *args, **kwargs):
        self.updated_at = datetime.datetime.now()
        return super().save(*args, **kwargs)
    
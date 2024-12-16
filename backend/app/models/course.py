from app.extensions import db
import datetime
from app.models.module import Module
from app.models.user import User


class Course(db.Document):
    title = db.StringField(required=True, unique=True, max_length=100)
    description = db.StringField()
    created_by = db.ReferenceField('User', required=True, reverse_delete_rule=db.CASCADE)
    modules = db.ListField(db.EmbeddedDocumentField(Module))
    created_at = db.DateTimeField(default=datetime.datetime.now)
    updated_at = db.DateTimeField(default=datetime.datetime.now)

    meta = {
        'db_alias': 'core',
        'collection': 'courses'
    }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.datetime.now()
        return super().save(*args, **kwargs)
    
    def add_module(self, title, description=None):
        """ Add module to the course
        """
        module = Module(title=title, description=description)
        self.modules.append(module)
        self.save()
    
    def remove_module(self, module_index):
        """ Remove a module by it's index"""
        try:
            self.modules.pop(module_index)
            self.save()
        except IndexError:
            raise ValueError(f"No module at index {module_index}")
    

    def update_course(self, title=None, description=None):
        """ Update course details"""
        if title:
            self.title = title
        
        if description:
            self.description = description
        
        self.updated_at = datetime.datetime.now()
        self.save()
    
    def delete_course(self):
        """ Delete Course"""
        self.delete()
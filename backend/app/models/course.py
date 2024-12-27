from app.extensions import db
import datetime
from app.models.module import Module
from app.models.user import User
from app.models.assignment import Assignment


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
    
    def remove_module(self, module_id):
        """ Remove a module by its unique ID"""
        module_to_remove = next((module for module in self.modules if str(module.id) == module_id), None)
        if not module_to_remove:
            raise ValueError(f"No module found with ID {module_id}")
        self.modules.remove(module_to_remove)
        self.save()


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
    
    def calculate_progress(self):
        """ Calculate an the overall course progres"""
        module_progress = 0
        if self.modules:
            total_modules = len(self.modules)
            completed_modules = sum(1 for m in self.modules if m.status == 'completed')
            assignment_progress = (completed_modules / total_modules)
        
        assignment_progress = 0
        if  self.assignmemts:
            total_assigments = len(self.assignments)
            completed_modules = sum(1 for a in self.assignment  if a.status == 'completed')
            assignment_progress = (completed_assignments / total_assignments)
        
        if self.modules and self.assignments:
            return (module_progress + assignment_progress) / 2
        return module_progress or assignment_progress
                              
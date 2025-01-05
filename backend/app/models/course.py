from app.extensions import db
import datetime
from app.models.module import Module
from app.models.user import User
from app.models.assignment import Assignment


class Course(db.Document):
    title = db.StringField(required=True, max_length=100)
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
            module_progress = (completed_modules / total_modules) * 100
        
        return module_progress

    def mark_module_completed(self, module_id):
        module = next((m for m in self.modules if str(m.id) == module_id), None)
        if not module:
            raise ValueError(f"No module found with ID {module_id}")
        
        module.mark_completed()
        self.save()
        return self.calculate_progress()

    @staticmethod
    def calculate_overall_progress(courses):
        if not courses:
            return 0  # No courses means no progress

        total_progress = sum(course.calculate_progress() for course in courses)
        return total_progress / len(courses)  # Average progress
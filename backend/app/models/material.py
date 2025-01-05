from app.extensions import db
import datetime
import uuid


class Material(db.EmbeddedDocument):
    """ Embedded materials for module """
    id = db.StringField(required=True, default=lambda: str(uuid.uuid4()))
    title = db.StringField(required=True)
    type = db.StringField(required=True, choices=['note', 'file'])
    content = db.StringField()
    file_url = db.StringField()
    created_at = db.DateTimeField(default=datetime.datetime.utcnow)
    updated_at = db.DateTimeField(default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            "title": self.title,
            "type": self.type,
            "content": self.content,
            "file_url": self.file_url
        }
    
    def update(self, title=None, type=None, file_url=None):
        if title:
            self.title = title
        if type:
            self.type = type
        if file_url:
            self.file_url = file_url
        
        self.updated_at = datetime.datetime.now()
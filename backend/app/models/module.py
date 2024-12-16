from app.extensions import db
import datetime


class Module(db.EmbeddedDocument):
    title = db.StringField(required=True, max_length=100)
    description = db.StringField()
    created_at = db.DateTimeField(default=datetime.datetime.now)
    updated_at = db.DateTimeField(default=datetime.datetime.now)


    def update_module(self, title=None, description=None):
        """ update module details"""
        if title:
            self.title = title
        if description:
            self.description = description
        self.updated_at = datetime.datetime.now()

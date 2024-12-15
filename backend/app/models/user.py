from app.extensions import db
import datetime
from bcrypt import hashpw, gensalt, checkpw

class User(db.Document):
    username = db.StringField(required=True, unique=True, max_length=50)
    email = db.EmailField(required=True, unique=True)
    password_hash = db.StringField(required=True)
    profile_picture = db.StringField(default=None)
    created_at = db.DateTimeField(default=datetime.datetime.now)
    updated_at = db.DateTimeField(default=datetime.datetime.now)

    meta = {
        'db_alias' : 'core',
        'collection': 'users'
    }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.datetime.now()
        return super().save(*args, **kwargs)
    
    def update_user(self, username=None, email=None, password=None):
        """ update user details, username, email and/or password
        """
        if username:
            self.username = username
        if email:
            self.email = email
        if password:
            self.password_hash = self.hash_password(password)
        self.updated_at = datetime.utcnow()
        self.save()
    
    def delete_user(self):
        """ delete the current user from the database
        """
        self.delete()

    @staticmethod
    def hash_password(password):
        """ Hash the password using bcrypt
        """
        return hashpw(password.encode('utf-8'), gensalt()).decode('utf-8')
    
    def verify_password(self, password):
        """ Verify the provided password against the hashed password
        """
        return checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
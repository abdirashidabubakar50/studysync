from gevent import monkey
monkey.patch_all()
from gevent.pywsgi import WSGIServer
from app.utils.check_due_assignments import start_scheduler, check_due_assignments
from app import create_app


app = create_app()

if __name__ == '__main__':
    with app.app_context(): 
        print("Starting the Flask app...")  
        start_scheduler()   # Start scheduler
    app.run(debug=True)
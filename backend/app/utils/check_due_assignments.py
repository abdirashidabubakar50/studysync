from apscheduler.schedulers.background import BackgroundScheduler
from datetime import timedelta, datetime
from app.models.assignment import Assignment
from app.models.notifications import Notification
from flask import current_app
from app import create_app
import locale


app = create_app()

locale.setlocale(locale.LC_TIME, 'en_US.UTF-8')

scheduler = BackgroundScheduler()
def check_due_assignments():
    with app.app_context():
        print("Running scheduled job: check_due_assignments")
        upcoming_assignments = Assignment.objects(
            due_date__gte=datetime.utcnow(),
            due_date__lte=datetime.utcnow() + timedelta(hours=72),
            status="pending"
        )

        print(f"Found {len(upcoming_assignments)} upcoming assignments")
        for assignment in upcoming_assignments:
            user = assignment.created_by
            message = f"Your assignment '{assignment.title}' is due on {assignment.due_date.strftime('%B %d, %Y')}."

            # Check if notification already exists
            if not Notification.objects(user=user, message=message).first():
                notification = Notification(
                    user=user,
                    message=message,
                    type="info",
                )
                notification.save()
                print(f"Notification created for user {user.id}: {notification.to_json()}")


# Start the scheduler
def start_scheduler():
    with app.app_context():
        print("Scheduler is starting...")
        scheduler.add_job(check_due_assignments, 'interval', minutes=1)
        print("Job addedd to the scheduler")
        scheduler.start()
        print("Scheduler started")
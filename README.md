# StudySync - Course Management Platform

StudySync is a full-stack course management platform that allows students to manage their courses, track their progress, and engage in a rewarding learning experience. Built with Flask, React, Tailwind CSS, and MongoDB, StudySync enables users to:
- Add, view, and delete courses
- Add modules and assignments to courses
- Track course progress
- Earn rewards for completing tasks

## Features

### User Authentication
- **Login & Registration:** Secure login and registration using JWT-based authentication.
- **User Logout:** Ability for users to log out.

### Course Management
- **Dashboard:** Users can add, view, and delete courses.
- **Modules & Assignments:** Add, view, and delete modules within courses. Assignments are tracked with due dates.

### Progress Tracking & Rewards
- **Dynamic Progress Calculation:** As users complete courses, their progress percentage is updated.
- **Reward System:** Users earn rewards like bronze, silver, and gold when completing courses or maintaining streaks.

## Tech Stack

- **Backend:** Flask (Python)
- **Frontend:** React, Tailwind CSS, Javascript
- **Database:** MongoDB
- **Authentication:** JWT

## Installation

### Prerequisites
- Python 3.8+
- Node.js (for React)
- MongoDB (local or cloud)

### Backend Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/studysync.git
    cd studysync
    ```

2. Install backend dependencies:
    ```bash
    cd backend
    pip install -r requirements.txt
    ```

3. Set up environment variables:
    Create a `.env` file and add the following:
    ```env
    MONGO_URI=mongodb://localhost:27017/studysync
    JWT_SECRET=your-secret-key
    ```

4. Run the Flask backend:
    ```bash
    python app.py
    ```

### Frontend Setup

1. Install frontend dependencies:
    ```bash
    cd frontend
    npm install
    ```

2. Start the React app:
    ```bash
    npm run dev
    ```

### Running the Application

Once both the frontend and backend are running, navigate to `http://localhost:5173` to view the application. You can register, log in, and start managing your courses.

## Usage

- **Register** a new account or **log in** to your existing account.
- **Add courses** and start building your learning journey.
- **Add modules** add modules and the study materials for your courses.. files can be uploaded
- **Track your progress** and  as you complete tasks
  **Add  Your assignments** and get notified on your due assignments timely

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Log in a user

### Courses
- `GET /api/courses`: Get a list of courses
- `POST /api/courses`: Add a new course
- `DELETE /api/courses/:id`: Delete a course

### Modules & Assignments
- `POST /api/courses/:courseId/modules`: Add a module to a course
- `DELETE /api/courses/:courseId/modules/:moduleId`: Delete a module
- `POST /api/courses/:courseId/assignments`: Add an assignment
- `GET /api/courses/:courseId/assignments`: Get all assignments for a course

## Contributing

If you'd like to contribute to StudySync, feel free to fork the repository and create a pull request with your improvements. Make sure to write tests for new features and follow the existing code style.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

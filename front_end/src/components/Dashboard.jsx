import React, {useState, useEffect} from 'react';
import { DashboardApi } from '../services/api';
import { CoursesApi, deleteCourseApi, getOverallProgressApi } from '../services/api';
import CourseCards from './CourseCards';
import { useNavigate, Link } from "react-router-dom";
import { BookOpenIcon } from 'lucide-react';

const Dashboard = () => {
  const [username, setUsername] = useState(null);
  const [courses, setCourses] = useState([]);
  const [overallProgress, setOverallProgress] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
  
      const fetchData = async () => {
        try {
          //fetch username
          const token = localStorage.getItem("token");
          const dashboardResponse = await DashboardApi(token)
          setUsername(dashboardResponse.data.username);
  
          // fetch courses
          const coursesResponse = await CoursesApi(token);
          setCourses(coursesResponse.data.courses || []);

          const progressResponse = await getOverallProgressApi(token);
          setOverallProgress(progressResponse.data.overall_progress || 0);
        } catch (error) {
          console.error("Error fetching dashboard data", error);
        }
      };
      
      fetchData();
  }, []);
  
  const handleViewDetails = (courseId) => {
    navigate(`/courses/${courseId}`)
  };

  const handleRemoveCourse = async (id) => {
      try {
        const token = localStorage.getItem("token");
        await deleteCourseApi(token, id);
  
        const coursesResponse = await CoursesApi(token);
        setCourses(coursesResponse.data.courses || []);
      } catch (error) {
        console.error("Error deleting course", error);
      }
  };

  return (
    <div className="ml-0 md:ml-64 mt-16 p-6 max-w-full">
      <div className="mb-6 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg shadow-lg p-8">
        {username && <h1 className="text-3xl font-bold">Welcome back, {username} 👋</h1>}
        <div className="mt-6">
          <h2 className="text-lg font-medium">Overall Progress on your studies</h2>
          <div className="relative mt-4 w-full bg-gray-200 rounded-full h-6">
            <div
              className="absolute top-0 left-0 bg-green-400 h-6 rounded-full text-white text-sm font-semibold flex items-center justify-center"
              style={{ width: `${overallProgress}%` }}
            >
              {overallProgress.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl-grid-cols-4 gap-4">
          {courses.length > 0 ? (
            courses.map((course, index) => (
              <CourseCards
                key={index}
                title={course.title}
                description={course.description}
                progress={course.progress}
                courseId={course.id}
                handleViewDetails={handleViewDetails}
                handleRemoveCourse={handleRemoveCourse}
              />
            ))
          ) : (
            <p className="text-black">
                No courses added yet. Add Course to start!
                <Link
                to="/courses"
                className="flex itemc-center px-4 py-2 hover:bg-gray-400 rounded-full"
              >
                <BookOpenIcon className="w-5 h-5 mr-3" />
                Courses
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard

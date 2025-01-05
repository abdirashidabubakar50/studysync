import React, { useEffect, useState } from "react";
import {
  addModuleApi,
  CourseDetailsApi,
  DashboardApi,
  CoursesApi,
  addCourseApi,
  deleteCourseApi
} from "../services/api";
import { Link } from "react-router-dom";
import SideBar from "../components/SideBar";
import RightNavBar from "../components/RightNavBar";
import CourseCards from '../components/CourseCards';
import { BsPlusCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

const CoursePage = () => {
  const [username, setUsername] = useState(null);
  const [courses, setCourses] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: "", description: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        //fetch username
        const token = localStorage.getItem("token");
        const dashboardResponse = await DashboardApi(token);
        setUsername(dashboardResponse.data.username);

        // fetch courses
        const coursesResponse = await CoursesApi(token);
        setCourses(coursesResponse.data.courses || []);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };

    fetchData();
  }, []);

  const handleViewDetails = (courseId) => {
    navigate(`/courses/${courseId}`)
  }


  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await addCourseApi(token, newCourse);
      console.log("Api Response", response.data);
      setCourses((prevCourses) => [...prevCourses, response.data.course]);
      setIsFormOpen(false);
      setNewCourse({ titile: "", description: "" });

    } catch (error) {
      console.error("Error Adding course", error);
    }
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
    <MainLayout>
      <div className="ml-0 md:ml-64  p-6 max-w-full flex-grow min-h-screen">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
          <Link
            onClick={() => setIsFormOpen(true)}
            className="flex items-center text-black px-4 py-2 rounded-full hover:bg-neutral hover:text-white w-fit"
          >
            <BsPlusCircle className='mr-2' />
            Add Course
          </Link>
        </div>

        {isFormOpen && (
          <form
            onSubmit={handleAddCourse}
            className="bg-gray-100 p-6 rounded-lg shadow-md mb-4"
          >
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Title
              </label>
              <input
                type="text"
                value={newCourse.title}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, title: e.target.value })
                }
                className=" p-2 border border-gray-300 rounded-lg w-fit"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Description
              </label>
              <textarea
                value={newCourse.description}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, description: e.target.value })
                }
                className="p-2 border border-gray-300 rounded-lg w-1/2"
                required
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded mr-2 hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save Course
              </button>
            </div>
          </form>
        )}

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
            <p className="text-gray-500">No courses available. Add Courses!</p>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default CoursePage;

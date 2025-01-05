import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { CourseDetailsApi, addModuleApi } from '../services/api';
import SideBar from '../components/SideBar';
import RightNavBar from '../components/RightNavBar';
import { Link } from 'react-router-dom';
import { MdSwitchRight } from "react-icons/md";
import { BsPlusCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import MainLayout from '../layouts/MainLayout';


const CourseDetails = () => {
  const { courseId } = useParams();
  console.log('extracted courseId', courseId)
    const [CourseDetails, setCourseDetails] = useState(null);
    const [viewMode, setViewMode] = useState('cards');
    const [modules, setModules] = useState([]);
    const [newModule, setNewModule] = useState({ title: "", description: "" });
    const [isFormOpen, setIsFormOpen] = useState(false);
    const navigate = useNavigate();    
    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await CourseDetailsApi(token, courseId);
                const {course, modules} = response.data
                setCourseDetails({
                    ...course,
                    modules: modules || [],
                });
            } catch (error) {
                console.error("Error fetching course details", error)
            }
        };
        fetchCourseDetails();
    }, [courseId]);

    if (!CourseDetails) {
        return <p>Loading course details...</p>
    }

    const handleAddModule = async (e) => {
        e.preventDefault();
      try {
        const token = localStorage.getItem("token");
          await addModuleApi(token, courseId, newModule);
          setIsFormOpen(false);
          setNewModule({ title: "", description: "" });

          const response = await CourseDetailsApi(token, courseId);
          const { course, modules } = response.data;
          setCourseDetails({
            ...course,
            modules: modules || [],
          });
        
      } catch (error) {
        console.error("Error adding Module", error);
      }
    };

  const handleViewModuleDetails = (moduleId, courseId) => {
      console.log("Navigating to module:", moduleId);
      navigate(`/courses/${courseId}/modules/${moduleId}`);
    };

  return (
    <MainLayout>
      <div className="ml-0 md:ml-64 mt-16 p-6 max-w-full">
        <h2 className="text-2xl font-bold">{CourseDetails.title}</h2>
        <p className="text-gray-600 mt-2">{CourseDetails.description}</p>
        <Link
          onClick={() => setIsFormOpen(true)}
          className="flex items-center text-black px-4 py-2 rounded-full hover:bg-neutral hover:text-white w-fit mt-6"
        >
          <BsPlusCircle className="mr-2" />
          Add Module
        </Link>
        {isFormOpen && (
          <form
            onSubmit={handleAddModule}
            className="bg-gray-100 p-6 rounded-lg shadow-md mb-4"
          >
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Title
              </label>
              <input
                type="text"
                value={newModule.title}
                onChange={(e) =>
                  setNewModule({ ...newModule, title: e.target.value })
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
                value={newModule.description}
                onChange={(e) =>
                  setNewModule({ ...newModule, description: e.target.value })
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
                Save Module
              </button>
            </div>
          </form>
        )}

        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Modules</h3>
            <Link
              onClick={() =>
                setViewMode((prev) => (prev === "cards" ? "list" : "cards"))
              }
              className=" text-neutral px-4 py-2 rounded-md"
            >
              <MdSwitchRight /> Switch to{" "}
              {viewMode === "cards" ? "List" : "Cards"} View
            </Link>
          </div>

          {viewMode === "cards" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {CourseDetails.modules?.length > 0 ? (
                CourseDetails.modules.map((module) => (
                  <div
                    key={module.id}
                    className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
                  >
                    <Link className="font-bold text-lg">{module.title} </Link>
                    <p className="text-gray-500 mt-2">{module.description}</p>
                    <button onClick={() => handleViewModuleDetails(module.id, courseId)}>View</button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No modules available.</p>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {CourseDetails.modules?.length > 0 ? (
                CourseDetails.modules.map((module) => (
                  <div
                    key={module.id}
                    className="bg-white shadow-md rounded-lg border py-4 px-4 border-gray-200 w-1/2"
                  >
                    <Link className="font-bold text-lg">{module.title} </Link>
                    <p className="text-gray-500 mt-2">{module.description}</p>
                    <button onClick={() => handleViewModuleDetails(module.id, courseId)}>View</button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No modules available.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default CourseDetails

import React, { useEffect, useState } from "react";
import { CourseDetailsApi, addModuleApi } from "../services/api";
import Dashboard from "../components/Dashboard";
import { useParams } from "react-router-dom";

const CoursePage = () => {
  const { course_id } = useParams();
  const [CourseDetails, setCourseDetails] = useState(null);
  const [modules, setModules] = useState([]);
  const [newModule, setNewModule] = useState({ title: "", description: "" });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {

      try {
        const token = localStorage.getItem("token");
        const response = await CourseDetailsApi(token, course_id);
        console.log("API Responses", response)
        setCourseDetails(response.data.course || {});
        setModules(response.data.modules || []);
      } catch (error) {
        console.error("Error fetching course details", error)
      }
    };

    fetchCourseDetails()
  }, [course_id]);

  const handleAddModule = async () => {
    try {
      const token = localStorage.getItem('token');
      await addModuleApi(token, course_id, newModule);
      setNewModule({ title: "", description: "" });
      setIsAdding(false);

      // Refresh modules after adding
      const response = await CourseDetailsApi(token, course_id);
      console.log('Module Api responses', response)
      setModules(response.data.modules || []);
    } catch (error) {
      console.error("Error adding Module", error)
    }
  };

  return (
    <>
      <Dashboard>
        <div className="p=4">
          {CourseDetails ? (
            <>
              <h1 className="p-4  text-xl font-semibold">
                {CourseDetails.title}
              </h1>
              <p className="p-4">{CourseDetails.description}</p>
            </>
          ) : (
            <p>Loading course details...</p>
          )}
        </div>
        {/* Add Module Form */}
        <div className="p-4">
          <button
            className="bg-accent text-white p-2 w-28 rounded mb-4"
            onClick={() => setIsAdding(!isAdding)}
          >
            {isAdding ? "Cancel" : "Add Module"}
          </button>
          {isAdding && (
            <div>
              <input
                type="text"
                placeholder="Module Title"
                value={newModule.title}
                onChange={(e) =>
                  setNewModule({ ...newModule, title: e.target.value })
                }
                className="p-2 border rounded  mb-2"
              />
              <textarea
                placeholder="Module Description"
                value={newModule.description}
                onChange={(e) =>
                  setNewModule({ ...newModule, description: e.target.value })
                }
                className="p-2 border rounded w-full mb-2"
                rows={3}
              />
              <button
                className="bg-secondary text-white p-2 w-28 rounded"
                onClick={handleAddModule}
              >
                Save
              </button>
            </div>
          )}
        </div>

        {/* Module List */}
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2">Modules</h2>
          {modules.length > 0 ? (
            modules.map((module) => (
              <div key={module.id} className="border p-2 mb-2 rounded w-1/2">
                <a href="">
                  <h3 className="font-semibold">{module.title}</h3>
                </a>
                <p>{module.description}</p>
              </div>
            ))
          ) : (
            <p>No modules found.</p>
          )}
        </div>
      </Dashboard>
    </>
  );
};

export default CoursePage;

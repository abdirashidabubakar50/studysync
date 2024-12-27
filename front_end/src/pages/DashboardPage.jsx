import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import {
  DashboardApi,
  CoursesApi,
  CourseDetailsApi,
  addCourseApi,
  deleteCourseApi,
  addModuleApi,
} from "../services/api";
import Dashboard from '../components/Dashboard';
import { Grid,  Typography, TextField, Button, Box } from "@mui/material";
import CourseCard from '../components/CourseCards';


const DashboardPage = () => {
  const [username, setUsername] = useState(null);
  const [courses, setCourses] = useState([]);
  const [showAddCourse, setShowAddCourse] = useState(false)
  const [newCourse, setNewCourse] = useState({ title: "", description: "" });
  const navigate = useNavigate()
  
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
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };
		
    fetchData();
  }, []);

  const handleAddCourse = async () => {
    try {
      const token = localStorage.getItem("token");
      await addCourseApi(token, newCourse);
      setNewCourse({ titile: "", description: "" });
      setShowAddCourse(false);

      // Refresh courses
      const coursesResponse = await CoursesApi(token);
      setCourses(coursesResponse.data.courses || []);
    } catch (error) {
      console.error("Error Adding course", error);
    }
  };

  const handleDeleteCourse = async (id) => {

    try {
      const token = localStorage.getItem("token");
      await deleteCourseApi(token, id);

      //Refresh courses after deletion
      const coursesResponse = await CoursesApi(token);
      setCourses(coursesResponse.data.courses || []);
    } catch (error) {
      console.error("Error deleting course", error);
    }
  }

	return (
    <>
      <Dashboard>
        <Box p={4}>
          {username && (
            <Typography variant="h6" gutterBottom>
              Hello, {username} 👋!
            </Typography>
          )}
          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              Your Courses
            </Typography>
            <Grid container spacing={2}>
              {courses.length > 0 ? (
                courses.map((course) => (
                  <Grid item xs={12} sm={6} md={4} key={course.id}>
                    <CourseCard
                      id={course.id}
                      name={course.title}
                      description={course.description}
                      handleDelete={handleDeleteCourse}
                    />
                  </Grid>
                ))
              ) : (
                <Typography className="p-4">No courses found.</Typography>
              )}
            </Grid>
          </Box>
          <Box mt={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowAddCourse(!showAddCourse)}
            >
              {showAddCourse ? "cancel" : "Add Course"}
            </Button>
            {showAddCourse && (
              <Box className="mt-4">
                <TextField
                  label="Course Title"
                  value={newCourse.title}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, title: e.target.value })
                  }
                  className="mb-4"
                  variant="outlined"
                  InputProps={{
                    style: { borderRadius: "0px" }, // Sharp edges
                  }}
                  sx={{
                    marginBottom: "1rem",
                  }}
                />
                <TextField
                  label="Course Description"
                  value={newCourse.description}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, description: e.target.value })
                  }
                  InputProps={{
                    style: { borderRadius: "0px" }, // Sharp edges
                  }}
                  fullWidth
                  variant="outlined"
                  sx={{
                    marginBottom: "1rem",
                  }}
                  multiline
                  rows={5}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleAddCourse}
                >
                  Add
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Dashboard>
    </>
  );
}

export default DashboardPage

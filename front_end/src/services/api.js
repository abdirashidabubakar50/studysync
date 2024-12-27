import axios from 'axios';

const API_URL = "http://localhost:5000/"

export const registerUser = async (data) => {
    return axios.post(`${API_URL}/auth/register`, data);
};


export const loginUser = async (data) => {
    return axios.post(`${API_URL}/auth/login`, data);
};

export const logoutUser = async (token) => {
  return axios.post(
    `${API_URL}/auth/logout`,
    {}, // No body required
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const DashboardApi = async(token) => {
    return axios.get(`${API_URL}/api/dashboard`, {
        headers: {
            Authorization: `bearer ${token}`,
        }
    });
}


export const CoursesApi = async (token) => {
    return await axios.get(`${API_URL}api/courses`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};


export const CourseDetailsApi = async (token, course_id) => {
    return await axios.get(`${API_URL}/api/courses/${course_id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};


export const addCourseApi = async (token, courseData) => {
    return await axios.post(`${API_URL}/api/courses`, courseData, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const deleteCourseApi = async (token, courseID) => {
    return await axios.delete(`${API_URL}api/courses/${courseID}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const addModuleApi = async (token, courseId, moduleData) => {
    return axios.post(`${API_URL}/api/courses/${courseId}/modules`, moduleData, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const deleteModule = async (token, course_id, module_id) => {
    return axios.delete(`${API_URL}/api/courses/${course_id}/modules/${module_id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const addAssignment = async (token, module_id) => {
    return axios.post(`${API_URL}/modules/${module_id}}/assignments`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};
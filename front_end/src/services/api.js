import axios from 'axios';

const API_URL = "http://localhost:5000/"


export const registerUser = async (data) => {
    return axios.post(`${API_URL}/auth/register`, data);
};


export const HomepageApi = async (data) => {
    return axios.get(`${API_URL}/homepage/`, data)
}

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
    return axios.get(`${API_URL}api/dashboard`, {
        headers: {
            Authorization: `bearer ${token}`,
        }
    });
}

export const updateProfileApi = async (token, formData) => {
    return axios.post(
        `${API_URL}api/profile`,
        JSON.stringify(formData),
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    );
};


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


export const getOverallProgressApi = async (token) => {
  return axios.get(`${API_URL}api/courses/overall_progress`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
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

export const markModuleComplete = async (token, courseId, moduleId) => {
    return axios.post(
        `${API_URL}api/courses/${courseId}/modules/${moduleId}`,
        {}, // Empty body
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }
    );
};


export const AddMaterialApi = async (token, courseId, moduleId, formData) => {
    try {
        const response = await axios.post(
            `${API_URL}api/courses/${courseId}/modules/${moduleId}/material`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        console.log('API Response:', response); // Log response here
        return response;
    } catch (error) {
        console.error('Error in AddMaterialApi:', error);
        throw error; // rethrow to handle it in the caller
    }
};



export const updateMaterialApi = async (token, courseId, moduleId, materialId, formData) => {
    const url = `${API_URL}api/courses/${courseId}/modules/${moduleId}/materials/${materialId}`;
    return axios.put(url, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // Fixed header typo
        },
    });
};


export const viewFile = async (fileUrl, token) => {
    try {
        console.log("Requesting file:", fileUrl);

        const response = await axios.get(`${API_URL}/api/uploads${fileUrl}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            responseType: 'blob',
        });

        // Create a Blob URL to open the file
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const fileBlobUrl = URL.createObjectURL(blob);

        // Open in a new tab
        const link = document.createElement('a');
        link.href = fileBlobUrl;
        link.target = '_blank';
        link.download = fileUrl.split('/').pop(); // Extract filename
        link.click();

        // Clean up
        URL.revokeObjectURL(fileBlobUrl);
    } catch (error) {
        console.error('Error viewing file:', error.response?.data || error.message);
        throw error;
    }
};


export const getAssignmentsApi = async (token) => {
    return axios.get(`${API_URL}api/assignments`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const addAssignmentApi = async (token, assignmentData) => {
    return axios.post(`${API_URL}api/assignments/add`, assignmentData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
}

export const deleteAssignmentApi = async (token, assignmentId) => {
    return axios.delete(`${API_URL}api/assignments/${assignmentId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}


export const markAssignmentCompleteApi = async (token, assignmentId) => {
    return axios.patch(`${API_URL}api/assignments/${assignmentId}/complete`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}


export const UnreadNotificationsApi = async (token) => {
    return axios.get(`${API_URL}api/unread`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const markNotificationsReadApi = async (token, notificationId) => {
    return axios.patch(`${API_URL}api/${notificationId}/read`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
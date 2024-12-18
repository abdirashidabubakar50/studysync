import axios from 'axios';

const API_URL = "http://localhost:5000/"

export const registerUser = async (data) => {
    return axios.post(`${API_URL}/auth/register`, data);
};


export const loginUser = async (data) => {
    return axios.post(`${API_URL}/auth/login`, data);
};

export const Dasboard = async(data) => {
    return axios.get(`${API_URL}/api/dashboard`, data);
}
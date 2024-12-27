import React, { useState } from 'react';
import logo from "../assets/logo-dark.png";
import study from "../assets/study.png";
import { loginUser } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await loginUser(formData);
      const {token, user} = response.data

      localStorage.setItem("token", token);
      localStorage.setItem("username", user.username );
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Login Failed');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-background  p-8 rounded shadow-md w-full max-w-md">
          {/* image section */}
          <div className="flex justify-center bg-background p-6">
            <img src={logo} alt="" className="h-16 w-auto" />
          </div>
          <h2 className="text-2xl font-bold mb-6 text-center">STUDYSYNC</h2>

          {/* {Form section} */}
          <h2 className="text-2xl font-semi-bold mb-6 text-left">
            Login to Your account
          </h2>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium" htmlFor="email">
                Email
              </label>
              <input
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200"
                type="email"
                id="email"
                name='email'
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-6">
              <label
                className="block mb-2 text-sm font-medium"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200"
                type="password"
                id="password"
                name='password'
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-accent hover:bg-secondary text-white py-2 px-4 rounded focus:outline-none"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-sm text-cetner text-black">
            Dont have an account?{" "}
            <a
              href="/register"
              className="text-black hover:underline font=medium"
            >
              Register
            </a>
          </p>
        </div>
        {/* <img src={study} alt="" className='h-35 w-auto' /> */}
      </div>
    </div>
  );
}

export default Login

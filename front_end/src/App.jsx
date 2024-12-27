import React from 'react'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import MainLayout from './layouts/MainLayout';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CoursePage from './pages/CoursePage';


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/course/:course_id" element={<CoursePage />} />
      </Route>
    </>
  )
);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App

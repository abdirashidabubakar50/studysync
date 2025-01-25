import React from 'react';
import { FaUser } from "react-icons/fa";
import { BellIcon, SearchIcon, MenuAlt3Icon } from "@heroicons/react/outline";
import logo_dark from '../assets/logo-dark.png';

const Navbar = () => {
  return (
    <header className="bg-white/30 backdrop-blur-md border-b border-gray-200 shadow-sm fixed top-0 left-0 right-0 z-50">
      <nav className="flex items-center justify-between h-20 px-6 md:px-12">
        {/* Left Section: Logo */}
        <div className="flex items-center space-x-3">
          <img src={logo_dark} alt="StudySync Logo" className="h-12 w-12" />
          <h1 className="text-xl font-bold text-gray-800">StudySync</h1>
        </div>

        {/* Right Section: Navigation Buttons */}
        <div className="flex items-center space-x-6">
          <button className="px-5 py-2 text-sm font-medium text-gray-800 bg-gray-100 border border-gray-300 rounded-full hover:bg-gray-200 hover:shadow-md transition duration-200">
            <a href="/register">SignUp</a>
          </button>
          <button className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full hover:shadow-md hover:from-purple-600 hover:to-indigo-600 transition duration-200">
            <a href="/login">Login</a>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

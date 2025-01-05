import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import {
  HomeIcon,
  BookOpenIcon,
  ClipboardListIcon,
  ChartBarIcon,
  GiftIcon,
  MenuAlt3Icon,
  BellIcon
} from "@heroicons/react/outline";
import { FaUser } from "react-icons/fa";
import logo_light from '../assets/logo-light.svg';
import { logoutUser } from '../services/api';
import { useNavigate } from 'react-router-dom';

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const Logout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token Found. Unable to logout");
        return;
      }
      const response = await logoutUser(token);
      if (response.status === 200) {
        localStorage.clear();
        navigate("/login");
      } else {
        console.error("Logout failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error logging out", error.message);
    }
  };

  return (
    <div>
      <div className="h-screen fixed top-0 left-0 w-64 bg-gradient-to-r from-[#A06CD5] to-[#6247AA] text-white flex-col md:flex hidden">
        {/* Logo */}
        <div className="p-4 mt-4 space-y-4 flex flex-col items-center border-b font-bold font-mono text-3xl">
          <img src={logo_light} alt="" className="w-16 h-16 mt-5 mb-2" />
          StudySync
        </div>

        {/* Navigation Links */}
        <nav className="flex-grow font-semibold">
          <ul className="mt-2 space-y-2 p-10 align-middle">
            <li>
              <Link
                to="/dashboard"
                className="flex items-center px-4 py-2 hover:bg-accent text-white rounded-full"
              >
                <HomeIcon className="w-5 h-5 mr-3" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/courses"
                className="flex itemc-center px-4 py-2 hover:bg-accent rounded-full"
              >
                <BookOpenIcon className="w-5 h-5 mr-3" />
                Courses
              </Link>
            </li>
            <li>
              <Link
                to="/assignments"
                className="flex items-center px-4 py-2 hover:bg-accent rounded-full"
              >
                <ClipboardListIcon className="w-5 h-5 mr-3" />
                Assignments
              </Link>
            </li>
            <li>
              <Link
                to="/progress"
                className="flex items-center px-4 py-2 hover:bg-accent rounded-full"
              >
                <ChartBarIcon className="w-5 h-5 mr-3" />
                Progress
              </Link>
            </li>
            <li>
              <Link
                to="/rewards"
                className="flex items-center px-4 py-2 hover:bg-accent rounded-full"
              >
                <BellIcon className="w-5 h-5 mr-3" />
                Notifications
              </Link>
            </li>
            <li>
              <Link
                to="/rewards"
                className="flex items-center px-4 py-2 hover:bg-accent rounded-full"
              >
                <GiftIcon className="w-5 h-5 mr-3" />
                Rewards
              </Link>
            </li>
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <Link
          >
            <button onClick={Logout} className="w-full bg-accent hover:bg-neutral text-white py-2 rounded-full">
              Logout
            </button>
          </Link>
        </div>
      </div>
      <div className="md:hidden fixed top-0 left-0 w-full bg-gradient-to-r from-[#A06CD5] to-[#6247AA] text-white z-50">
        <div className="flex items-center justify-between p-4">
          <img src={logo_light} alt="Logo" className="w-12 h-12" />
          <MenuAlt3Icon
            className="w-8 h-8 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
        {isOpen && (
          <nav className="bg-primary flex flex-col space-y-4 p-4">
            <Link
              to="/dashboard"
              className="flex items-center px-4 py-2 hover:bg-accent text-white rounded-full"
            >
              <HomeIcon className="w-5 h-5 mr-3" />
              Dashboard
            </Link>
            <Link
              to="/courses"
              className="flex itemc-center px-4 py-2 hover:bg-accent rounded-full"
            >
              <BookOpenIcon className="w-5 h-5 mr-3" />
              Courses
            </Link>
            <Link
              to="/assignments"
              className="flex items-center px-4 py-2 hover:bg-accent rounded-full"
            >
              <ClipboardListIcon className="w-5 h-5 mr-3" />
              Assignments
            </Link>
            <Link
              to="/progress"
              className="flex items-center px-4 py-2 hover:bg-accent rounded-full"
            >
              <ChartBarIcon className="w-5 h-5 mr-3" />
              Progress
            </Link>
            <Link
              to="/rewards"
              className="flex items-center px-4 py-2 hover:bg-accent rounded-full"
            >
              <BellIcon className="w-5 h-5 mr-3" />
              Notifications
            </Link>
            <Link
              to="/rewards"
              className="flex items-center px-4 py-2 hover:bg-accent rounded-full"
            >
              <GiftIcon className="w-5 h-5 mr-3" />
              Rewards
            </Link>
            <Link
              to="/rewards"
              className="flex items-center px-4 py-2 hover:bg-accent rounded-full"
            >
              <FaUser className="w-5 h-5 mr-3" />
              Profile
            </Link>
          </nav>
        )}
      </div>
    </div>
  );
}

export default SideBar



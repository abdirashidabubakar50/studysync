import React, {useState} from 'react';
import { Link } from "react-router-dom";
import { FaUser, } from "react-icons/fa";
import { BellIcon, SearchIcon, MenuAlt3Icon } from "@heroicons/react/outline";
import Notifications from './Notifications';
import ProfileModal from './ProfileModal';
import { DashboardApi } from '../services/api';

const RightNavBar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);


  const toggleProfileModal = async () => {
    if (!isProfileModalOpen) {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const response = await DashboardApi(token);
                    setUserData(response.data);
                } catch (error) {
                    console.error("Failed to fetch user data:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                console.error("Token not found in localStorage");
            }
        }
        setIsProfileModalOpen((prev) => !prev);
  }

  const toggleModal = () => {
      setIsModalOpen((prev) => !prev);
  };
  return (
    <div>
      <div className=" fixed top-0 left-0 right-0 md:left-64 flex justify-end h-20 items-center py-2 px-4 bg-slate-400">

        {/* Right Section: Notifications and Profile */}
        <div className="flex items-center cursor-pointer bg-slate-200 p-2 rounded-full hover:bg-gray-100/30 transition">
          {/* Profile Picture */}
          <div className="flex items-center space-x-10 cursor-pointer p-2 rounded-full hover:bg-gray-100/30 transition">
            <div  onClick={toggleModal}>
              <BellIcon className='h-6 w-6'/> 
            </div>
          </div>
          <div className="flex items-center space-x-10 cursor-pointer p-2 rounded-full hover:bg-gray-100/30 transition"
            onClick={toggleProfileModal}
          >
            <FaUser className='h-6 w-6'/>
          </div>
        </div>
      </div>
       {/* Notifications Modal */}
            {isModalOpen && (
                <Notifications visible={isModalOpen} onClose={toggleModal} />
      )}
      {isProfileModalOpen && (
                <ProfileModal
                    visible={isProfileModalOpen}
                    onClose={toggleProfileModal}
                    userData={userData}
                    loading={loading}
                />
            )}
    </div>
  );
}

export default RightNavBar

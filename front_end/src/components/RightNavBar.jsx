import React from 'react';
import { Link } from "react-router-dom";
import { FaUser, } from "react-icons/fa";
import { BellIcon, SearchIcon, MenuAlt3Icon } from "@heroicons/react/outline";;


const RightNavBar = () => {
  return (
    <div>
      <div className="fixed top-0 left-0 right-0 md:left-64 flex justify-end h-20 items-center py-2 px-4 ">

        {/* Right Section: Notifications and Profile */}
        <div className="flex items-center cursor-pointer p-2 rounded-full hover:bg-gray-100/30 transition">
          {/* Profile Picture */}
          <div className="flex items-center space-x-10 cursor-pointer p-2 rounded-full hover:bg-gray-100/30 transition">
            <BellIcon className='h-6 w-6'/>
            <FaUser className='h-6 w-6'/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RightNavBar

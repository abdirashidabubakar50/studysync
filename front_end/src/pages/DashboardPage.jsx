import React, { useEffect, useState } from 'react'
import Dashboard from '../components/Dashboard';
import SideBar from '../components/SideBar';
import RightNavBar from '../components/RightNavBar';
import MainLayout from '../layouts/MainLayout';


const DashboardPage = () => {

	return (
    <MainLayout className="flex">


      <div className="flex-grow min-h-screen">
        {/* Top Navigation Bar */}
        <Dashboard />

        {/* Main Content */}
        {/* <div className="pt-16 px-4">
          <Dashboard />
        </div> */}
      </div>
    </MainLayout>
  );
}

export default DashboardPage

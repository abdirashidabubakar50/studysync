import React from 'react'
import RightNavBar from '../components/RightNavBar'
import SideBar from '../components/SideBar'

const MainLayout = ({children}) => {
  return (
    <div>
      <SideBar />
      <RightNavBar />
      <div>
        {children}

      </div>
    </div>
  )
}

export default MainLayout

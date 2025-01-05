import React from 'react'
import RightNavBar from '../components/RightNavBar'
import SideBar from '../components/SideBar'

const MainLayout = ({children}) => {
  return (
    <div>
      <SideBar />
      <RightNavBar />
      <div className='bg-slate-300 mt-16'>
        {children}

      </div>
    </div>
  )
}

export default MainLayout

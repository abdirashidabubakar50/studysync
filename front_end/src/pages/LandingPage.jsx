import React from 'react'
import Hero from '../components/Hero'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import AboutUs from '../components/AboutUs'


const LandingPage = () => {
    return (
        <div className=''>
             <Navbar />
            <div>
                <Hero />
                <Features />
                <HowItWorks />
                <AboutUs />
                <Footer />
            </div>
       </div>
  )
}

export default LandingPage

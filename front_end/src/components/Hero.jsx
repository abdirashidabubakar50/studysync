import React from 'react';
import { useNavigate } from 'react-router-dom';
import study from '../assets/study.png'
import logo_dark from '../assets/logo-dark.png'
const Hero = () => {


  return (
    <section className="bg-gradient-to-r from-[#E2CFEA] to-[#A06CD5] py-12 md:py-24 overflow-hidden">
            <div className="container mx-auto flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-12">
                {/* Text Content */}
                <div className="text-center md:text-left md:w-1/2 space-y-6 animate__animated animate__fadeInLeft">
                    <h1 className="text-4xl md:text-6xl font-bold text-[#6247AA] leading-tight">
                        Unlock Your Potential with <span className="text-[#A06CD5]">StudySprint</span>
                    </h1>
                    <p className="text-gray-600 md:text-lg">
                        Discover tools, resources, and personalized support to achieve academic excellence.
                    </p>
                    <div className="flex justify-center md:justify-start gap-4">
                      <button className="bg-[#A06CD5] hover:bg-[#6247AA] text-white font-medium py-2 px-6 rounded-md transition duration-300">
                          <a href="/login">Get Started</a>
                        </button>
                      <button className="bg-[#102B3F] hover:bg-[#062726] text-white font-medium py-2 px-6 rounded-md transition duration-300">
                          <a href="/login"></a>
                            Learn More
                        </button>
                    </div>
                </div>

                {/* Animated Image */}
                <div className="md:w-1/2 flex justify-center animate__animated animate__fadeInRight animate__delay-1s">
                    <img
                        src={study}
                        alt="Hero Image"
                        className="w-full md:max-w-lg object-cover transition-transform duration-500 ease-in-out transform hover:scale-105 hover:opacity-90"
                    />
                </div>
            </div>
        </section>
        
  )
}

export default Hero

import React from 'react';
import { FaRocket, FaChalkboardTeacher, FaLaptop } from 'react-icons/fa';

const Features = () => {
  return (
    <div>
      <section className="bg-gradient-to-r from-[#E2CFEA] to-[#A06CD5] py-12 md:py-24">
      <div className="container mx-auto px-6 md:px-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#6247AA] mb-12">
          Our <span className="text-[#A06CD5]">Features</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-gradient-to-r from-[#A06CD5] to-[#6247AA] text-white p-8 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300">
            <FaRocket className="text-5xl mb-4" />
            <h3 className="text-xl font-semibold mb-4">Accelerate Learning</h3>
            <p>Fast-track your academic progress with personalized resources and interactive tools.</p>
          </div>
          {/* Feature 2 */}
          <div className="bg-gradient-to-l from-[#102B3F] to-[#062726] text-white p-8 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300">
            <FaChalkboardTeacher className="text-5xl mb-4" />
            <h3 className="text-xl font-semibold mb-4">Expert Guidance</h3>
            <p>Learn from the best! Our expert instructors provide step-by-step guidance.</p>
          </div>
          {/* Feature 3 */}
          <div className="bg-gradient-to-r from-[#062726] to-[#A06CD5] text-white p-8 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300">
            <FaLaptop className="text-5xl mb-4" />
            <h3 className="text-xl font-semibold mb-4">Online Accessibility</h3>
            <p>Access study materials and tools from anywhere, on any device.</p>
          </div>
        </div>
      </div>
    </section>
            
    </div>
  )
}

export default Features


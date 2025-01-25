import React from 'react';

const HowItWorks = () => {
    return (
        <section className="py-12 md:py-24 bg-gradient-to-r from-[#6247AA] to-[#102B3F]">
            <div className="container mx-auto px-6 md:px-12 text-center text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-12">
                    How <span className="text-[#A06CD5]">It Works</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Step 1 */}
                    <div className="bg-[#A06CD5] text-white p-8 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300">
                        <h3 className="text-2xl font-semibold mb-4">Step 1: Sign Up</h3>
                        <p>Join StudySprint by creating an account with just a few simple steps.</p>
                    </div>
                    {/* Step 2 */}
                    <div className="bg-[#102B3F] text-white p-8 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300">
                        <h3 className="text-2xl font-semibold mb-4">Step 2: Add Your Courses</h3>
                        <p>Add Your courses and kick start Your journey.</p>
                    </div>
                    {/* Step 3 */}
                    <div className="bg-gradient-to-l from-[#062726] to-[#A06CD5] text-white p-8 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300">
                        <h3 className="text-2xl font-semibold mb-4">Step 3: Start Learning</h3>
                        <p>Start your learning journey by adding modules and materials for your courses.</p>
                    </div>
                    {/* Step 3 */}
                    <div className="bg-gradient-to-l from-[#062726] to-[#A06CD5] text-white p-8 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300">
                        <h3 className="text-2xl font-semibold mb-4">Step 4: Add and track all of your assignments</h3>
                        <p>Add your assignments and be able to track them and get notified about upcoming assignments.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;

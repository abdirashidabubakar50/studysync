import React from 'react';
import teamImage from '../assets/me.jpg';

const AboutUs = () => {
  return (
    <div>
       <section className="bg-gradient-to-r from-[#6247AA] to-[#A06CD5] py-12 md:py-24">
            <div className="container mx-auto px-6 md:px-12 text-center text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-8">
                    About <span className="text-[#E2CFEA]">StudySprint</span>
                </h2>
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="md:w-1/2">
                        <img src={teamImage} alt="Our Team" className="rounded-lg shadow-lg w-full" />
                    </div>
                    <div className="md:w-1/2 space-y-4">
                        <p className="text-lg md:text-xl">
                            StudySprint was founded by a group of passionate educators and tech enthusiasts who wanted to
                            revolutionize the way students approach learning.
                        </p>
                        <p className="text-lg md:text-xl">
                            Our team is dedicated to providing the best possible resources and personalized tools for students
                            around the world.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    </div>
  )
}

export default AboutUs

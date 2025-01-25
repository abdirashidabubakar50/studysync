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
                            StudySync is a personal project developed as part of the final project for the ALX program, inspired by a passion for advancing education and learning.
                        </p>
                        <p className="text-lg md:text-xl">
                            The goal of this project is to provide innovative resources and personalized tools to support students in their educational journey.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    </div>
  )
}

export default AboutUs

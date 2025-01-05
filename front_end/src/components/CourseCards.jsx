import React from 'react'

const CourseCards = ({ courseId, title, description, progress, handleViewDetails, handleRemoveCourse }) => {
  return (
    <>
      <div className=" overflow-hidden w-full max-w-sm m-auto min-w-0 z-40 bg-gradient-to-r from-[#A06CD5] to-[#6247AA] text-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300">
        <div className="p-6">
          {/* Course Title */}
          <h3 className="text-xl font-bold">{title}</h3>

          {/* Course Description */}
          <p className=" mt-2">{description}</p>

          {/* Course Details */}
         <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={`h-4 rounded-full transition-all duration-300`}
              style={{
                width: `${progress}%`,
                backgroundColor: progress === 100 ? '#22c55e' : '#2563eb',
              }}
            ></div>
          </div>
          <p className="text-sm mt-1">{progress}% completed</p>
        </div>

          {/* Button */}
          <div className="mt-4 flex justify-between">
            <button
              onClick={() => handleViewDetails(courseId)}
              className="bg-neutral text-white px-4 py-2 rounded-lg hover:bg-black"
            >
              Continue
            </button>
            <button
              onClick={() => handleRemoveCourse(courseId)}
              className="bg-neutral text-white px-4 py-2 rounded-lg hover:bg-black"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseCards

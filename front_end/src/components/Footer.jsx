import React from 'react'

const Footer = () => {
  return (
    <div>
      <footer className="bg-[#102B3F] py-8">
            <div className="container mx-auto px-6 md:px-12 text-white text-center">
                <p className="text-lg mb-4">
                    © 2025 StudySprint, All Rights Reserved
                </p>
                <div className="flex justify-center gap-6">
                    <a href="#" className="hover:text-[#A06CD5] transition duration-300">Privacy Policy</a>
                    <a href="#" className="hover:text-[#A06CD5] transition duration-300">Terms of Service</a>
                    <a href="#" className="hover:text-[#A06CD5] transition duration-300">Contact Us</a>
                </div>
            </div>
        </footer>
    </div>
  )
}

export default Footer

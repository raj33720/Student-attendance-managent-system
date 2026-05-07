import React from 'react';

const Footer = () => {
    return (
        <footer className="mt-12 border-t border-gray-200 bg-white shadow-sm">
            <div className="container mx-auto px-5 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <img src="https://nitsikkim.ac.in/img/logo/logo.svg" alt="Institute logo" className="w-10 hover:scale-110 transition-transform" />
                        <span className="font-bold text-gray-900">Student Attendance Management</span>
                    </div>
                    <p className="text-center text-gray-600">
                        Streamlined attendance records for students, teachers, and administrators.
                    </p>
                    <div className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} CVM University. All rights reserved.
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 mt-6 pt-6 text-center text-gray-500 text-sm">
                    <p>Built with ❤️ for educational excellence</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

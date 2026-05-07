import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Header from '../header/Header'

const Home = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="relative container mx-auto px-4 py-20 z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Title */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
              Welcome to Student Attendance
            </h1>
            <p className="text-xl md:text-2xl text-slate-700 mb-8">
              Manage and track student attendance efficiently
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row gap-6 justify-center mb-20">
            <RouterLink
              to="/login"
              className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all duration-200 shadow text-lg"
            >
              Get Started
            </RouterLink>
            <RouterLink
              to="/login"
              className="px-8 py-4 bg-white border border-gray-200 text-slate-900 font-bold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow text-lg"
            >
              Learn More
            </RouterLink>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            <div className="glass-panel p-8 text-slate-700 hover:scale-105 transition-transform duration-300">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-bold mb-3">For Students</h3>
              <p className="text-slate-600">Track your attendance, view reports, and stay updated with your status</p>
            </div>

            <div className="glass-panel p-8 text-slate-700 hover:scale-105 transition-transform duration-300">
              <div className="text-4xl mb-4">👨‍🏫</div>
              <h3 className="text-xl font-bold mb-3">For Faculty</h3>
              <p className="text-slate-600">Mark attendance, manage records, and generate comprehensive reports</p>
            </div>

            <div className="glass-panel p-8 text-slate-700 hover:scale-105 transition-transform duration-300">
              <div className="text-4xl mb-4">⚙️</div>
              <h3 className="text-xl font-bold mb-3">For Admins</h3>
              <p className="text-slate-600">Oversee all operations, manage users, and maintain system integrity</p>
            </div>
          </div>

          {/* Stats */}
          <div className="glass-panel p-12 mb-20 text-slate-900">
            <h2 className="text-3xl font-bold mb-8">Why Choose Us?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold text-blue-300 mb-2">100%</div>
                <p className="text-slate-600">Accurate Tracking</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-300 mb-2">Real-time</div>
                <p className="text-slate-600">Updates & Reports</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-pink-300 mb-2">Secure</div>
                <p className="text-slate-600">Data Protection</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
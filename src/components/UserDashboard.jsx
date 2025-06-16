import React from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, Outlet } from 'react-router-dom';

export default function UserDashboard() {

  const navigate = useNavigate();
  const handleQuestion = () => {
    navigate('question');
  };

  const handleQuiz = () => {
    navigate('quizHome');
  };

  if (!sessionStorage.getItem('token')) {
    return (
      toast.error('Please login to access this page.'),
      window.location.href = '/login'
    );
  }

  const handleLogout = () => {
    navigate('/logout');
  };
  

  return (
    <div>
        <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">                
          <button
            onClick={handleLogout}
            className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-xl font-medium border border-gray-200 transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Log Out
          </button>
        </div>
      </div>  
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">      
      <div className="max-w-xl mx-auto bg-white p-12 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center space-y-8">
          <div>
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Quiz<span className="text-blue-600">Master</span>
            </h1>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          <p className="text-lg text-gray-600 leading-relaxed">
            Hi {sessionStorage.getItem('user')}, Welcome to our Quiz application.
            <br />
            Test your knowledge and contribute to our community!
          </p>

          <div className="space-y-4 pt-4">
            <button
              onClick={handleQuiz}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              🎯 Take Quiz
            </button>

            <button
              onClick={handleQuestion}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              ➕ Contribute a Question
            </button>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Join thousands of learners in our quiz community
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
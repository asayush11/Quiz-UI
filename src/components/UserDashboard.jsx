import React from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, Outlet } from 'react-router-dom';

export default function UserDashboard() {  
  sessionStorage.removeItem('score');
  sessionStorage.removeItem('answers');
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
  

  const userName = sessionStorage.getItem('user');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Q</span>
            </div>
            <span className="font-semibold text-gray-800">QuizMaster Dashboard</span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium border border-red-200 transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Log Out
          </button>
        </div>
      </div>  

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-10 -translate-x-10"></div>
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-2">Welcome back, {userName}! 👋</h1>
              <p className="text-blue-100 text-lg">Ready to challenge yourself today?</p>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div 
            onClick={handleQuiz}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 group hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl">
                🎯
              </div>
              <div className="text-blue-600 group-hover:translate-x-1 transition-transform duration-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Take Quiz</h3>
            <p className="text-gray-600">Test your knowledge across various topics and see how you rank!</p>
          </div>

          <div 
            onClick={handleQuestion}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 group hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-xl">
                ➕
              </div>
              <div className="text-green-600 group-hover:translate-x-1 transition-transform duration-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Contribute Question</h3>
            <p className="text-gray-600">Help grow our community by adding your own quiz questions!</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Quick Stats.....Coming Soon</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600 mb-1">---</div>
              <div className="text-sm text-gray-600">Quizzes Taken</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600 mb-1">---</div>
              <div className="text-sm text-gray-600">Questions Added</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600 mb-1">---</div>
              <div className="text-sm text-gray-600">Best Score</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
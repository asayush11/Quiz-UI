import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserHome() {

 const handleQuestion = () => {
    <Question />
  };

  const handleQuiz = () => {
    <QuizHome />
  };

  if (!sessionStorage.getItem('token')) {
    return (
      toast.error('Please login to access this page.'),
      navigate('/login')
    );
  }

  return (
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
            Hi, Welcome to our Quiz application.
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
  );
}
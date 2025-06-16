import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login'); 
  };

  const handleSignUP = () => {
    navigate('/SignUp');
  };

  const handleQuiz = () => {
    navigate('/Sample');
  };

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
            Test your knowledge across wide range of topics and contribute to our community!
          </p>
          
          <div className="space-y-4 pt-4">
            <button 
              onClick={handleQuiz}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              📊 Sample Maths Quiz
            </button>
            
            <button 
              onClick={handleLogin} 
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              Login
            </button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <button 
              onClick={handleSignUP}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create an Account
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
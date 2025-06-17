import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';

export default function Instructions() {
  const navigate = useNavigate();
  const { startQuiz, questions } = useOutletContext();
  const numQuestions = questions.length;
  sessionStorage.setItem('score', 0);
  sessionStorage.setItem('answers', JSON.stringify([]));

  const goHome = () => {
        if(sessionStorage.getItem('token') === null) {
            window.location.href = '/';
            return null;
        }
        navigate('/user');
        return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-rose-50 to-orange-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/30 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-violet-600 to-rose-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">📋</span>
              </div>
              <div>
                <h2 className="font-bold text-xl text-gray-800">Quiz Instructions</h2>
                <p className="text-xs text-gray-600">Read carefully before starting</p>
              </div>
            </div>
            <button 
              onClick={goHome} 
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium border border-gray-200 transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-32 left-16 w-80 h-80 bg-gradient-to-r from-violet-300/20 to-rose-300/20 rounded-full blur-3xl"></div>
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-r from-rose-300/20 to-orange-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-32 left-1/4 w-72 h-72 bg-gradient-to-r from-orange-300/20 to-violet-300/20 rounded-full blur-3xl"></div>

      {/* Main Content */}
      <div className="relative max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-rose-600 to-orange-600 mb-6">
            Quiz Instructions
          </h1>
          <div className="w-32 h-1.5 bg-gradient-to-r from-violet-500 to-rose-500 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Get ready to challenge yourself! Here's everything you need to know before starting your quiz journey.
          </p>
        </div>

        {/* Quiz Overview Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50 mb-8">
          <div className="bg-gradient-to-r from-violet-600 to-rose-600 rounded-2xl p-6 text-white mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Quiz Overview</h2>
                <p className="text-violet-100">What to expect in this quiz</p>
              </div>
              <div className="text-6xl opacity-20">🎯</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-violet-50 rounded-2xl">
                <div className="w-12 h-12 bg-violet-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">{numQuestions}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Total Questions</h3>
                  <p className="text-gray-600">Multiple choice format</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-rose-50 rounded-2xl">
                <div className="w-12 h-12 bg-rose-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">{sessionStorage.getItem('timePerQuestion') || 45}s</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Timer per Question</h3>
                  <p className="text-gray-600">Think fast and answer wisely</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-2xl">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">+1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Correct Answer</h3>
                  <p className="text-gray-600">Points added to your score</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-red-50 rounded-2xl">
                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">-0.5</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Wrong Answer</h3>
                  <p className="text-gray-600">Points deducted from score</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rules and Guidelines */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Important Guidelines */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Quiz Guidelines</h3>
            </div>
            
            <div className="space-y-4">
              {[
                "Each question offers 4 multiple-choice answers",
                "No internet connection required once quiz begins",
                "Use 'Next' to proceed, 'Clear' to deselect options",
                "Questions cannot be revisited once submitted"
              ].map((guideline, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-xs">{index + 1}</span>
                  </div>
                  <p className="text-gray-700">{guideline}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips for Success */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Success Tips</h3>
            </div>
            
            <div className="space-y-4">
              {[
                "Read each question carefully before answering",
                "Manage your time effectively - don't overthink",
                "Trust your first instinct if unsure",
                "Stay calm and focused throughout the quiz"
              ].map((tip, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-xs">✓</span>
                  </div>
                  <p className="text-gray-700">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-6 mb-8 text-white shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">⚠️</span>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-1">Important Warning</h3>
              <p className="text-red-100">Avoid refreshing the page during the quiz to prevent data loss. Once you start, complete the entire quiz in one session.</p>
            </div>
          </div>
        </div>

        {/* Start Quiz CTA */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-white/50 text-center">
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Ready to Begin?</h3>
            <p className="text-xl text-gray-600">Click the button below to start your quiz adventure!</p>
          </div>
          
          <button 
            onClick={startQuiz} 
            className="inline-flex items-center px-12 py-5 bg-gradient-to-r from-violet-600 to-rose-600 hover:from-violet-700 hover:to-rose-700 text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <span className="mr-3">🚀</span>
            Start Quiz Now
            <span className="ml-3 w-2 h-2 bg-white rounded-full animate-bounce"></span>
          </button>
          
          <p className="text-gray-500 text-sm mt-4">
            Best of luck! Show us what you know.
          </p>
        </div>
      </div>
    </div>
  );
}
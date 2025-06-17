import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('score');
  sessionStorage.removeItem('answers');
  sessionStorage.removeItem('timePerQuestion');

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-100">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-md border-b border-white/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">Q</span>
            </div>
            <div>
              <h2 className="font-bold text-xl text-gray-800">QuizMaster</h2>
              <p className="text-xs text-gray-600">Challenge Your Knowledge</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 mb-6">
              Welcome to<br />QuizMaster
            </h1>
            <div className="w-32 h-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500 mx-auto rounded-full mb-8"></div>
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Embark on an incredible journey of learning and discovery. Test your knowledge, 
              challenge your limits, and join a vibrant community of curious minds.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Test Knowledge</h3>
              <p className="text-gray-600 text-center">Challenge yourself with quizzes across multiple subjects and difficulty levels.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Join Community</h3>
              <p className="text-gray-600 text-center">Connect with thousands of learners and contribute to our growing question bank.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Track Progress</h3>
              <p className="text-gray-600 text-center">Monitor your learning journey and celebrate your achievements along the way.</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-white/50">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Ready to Get Started?</h3>
                <p className="text-gray-600">Choose your path and begin your learning adventure today!</p>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handleQuiz}
                  className="w-full bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white font-bold py-5 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-lg"
                >
                  <span className="mr-3">🚀</span>
                  Try Sample Math Quiz
                </button>
                
                <div className="grid md:grid-cols-1">
                  <button 
                    onClick={handleLogin} 
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                  >
                    <span className="flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </span>
                  </button>
                  <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 rounded-full">New to our community?</span>
                  </div>
                </div>
                  <button 
                    onClick={handleSignUP}
                    className="bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-300 hover:border-gray-400 font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Create Account
                </span>
                  </button>
                </div>

                
              </div>
            </div>
          </div>

          {/* Bottom Stats */}
          { false && <div className="mt-20 text-center">
            <div className="inline-flex items-center space-x-8 bg-white/70 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">1000+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-600">500+</div>
                <div className="text-sm text-gray-600">Quiz Questions</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">50+</div>
                <div className="text-sm text-gray-600">Topics Covered</div>
              </div>
            </div>
          </div> }
        </div>
      </div>
    </div>
  );
}
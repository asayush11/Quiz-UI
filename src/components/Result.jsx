import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';

export default function Result() {
  const navigate = useNavigate();
  const { score, answers } = useOutletContext();

  const goHome = () => {
        if(sessionStorage.getItem('token') === null) {
            window.location.href = '/';
            return null;
        }
        navigate('/user');
        return null;
  };

  // Calculate percentage and performance metrics
  const totalQuestions = answers.length;
  const correctAnswers = answers.filter(ans => ans.isCorrect).length;
  const percentage = Math.round((score / totalQuestions) * 100);

  // Performance level based on percentage
  const getPerformanceLevel = () => {
    if (percentage >= 90) return { level: 'Excellent', color: 'from-green-500 to-emerald-500', bgColor: 'from-green-50 to-emerald-50' };
    if (percentage >= 80) return { level: 'Great', color: 'from-blue-500 to-cyan-500', bgColor: 'from-blue-50 to-cyan-50' };
    if (percentage >= 70) return { level: 'Good', color: 'from-yellow-500 to-orange-500', bgColor: 'from-yellow-50 to-orange-50' };
    if (percentage >= 60) return { level: 'Fair', color: 'from-orange-500 to-red-500', bgColor: 'from-orange-50 to-red-50' };
    return { level: 'Needs Improvement', color: 'from-red-500 to-rose-500', bgColor: 'from-red-50 to-rose-50' };
  };

  const performance = getPerformanceLevel();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-200/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-200/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-200/30 rounded-full blur-xl animate-bounce delay-500"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-purple-200/30 rounded-full blur-xl animate-bounce delay-700"></div>
      </div>

      {/* Home Button - Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={goHome}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-full hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-200"
        >
          <span className="flex items-center gap-2">
            Back to Home
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </span>
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Hero Section with Score */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            {/* Floating Score Circle */}
            <div className="relative inline-block">
              <div className={`w-64 h-64 rounded-full bg-gradient-to-r ${performance.color} flex items-center justify-center shadow-2xl shadow-blue-200/40 animate-pulse`}>
                <div className="text-center text-white">
                  <div className="text-7xl font-bold mb-2">{score}</div>
                  <div className="text-xl opacity-90">/ {totalQuestions}</div>
                </div>
              </div>
              
              {/* Orbiting Performance Badge */}
              <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-gray-100 animate-bounce delay-300">
                <div className={`text-2xl font-bold bg-gradient-to-r ${performance.color} bg-clip-text text-transparent`}>
                  {performance.level}!
                </div>
              </div>
              
              {/* Orbiting Percentage Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-gray-100 animate-bounce delay-700">
                <div className="text-xl font-bold text-gray-700">{percentage}%</div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-6 mt-12">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 hover:bg-white/80 transition-all duration-300 group shadow-lg">
                <div className="text-5xl font-bold text-green-600 mb-2 group-hover:scale-110 transition-transform duration-300">{correctAnswers}</div>
                <div className="text-gray-600 text-lg">Correct Answers</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 hover:bg-white/80 transition-all duration-300 group shadow-lg">
                <div className="text-5xl font-bold text-red-500 mb-2 group-hover:scale-110 transition-transform duration-300">{(correctAnswers - score)*2}</div>
                <div className="text-gray-600 text-lg">Incorrect Answers</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 hover:bg-white/80 transition-all duration-300 group shadow-lg">
                <div className="text-5xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">{percentage}%</div>
                <div className="text-gray-600 text-lg">Final Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Results Section */}
        <div className="bg-white/50 backdrop-blur-sm border-t border-gray-200/50 min-h-screen">
          <div className="w-full p-8">
            <div className="text-center mb-8">
              <h3 className="text-4xl font-bold text-gray-800 mb-4">Detailed Review</h3>
              <p className="text-gray-600 text-xl">Review your answers and learn from detailed explanations</p>
            </div>

            <div className="h-96 overflow-y-auto space-y-6">
              {answers.map((ans, idx) => (
                <div key={idx} className={`rounded-3xl border-2 overflow-hidden bg-white/80 backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] shadow-lg mx-auto ${
                  ans.isCorrect
                    ? 'border-green-200 hover:shadow-green-100'
                    : 'border-red-200 hover:shadow-red-100'
                }`}>
                  {/* Question Header */}
                  <div className={`p-6 border-b border-gray-100 ${
                    ans.isCorrect
                      ? 'bg-green-50'
                      : 'bg-red-50'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-xl shadow-md ${
                        ans.isCorrect ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {ans.isCorrect ? '✓' : '✗'}
                      </div>
                      <span className="font-bold text-gray-800 text-xl">Question {idx + 1}</span>
                    </div>
                  </div>

                  {/* Question Content */}
                  <div className="p-6 space-y-6">
                    <div className="font-semibold text-gray-800 text-lg break-words">
                      {ans.question}?
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
                        <span className="text-green-700 font-semibold text-sm uppercase tracking-wide">Correct Answer</span>
                        <div className="font-bold text-green-800 mt-2 text-lg break-words">
                          {ans.correct}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                        <span className="text-gray-600 font-semibold text-sm uppercase tracking-wide">Your Answer</span>
                        <div className={`font-bold mt-2 text-lg break-words ${
                          ans.isCorrect ? 'text-green-800' : 'text-red-600'
                        }`}>
                          {ans.selected || 'No answer selected'}
                        </div>
                      </div>
                    </div>

                    {/* Explanation */}
                    <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                      <span className="text-blue-700 font-semibold text-sm uppercase tracking-wide">Explanation</span>
                      <div className="text-gray-700 mt-3 leading-relaxed break-words">
                        {ans.solution || 'No explanation available for this question.'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
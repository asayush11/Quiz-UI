import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Result({ score, answers }) {
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Results Header Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden mb-6">
          {/* Score Banner */}
          <div className={`bg-gradient-to-r ${performance.color} p-8 text-white text-center`}>
            <div className="mb-4">
              <div className="text-6xl font-bold mb-2">{score}</div>
              <div className="text-xl opacity-90">out of {totalQuestions}</div>
            </div>
            <div className="text-2xl font-semibold mb-2">{performance.level}!</div>
            <div className="text-lg opacity-90">{percentage}% Accuracy</div>
          </div>

          {/* Stats */}
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 border border-red-100">
                <div className="text-2xl font-bold text-red-600">{ (correctAnswers - score)*2 }</div>
                <div className="text-sm text-gray-600">Incorrect</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <div className="text-2xl font-bold text-blue-600">{percentage}%</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white">
            <h3 className="text-2xl font-bold">Detailed Review</h3>
            <p className="text-slate-300 mt-1">Review your answers and learn from explanations</p>
          </div>

          <div className="p-6 max-h-96 overflow-y-auto">
            <div className="space-y-6">
              {answers.map((ans, idx) => (
                <div key={idx} className={`rounded-2xl border-2 overflow-hidden ${ans.isCorrect
                    ? 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50'
                    : 'border-red-200 bg-gradient-to-r from-red-50 to-rose-50'
                  }`}>
                  {/* Question Header */}
                  <div className={`p-4 ${ans.isCorrect
                      ? 'bg-gradient-to-r from-green-100 to-emerald-100'
                      : 'bg-gradient-to-r from-red-100 to-rose-100'
                    }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${ans.isCorrect ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                        {ans.isCorrect ? '✓' : '✗'}
                      </div>
                      <span className="font-semibold text-gray-800">Question {idx + 1}</span>
                    </div>
                  </div>

                  {/* Question Content */}
                  <div className="p-4 space-y-3">
                    <div className="font-medium text-gray-800 break-words">
                      {ans.question}?
                    </div>

                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Correct Answer:</span>
                        <div className="font-semibold text-green-700 mt-1 break-words">
                          {ans.correct}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Your Answer:</span>
                        <div className={`font-semibold mt-1 break-words ${ans.isCorrect ? 'text-green-700' : 'text-red-700'
                          }`}>
                          {ans.selected || 'No answer selected'}
                        </div>
                      </div>
                    </div>

                    {/* Explanation */}
                    <div className="bg-white/70 rounded-xl p-3 border border-gray-200">
                      <span className="text-gray-600 text-sm font-medium">Explanation:</span>
                      <div className="text-gray-700 text-sm mt-1 break-words">
                        {ans.solution || 'No explanation available for this question.'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center mt-6">
          <button
            onClick={goHome}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <span className="flex items-center gap-2">
              Back to Home
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
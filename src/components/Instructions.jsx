import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import { useState } from 'react';

export default function Instructions() {
  const navigate = useNavigate();
  const [stay, setStay] = useState(true);
  const { startQuiz, questions } = useOutletContext();
  const numQuestions = questions.length;

  const goHome = () => {
        if(sessionStorage.getItem('token') === null) {
            window.location.href = '/';
            return null;
        }
        navigate('/user');
        return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
            <h2 className="text-5xl font-bold mb-2 tracking-tight">Quiz Instructions</h2>
            <div className="flex items-center gap-2 text-indigo-100">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-lg font-medium">Get ready to test your knowledge!</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Quiz Overview */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                Quiz Overview
              </h3>
              <p className="text-gray-700 text-lg">
                You will answer <span className="font-bold text-indigo-600">{numQuestions} questions</span> with a 45-second timer for each question.
              </p>
            </div>

            {/* Rules Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">+1</span>
                  </div>
                  <span className="font-semibold text-gray-800">Correct Answer</span>
                </div>
                <p className="text-gray-600">Earn 1 point for each correct response</p>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-5 border border-red-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">-0.5</span>
                  </div>
                  <span className="font-semibold text-gray-800">Wrong Answer</span>
                </div>
                <p className="text-gray-600">Lose 0.5 points for incorrect responses</p>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                Important Guidelines
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Each question offers 4 multiple-choice answers</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>No internet connection required once quiz begins</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Use "Next" to proceed, "Clear" to deselect options</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Questions cannot be revisited once submitted</span>
                </li>
              </ul>
            </div>

            {/* Warning */}
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 border border-red-200">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xs">!</span>
                </div>
                <p className="text-red-700 font-medium">
                  Avoid refreshing the page during the quiz to prevent data loss
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button 
                onClick={startQuiz} 
                className="flex-1 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center justify-center gap-2">
                  Start Quiz
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                </span>
              </button>
              
              <button 
                onClick={goHome} 
                className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-2xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transform hover:scale-[1.02] transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full opacity-10 animate-pulse delay-1000"></div>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';

export default function Quiz() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(sessionStorage.getItem('timePerQuestion') || 45);
  const { questions, finishQuiz } = useOutletContext();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          handleNext();
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [current]);

  const useCurrentLocation = () => {
    const location = useLocation().pathname;
    if( location === '/Sample/quiz') {
      return false;
    } return true;
  }

  const handleRefresh = () => {
      if(useCurrentLocation()) {
        window.location.href = '/user/quizHome/result';
      } else {
        window.location.href = '/Sample/result';
      }
  }

  const handleNext = () => {
    const q = questions[current];
    const score = parseFloat(sessionStorage.getItem('score')) || 0;
    const answerList = JSON.parse(sessionStorage.getItem('answers')) || [];
    if (selected === null) {
      const newAnswerList = [...answerList, {
        ...q,
        selected,
        isCorrect: false,
      }];
      sessionStorage.setItem('answers', JSON.stringify(newAnswerList));
      handleUpdate();
    }
    else {
      const correct = selected === q.correct;
      const delta = correct ? 1 : -0.5;
      sessionStorage.setItem('score', score + delta);
      const newAnswerList = [...answerList, {
        ...q,
        selected,
        isCorrect: correct,
      }];
      sessionStorage.setItem('answers', JSON.stringify(newAnswerList));
      handleUpdate();
    }
  };

  const handleClear = () => {
    setSelected(null);
  };

  const handleUpdate = () => {
    setSelected(null);
    setTimeLeft(sessionStorage.getItem('timePerQuestion') || 45);
    if (current === questions.length - 1) {
      finishQuiz();
    } else {
      setCurrent(current + 1);
    }
  };

  const goHome = () => {
        if(sessionStorage.getItem('token') === null) {
            window.location.href = '/';
            return null;
        }
        navigate('/user');
        return null;
  };

  const q = questions[current];

  // Calculate progress percentage
  const progressPercentage = ((current + 1) / questions.length) * 100;
  
  // Timer color based on time left
  const getTimerColor = () => {
    if (timeLeft*3 > 2*(sessionStorage.getItem('timePerQuestion') || 45)) return 'text-emerald-700';
    if (timeLeft*3 > (sessionStorage.getItem('timePerQuestion') || 45)) return 'text-amber-700';
    return 'text-red-600';
  };

  const getTimerBgColor = () => {
    if (timeLeft*3 > 2*(sessionStorage.getItem('timePerQuestion') || 45)) return 'from-emerald-400 via-teal-400 to-cyan-400';
    if (timeLeft*3 > (sessionStorage.getItem('timePerQuestion') || 45)) return 'from-amber-400 via-orange-400 to-yellow-400';
    return 'from-red-400 via-rose-400 to-pink-400';
  };

  const getTimerRing = () => {
    if (timeLeft*3 > 2*(sessionStorage.getItem('timePerQuestion') || 45)) return 'ring-emerald-200 bg-emerald-50';
    if (timeLeft*3 > (sessionStorage.getItem('timePerQuestion') || 45)) return 'ring-amber-200 bg-amber-50';
    return 'ring-red-200 bg-red-50';
  };

  if (questions.length === 0) {
    handleRefresh();
    return null;
  }

  else return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-4 overflow-y-auto relative">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-500"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 p-6 mb-6 hover:bg-white/90 hover:shadow-2xl transition-all duration-300">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-bold text-gray-700">Progress</span>
              <span className="text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-1.5 rounded-full shadow-lg">
                {current + 1} of {questions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
              <div 
                className="bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-600 h-4 rounded-full transition-all duration-700 ease-out shadow-lg relative overflow-hidden"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Header Info */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  Question {current + 1}/{questions.length}
                </span>
              </div>
            </div>
            
            {/* Timer */}
            <div className="flex items-center gap-4">
              <div className={`${getTimerColor()} font-bold text-2xl flex items-center gap-3 px-5 py-3 rounded-2xl ring-2 ${getTimerRing()} shadow-lg`}>
                <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${getTimerBgColor()} ${timeLeft <= 10 ? 'animate-ping' : 'animate-pulse'} shadow-md`}></div>
                <span className="tabular-nums">{timeLeft}s</span>
              </div>
              
              <button 
                onClick={goHome} 
                className="text-gray-600 hover:text-gray-800 underline underline-offset-2 text-sm font-semibold transition-all duration-200 hover:bg-gray-100 px-3 py-2 rounded-lg"
              >
                Home
              </button>
            </div>
          </div>
        </div>

        {/* Main Quiz Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden hover:shadow-3xl transition-all duration-300">
          {/* Question Header */}
          <div className="bg-gradient-to-r from-slate-700 via-gray-800 to-slate-700 p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-blue-600/20"></div>
            <h2 className="text-2xl md:text-3xl font-bold leading-relaxed break-words relative z-10 drop-shadow-sm">
              {q.question}?
            </h2>
          </div>

          {/* Options */}
          <div className="p-8 bg-gradient-to-b from-white to-gray-50">
            <div className="grid gap-5">
              {q.options.map((option, index) => (
                <label 
                  key={index} 
                  className={`
                    relative flex items-center p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 group hover:shadow-xl
                    ${selected === option 
                      ? 'border-indigo-400 bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50 shadow-xl transform scale-[1.02] ring-2 ring-indigo-300/50' 
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 hover:shadow-lg'
                    }
                  `}
                >
                  {/* Option Letter */}
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl mr-6 flex-shrink-0 transition-all duration-300 shadow-md
                    ${selected === option 
                      ? 'bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 text-white transform rotate-2' 
                      : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200 group-hover:text-gray-700'
                    }
                  `}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  
                  {/* Radio Button */}
                  <input
                    type="radio"
                    name="option"
                    value={option}
                    checked={selected === option}
                    onChange={() => setSelected(option)}
                    className="sr-only"
                  />
                  
                  {/* Option Text */}
                  <span className={`text-base md:text-lg font-medium flex-grow break-words transition-colors duration-300 ${
                    selected === option ? 'text-indigo-900 font-semibold' : 'text-gray-800 group-hover:text-gray-900'
                  }`}>
                    {option}
                  </span>
                  
                  {/* Selection Indicator */}
                  {selected === option && (
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center ml-6 shadow-lg animate-pulse">
                      <div className="w-3 h-3 bg-white rounded-full shadow-sm"></div>
                    </div>
                  )}
                </label>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-6 mt-10">
              <button 
                onClick={handleClear} 
                className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-2xl border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  Clear Selection
                </span>
              </button>
              
              <button 
                onClick={handleNext} 
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-bold rounded-2xl hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 transform hover:scale-[1.05] transition-all duration-300 shadow-xl hover:shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <span className="flex items-center justify-center gap-3 relative z-10">
                  {current === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse shadow-sm"></div>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Timer Warning */}
        {timeLeft <= 10 && (
          <div className="mt-6 bg-gradient-to-r from-red-100 via-rose-100 to-pink-100 border border-red-300 rounded-2xl p-6 shadow-lg animate-pulse">
            <div className="flex items-center justify-center gap-4">
              <div className="relative">
                <div className="w-6 h-6 bg-red-400 rounded-full animate-ping absolute"></div>
                <div className="w-6 h-6 bg-red-500 rounded-full"></div>
              </div>
              <span className="text-red-700 font-bold text-lg">
                ⚠️ Time is running out! Only {timeLeft} seconds left.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
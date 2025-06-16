import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';

export default function Quiz() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answerList, setAnswerList] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
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

  const handleNext = () => {
    const q = questions[current];
    if (selected === null) {
      const newAnswerList = [...answerList, {
        ...q,
        selected,
        isCorrect: false,
      }];
      setAnswerList(newAnswerList);
      handleUpdate(score, newAnswerList);
    }
    else {
      const correct = selected === q.correct;
      const delta = correct ? 1 : -0.5;
      const newScore = score + delta;
      const newAnswerList = [...answerList, {
        ...q,
        selected,
        isCorrect: correct,
      }];
      setScore(newScore);
      setAnswerList(newAnswerList);
      handleUpdate(newScore, newAnswerList);
    }
  };

  const handleClear = () => {
    setSelected(null);
  };

  const handleUpdate = (newScore, newAnswerList) => {
    setSelected(null);
    setTimeLeft(45);
    if (current === questions.length - 1) {
      finishQuiz(newScore, newAnswerList);
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
    if (timeLeft > 30) return 'text-green-600';
    if (timeLeft > 15) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTimerBgColor = () => {
    if (timeLeft > 30) return 'from-green-500 to-emerald-500';
    if (timeLeft > 15) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-rose-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        {/* Header Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-4 mb-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Progress</span>
              <span className="text-sm font-medium text-gray-600">
                {current + 1} of {questions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Header Info */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Question {current + 1}/{questions.length}
              </div>
            </div>
            
            {/* Timer */}
            <div className="flex items-center gap-4">
              <div className={`${getTimerColor()} font-bold text-xl flex items-center gap-2`}>
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getTimerBgColor()} ${timeLeft <= 10 ? 'animate-pulse' : ''}`}></div>
                {timeLeft}s
              </div>
              
              <button 
                onClick={goHome} 
                className="text-gray-500 hover:text-gray-700 underline text-sm font-medium transition-colors"
              >
                Home
              </button>
            </div>
          </div>
        </div>

        {/* Main Quiz Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          {/* Question Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white">
            <h2 className="text-xl md:text-2xl font-bold leading-relaxed break-words">
              {q.question}?
            </h2>
          </div>

          {/* Options */}
          <div className="p-6">
            <div className="grid gap-4">
              {q.options.map((option, index) => (
                <label 
                  key={index} 
                  className={`
                    relative flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md
                    ${selected === option 
                      ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg transform scale-[1.02]' 
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  {/* Option Letter */}
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mr-4 flex-shrink-0
                    ${selected === option 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' 
                      : 'bg-gray-100 text-gray-600'
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
                  <span className={`text-sm md:text-base font-medium flex-grow break-words ${
                    selected === option ? 'text-indigo-900' : 'text-gray-800'
                  }`}>
                    {option}
                  </span>
                  
                  {/* Selection Indicator */}
                  {selected === option && (
                    <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center ml-4">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </label>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <button 
                onClick={handleClear} 
                className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-2xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transform hover:scale-[1.02] transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Clear Selection
              </button>
              
              <button 
                onClick={handleNext} 
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-2xl hover:from-green-600 hover:to-emerald-600 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center gap-2">
                  {current === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Timer Warning */}
        {timeLeft <= 10 && (
          <div className="mt-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl p-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
              <span className="text-red-700 font-semibold">
                Time is running out! Only {timeLeft} seconds left.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
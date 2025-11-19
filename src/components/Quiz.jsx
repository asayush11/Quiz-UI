import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import { getAnswers, ensureAnswersLength, setAnswer, clearAnswer, setCurrent, getCurrent, getQuestions, ensureMarkedLength, toggleMarked, getMarked } from '../utils/sessionHelpers';
import QuestionPalette from './QuestionPalette';

export default function Quiz() {
  const navigate = useNavigate();
  // read persisted current index and keep a reactive local copy
  const { finishQuiz } = useOutletContext();
  const questions = getQuestions();
  const persistedCurrent = getCurrent();
  const [current, setCurrentIndex] = useState(persistedCurrent);

  // selected option for UI highlight
  const [selected, setSelected] = useState(() => {
    const answers = getAnswers();
    return answers[persistedCurrent] ?? null;
  });

  // current location (avoid calling hooks in nested functions)
  const location = useLocation();

  const [paletteOpen, setPaletteOpen] = useState(false);
  const [isMarked, setIsMarked] = useState(false);

  // overall quiz timer (in seconds).
  const storedTotalExplicit = parseInt(sessionStorage.getItem('totalTime') || 1200);
  const initialTotalTime = (() => {
    if (!isNaN(storedTotalExplicit)) {
      // user provided a totalTime explicitly
      sessionStorage.setItem('initialTotalTime', String(storedTotalExplicit));
      return storedTotalExplicit;
    }
  })();

  const [timeLeft, setTimeLeft] = useState(() => {
    // resume from previously stored remaining total if present
    const storedTotalLeft = parseInt(sessionStorage.getItem('totalTimeLeft'));
    if (!isNaN(storedTotalLeft)) return storedTotalLeft;
    // otherwise start from initialTotalTime
    return initialTotalTime;
  });

  // Start a single overall countdown when component mounts
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Save remaining time as 0 and finish quiz
          sessionStorage.setItem('totalTimeLeft', '0');
          finishQuiz();
          return 0;
        }
        const next = prev - 1;
        sessionStorage.setItem('totalTimeLeft', String(next));
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
    // run once on mount
  }, []);

  // Load previously stored answer for the current question when `current` changes
  useEffect(() => {
    // ensure answers array matches questions length and load the stored selection
    ensureAnswersLength(questions.length || 0);
    const answers = getAnswers();
    const stored = answers[current];
    // only update local UI state here; avoid writing back to sessionStorage to prevent loops
    setSelected(stored !== undefined ? stored : null);
    // update marked state for current
    const marked = getMarked();
    setIsMarked(!!marked[current]);
  }, [current, questions.length]);

  const handleRefresh = () => {
    if (location.pathname === '/Sample/quiz') {
      window.location.href = '/Sample/result';
    } else {
      window.location.href = '/user/quizHome/result';
    }
  };

  const handleNext = () => {
    if (current === questions.length - 1) {
      finishQuiz();
    } else {
      const next = current + 1;
      setCurrent(next);
      setCurrentIndex(next);
    }
  };

  const handleBack = () => {
    const prev = Math.max(0, current - 1);
    setCurrent(prev);
    setCurrentIndex(prev);
  }

  const handleJump = (index) => {
    ensureMarkedLength(questions.length || 0);
    ensureAnswersLength(questions.length || 0);
    setCurrent(index);
    setCurrentIndex(index);
    const answers = getAnswers();
    setSelected(answers[index] ?? null);
    setPaletteOpen(false);
  }

  const handleClear = () => {
    clearAnswer(current);
    setSelected(null);
  };

  const goHome = () => {
    if (sessionStorage.getItem('token') === null) {
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
    if (timeLeft * 3 > 2 * initialTotalTime) return 'text-emerald-700';
    if (timeLeft * 3 > initialTotalTime) return 'text-amber-700';
    return 'text-red-600';
  };

  const getTimerBgColor = () => {
    if (timeLeft * 3 > 2 * initialTotalTime) return 'from-emerald-400 via-teal-400 to-cyan-400';
    if (timeLeft * 3 > initialTotalTime) return 'from-amber-400 via-orange-400 to-yellow-400';
    return 'from-red-400 via-rose-400 to-pink-400';
  };

  const getTimerRing = () => {
    if (timeLeft * 3 > 2 * initialTotalTime) return 'ring-emerald-200 bg-emerald-50';
    if (timeLeft * 3 > initialTotalTime) return 'ring-amber-200 bg-amber-50';
    return 'ring-red-200 bg-red-50';
  };

  // Format seconds as MM:SS
  const formatTime = (s) => {
    const sec = Math.max(0, Number(s) || 0);
    const mm = Math.floor(sec / 60).toString().padStart(2, '0');
    const ss = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  if (questions.length === 0) {
    handleRefresh();
    return null;
  }

  else return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-4 relative">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-500"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row gap-6 items-start">
        {/* Left timer panel (sticky on larger screens) */}
        <aside className="w-full md:w-60 flex-shrink-0">
          <div className={`sticky top-6 bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 p-4 flex flex-col items-center gap-3 ${getTimerRing()}`}>
            <div className={`text-3xl font-extrabold ${getTimerColor()} tabular-nums`}>{formatTime(timeLeft)}</div>
            <div className="text-sm md:text-base font-semibold text-gray-700">Time Left</div>
            <div className="w-full mt-3">
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-3 bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-600 transition-all duration-700"
                  style={{ width: `${Math.max(0, Math.min(100, initialTotalTime ? (timeLeft / initialTotalTime) * 100 : 0))}%` }}
                />
              </div>
            </div>
            <button
              onClick={goHome}
              className="mt-3 px-3 py-2 bg-white text-gray-700 font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 text-sm"
            >
              Home
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          {/* Header Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 p-4 mb-4 hover:bg-white/90 hover:shadow-2xl transition-all duration-300">
            {/* Progress Bar */}
            <div className="mb-4">
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
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-4 py-2 rounded-2xl text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  Question {current + 1}/{questions.length}
                </span>
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
                      onChange={() => { setAnswer(current, option); setSelected(option); }}
                      className="sr-only"
                    />

                    {/* Option Text */}
                    <span className={`text-base md:text-lg font-medium flex-grow break-words transition-colors duration-300 ${selected === option ? 'text-indigo-900 font-semibold' : 'text-gray-800 group-hover:text-gray-900'
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
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10 items-center">
                <button
                  onClick={handleBack}
                  disabled={current === 0}
                  className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-2xl border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transform hover:scale-[1.02] transition-all duration-200 shadow-sm"
                >
                  Back
                </button>

                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-2xl border-2 border-indigo-200 hover:bg-indigo-50 transition-all duration-200 shadow-sm"
                >
                  {current === questions.length - 1 ? 'Finish' : 'Next'}
                </button>

                <button
                  onClick={() => setPaletteOpen(true)}
                  className="px-6 py-3 bg-white text-gray-700 border rounded-2xl hover:shadow-md transition-all duration-200"
                >
                  Open Palette
                </button>

                <button
                  onClick={handleClear}
                  className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-2xl border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 shadow-sm"
                >
                  Clear
                </button>

                <button
                  onClick={() => { toggleMarked(current); setIsMarked((m) => !m); }}
                  className={`px-6 py-3 ${isMarked ? 'bg-red-500 text-white' : 'bg-white text-gray-700'} rounded-2xl border hover:shadow-md transition-all duration-200`}
                >
                  {isMarked ? 'Unmark' : 'Mark for Review'}
                </button>
              </div>
            </div>
          </div>

          {/* Timer Warning */}
          {timeLeft <= 10 && (
            <div className="mt-6 bg-gradient-to-r from-red-100 via-rose-100 to-pink-100 border border-red-300 rounded-2xl p-4 shadow-lg animate-pulse">
              <div className="flex items-center justify-center gap-4">
                <div className="relative">
                  <div className="w-5 h-5 bg-red-400 rounded-full animate-ping absolute"></div>
                  <div className="w-5 h-5 bg-red-500 rounded-full"></div>
                </div>
                <span className="text-red-700 font-bold text-base">
                  ⚠️ Time is running out! Only {formatTime(timeLeft)} left.
                </span>
              </div>
            </div>
          )}
          {paletteOpen && (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
              <QuestionPalette count={questions.length} current={current} onJump={handleJump} onClose={() => setPaletteOpen(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
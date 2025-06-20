import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';

export default function Result() {
  const navigate = useNavigate();
  //const { score, answers } = useOutletContext();
  const score = parseFloat(sessionStorage.getItem('score')) || 0;
  const answers = JSON.parse(sessionStorage.getItem('answers')) || [];

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

  // PDF Download Function
  const downloadPDF = () => {
    const printContent = document.getElementById('results-content');
    const originalDisplay = printContent.style.display;
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Quiz Results</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; }
            .score-section { text-align: center; margin-bottom: 30px; }
            .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
            .stat-card { border: 1px solid #e5e7eb; padding: 15px; text-align: center; border-radius: 8px; }
            .question-item { margin-bottom: 25px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
            .question-header { padding: 15px; background-color: #f9fafb; border-bottom: 1px solid #e5e7eb; }
            .question-content { padding: 20px; }
            .answer-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0; }
            .answer-box { padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; }
            .correct-answer { background-color: #f0fdf4; border-color: #bbf7d0; }
            .user-answer { background-color: #f9fafb; }
            .explanation { background-color: #eff6ff; padding: 15px; border-radius: 8px; margin-top: 15px; }
            .correct { border-color: #22c55e; }
            .incorrect { border-color: #ef4444; }
            h1, h2, h3 { color: #1f2937; }
            .performance-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Quiz Results Report (${sessionStorage.getItem('category')})</h1>
            <div class="performance-badge" style="background-color: #e5e7eb;">${performance.level}</div>
          </div>
          
          <div class="score-section">
            <h2>Final Score: ${score} / ${totalQuestions} (${percentage}%)</h2>
          </div>
          
          <div class="stats-grid">
            
            <div class="stat-card">
              <h3 style="color: #22c55e; margin: 0;">${correctAnswers}</h3>
              <p>Correct Answers</p>
            </div>
            <div class="stat-card">
              <h3 style="color: #ef4444; margin: 0;">${2*correctAnswers - 2*score}</h3>
              <p>Incorrect Answers</p>
            </div>
            <div class="stat-card">
              <h3 style="color: #3b82f6; margin: 0;">${totalQuestions - 3*correctAnswers + 2*score}</h3>
              <p>Unattempted</p>
            </div>            
          </div>
          
          <h2>Detailed Review</h2>
          ${answers.map((ans, idx) => `
            <div class="question-item ${ans.isCorrect ? 'correct' : 'incorrect'}">
              <div class="question-header">
                <strong>Question ${idx + 1}: ${ans.isCorrect ? '✓' : '✗'}</strong>
              </div>
              <div class="question-content">
                <p><strong>${ans.question}</strong></p>
                <div class="answer-grid">
                  <div class="answer-box correct-answer">
                    <strong>Correct Answer:</strong><br>
                    ${ans.correct}
                  </div>
                  <div class="answer-box user-answer">
                    <strong>Your Answer:</strong><br>
                    ${ans.selected || 'No answer selected'}
                  </div>
                </div>
                <div class="explanation">
                  <strong>Explanation:</strong><br>
                  ${ans.solution || 'No explanation available for this question.'}
                </div>
              </div>
            </div>
          `).join('')}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Title */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">Q</span>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-800">Quiz Results</span>
              </div>
            </div>
            
            {/* Navigation Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={downloadPDF}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </button>
              
              <button
                onClick={goHome}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-96 h-96 bg-gradient-to-br from-blue-200/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-96 h-96 bg-gradient-to-tl from-indigo-200/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-200/20 rounded-full blur-xl animate-bounce delay-500"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-indigo-200/20 rounded-full blur-xl animate-bounce delay-700"></div>
      </div>

      {/* Main Content */}
      <div id="results-content" className="relative z-10">
        {/* Hero Section with Score */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center space-y-8">
            {/* Performance Header */}
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
                Quiz Complete!
              </h2>
              
            </div>

            {/* Score Display */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 max-w-2xl mx-auto">
              <div className="text-center space-y-4">
                
                <div className="flex items-center justify-center space-x-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-800 mb-2">{sessionStorage.getItem('category')}</div>
                  </div>
                  
                  <div className="w-px h-16 bg-gray-300"></div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-800 mb-2">{score}</div>
                    <div className="text-sm text-gray-500 uppercase tracking-wide font-medium">Score</div>
                  </div>
                  
                  <div className="w-px h-16 bg-gray-300"></div>
                  
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-600 mb-2">{totalQuestions}</div>
                    <div className="text-sm text-gray-500 uppercase tracking-wide font-medium">Total</div>
                  </div>
                  
                  <div className="w-px h-16 bg-gray-300"></div>
                  
                  <div className="text-center">
                    <div className={`text-4xl font-bold mb-2 bg-gradient-to-r ${performance.color} bg-clip-text text-transparent`}>
                      {percentage}%
                    </div>
                    <div className="text-sm text-gray-500 uppercase tracking-wide font-medium">Percentage</div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className={`inline-block px-6 py-2 rounded-lg bg-gradient-to-r ${performance.color} text-white font-semibold`}>
                    {performance.level}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 hover:bg-white/90 transition-all duration-300 group shadow-lg hover:shadow-xl">
                <div className="text-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-2">{correctAnswers}</div>
                  <div className="text-gray-600 font-medium">Correct Answers</div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 hover:bg-white/90 transition-all duration-300 group shadow-lg hover:shadow-xl">
                <div className="text-center">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-red-500 mb-2">{2*correctAnswers - 2*score}</div>
                  <div className="text-gray-600 font-medium">Incorrect Answers</div>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 hover:bg-white/90 transition-all duration-300 group shadow-lg hover:shadow-xl">
                <div className="text-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 00-2 2L13 15l-1 1v-4a2 2 0 00-2-2 2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mb-2">{totalQuestions - 3*correctAnswers + 2*score}</div>
                  <div className="text-gray-600 font-medium">Unattempted</div>
                </div>
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

            <div className="h-200 overflow-y-auto space-y-4">
              {answers.map((ans, idx) => (
                <div key={idx} className={`rounded-3xl border-2 overflow-hidden bg-white/80 backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] shadow-lg mx-auto ${
                  ans.isCorrect
                    ? 'border-green-200 hover:shadow-green-100'
                    : 'border-red-200 hover:shadow-red-100'
                }`}>
                  {/* Question Header */}
                  <div className={`p-4 border-b border-gray-100 ${
                    ans.isCorrect
                      ? 'bg-green-50'
                      : 'bg-red-50'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-8 rounded-full flex items-center justify-center font-bold text-white text-xl shadow-md ${
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
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'https://question-service-82ea.onrender.com/questions';

export default function Question({ loggedIn }) {
  const navigate = useNavigate();
  const [disableSubmit, setDisableSubmit] = useState(false);

  const handleHome = () => {
    navigate('/');
  };

  const [question, setQuestion] = useState({ category: "", question: "", option1: "", option2: "", option3: "", option4: "", difficulty: "", solution: "" });

  const handleSubmit = async (e) => {
    setDisableSubmit(true);
    e.preventDefault();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      toast.error('Thank you for your contribution! Your question will be reviewed shortly.');
      setDisableSubmit(false);
      return;
    }, 5000);
    try {
      const response = await fetch(`${BASE_URL}/create`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ category: question.category, question: question.question, option1: question.option1, option2: question.option2, option3: question.option3, option4: question.option4, difficulty: question.difficulty, solution: question.solution })
      });
      clearTimeout(timeoutId);
      const data = await response.json();
      setDisableSubmit(false);
      if (response.status === 400) {
        toast.error(data.message);
        return;
      }
      if (response.status === 500) {
        toast.error(data.error);
        return;
      }
      if (response.status === 201) {
        toast.success(data.message);
        setQuestion({ category: "", question: "", option1: "", option2: "", option3: "", option4: "", difficulty: "", solution: "" });
        return;
      }
    } catch (err) {
      console.log('Network error. Please try again later.');
      setDisableSubmit(false);
    }
  };

  const onChange = (e) => {
    setQuestion({ ...question, [e.target.name]: e.target.value })
  }

  if (!loggedIn) {
    navigate('/login');
    return null; // Prevent rendering if not logged in
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-800">Question Creator</h1>
          </div>
          <button
            onClick={handleHome}
            className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-xl font-medium border border-gray-200 transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-white">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Create New Question</h2>
              <p className="text-blue-100">Please fill in all the required fields to add a new question</p>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <form className="space-y-8" onSubmit={handleSubmit}>
              {/* Topic Selection */}
              <div className="space-y-3">
                <label htmlFor="category" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Topic *
                </label>
                <select
                  id="category"
                  name="category"
                  value={question.category}
                  onChange={onChange}
                  required
                  className="w-full max-w-md border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50/50 text-gray-800"
                >
                  <option value="">Select Topic</option>
                  <option value="Maths">📊 Maths</option>
                  <option value="History">📚 History</option>
                  <option value="English">📝 English</option>
                  <option value="General Awareness">🌍 General Awareness</option>
                  <option value="Computer Science">💻 Computer Science</option>
                </select>
              </div>

              {/* Question */}
              <div className="space-y-3">
                <label htmlFor="question" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Question *
                </label>
                <textarea
                  id="question"
                  name="question"
                  value={question.question}
                  onChange={onChange}
                  required
                  rows="4"
                  className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50/50 text-gray-800 resize-vertical"
                  placeholder="Enter your question here..."
                />
              </div>

              {/* Options Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Correct Answer */}
                <div className="space-y-3">
                  <label htmlFor="option1" className="flex items-center text-sm font-semibold text-green-700 mb-2">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Correct Answer *
                  </label>
                  <input
                    id="option1"
                    name="option1"
                    value={question.option1}
                    onChange={onChange}
                    required
                    className="w-full border border-green-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 bg-green-50/30 text-gray-800"
                    placeholder="Enter the correct answer"
                  />
                </div>

                {/* Incorrect Option 1 */}
                <div className="space-y-3">
                  <label htmlFor="option2" className="flex items-center text-sm font-semibold text-red-700 mb-2">
                    <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Incorrect Option 1 *
                  </label>
                  <input
                    id="option2"
                    name="option2"
                    value={question.option2}
                    onChange={onChange}
                    required
                    className="w-full border border-red-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200 bg-red-50/30 text-gray-800"
                    placeholder="Enter first incorrect option"
                  />
                </div>

                {/* Incorrect Option 2 */}
                <div className="space-y-3">
                  <label htmlFor="option3" className="flex items-center text-sm font-semibold text-red-700 mb-2">
                    <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Incorrect Option 2 *
                  </label>
                  <input
                    id="option3"
                    name="option3"
                    value={question.option3}
                    onChange={onChange}
                    required
                    className="w-full border border-red-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200 bg-red-50/30 text-gray-800"
                    placeholder="Enter second incorrect option"
                  />
                </div>

                {/* Incorrect Option 3 */}
                <div className="space-y-3">
                  <label htmlFor="option4" className="flex items-center text-sm font-semibold text-red-700 mb-2">
                    <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Incorrect Option 3 *
                  </label>
                  <input
                    id="option4"
                    name="option4"
                    value={question.option4}
                    onChange={onChange}
                    required
                    className="w-full border border-red-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200 bg-red-50/30 text-gray-800"
                    placeholder="Enter third incorrect option"
                  />
                </div>
              </div>

              {/* Difficulty */}
              <div className="space-y-3">
                <label htmlFor="difficulty" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Difficulty Level *
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={question.difficulty}
                  onChange={onChange}
                  required
                  className="w-full max-w-md border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50/50 text-gray-800"
                >
                  <option value="">Select Difficulty</option>
                  <option value="EASY">🟢 Easy</option>
                  <option value="MEDIUM">🟡 Medium</option>
                  <option value="HARD">🔴 Hard</option>
                </select>
              </div>

              {/* Explanation */}
              <div className="space-y-3">
                <label htmlFor="solution" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Explanation (Optional)
                </label>
                <textarea
                  id="solution"
                  name="solution"
                  value={question.solution}
                  onChange={onChange}
                  rows="4"
                  className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50/50 text-gray-800 resize-vertical"
                  placeholder="Optional: Provide an explanation for the answer"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-100">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={
                    disableSubmit ||
                    question.category.length < 1 ||
                    question.question.length <= 0 ||
                    question.option1.length < 1 ||
                    question.option2.length < 1 ||
                    question.option3.length < 1 ||
                    question.option4.length < 1 ||
                    question.difficulty.length < 1
                  }
                  className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white py-4 px-8 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Submit Question
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'https://question-service-82ea.onrender.com/questions';

export default function Question({ loggedIn }) {
  const navigate = useNavigate();

  const handleHome = () => {
    navigate('/');
  };

  const [question, setQuestion] = useState({ category: "", question: "", option1: "", option2: "", option3: "", option4: "", difficulty: "", solution: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      alert('Oops, server is booting up...Please try after 60 seconds.');
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
      if (response.status === 400) {
        alert(data.message);
        return;
      }
      if (response.status === 500) {
        alert(data.error);
        return;
      }
      if (response.status === 201) {
        alert(data.message);
        setQuestion({ category: "", question: "", option1: "", option2: "", option3: "", option4: "", difficulty: "", solution: "" });
        return;
      }
    } catch (err) {
      console.log(err.message);
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
    <div>
      <div className="text-right p-6">
        <button
          onClick={handleHome}
          className="bg-gray-300 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-400 font-medium"
        >
          Home
        </button>
      </div>
      <div className="min-h-screen bg-gray-100 text-center p-6">
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md mt-8">

          <h2 className="text-2xl font-bold mb-6">Please enter all the required fields</h2>

          <form className="space-y-8 mt-6 max-w-2xl">
            <div className="space-y-2">
              <label htmlFor="category" className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                Topic
              </label>
              <select
                id="category"
                name="category"
                value={question.category}
                onChange={onChange}
                required
                className="w-full max-w-xs border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Topic</option>
                <option value="Maths">Maths</option>
                <option value="History">History</option>
                <option value="English">English</option>
                <option value="General Awareness">General Awareness</option>
                <option value="Computer Science">Computer Science</option>
              </select>
            </div>
            <br></br>
            <div className="space-y-2">
              <label htmlFor="question" className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                Question
              </label>
              <textarea
                id="question"
                name="question"
                value={question.question}
                onChange={onChange}
                required
                rows="3"
                className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                placeholder="Enter your question here..."
              />
            </div>
            <br></br>
            <div className="space-y-2">
              <label htmlFor="option1" className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                Correct Answer
              </label>
              <input
                id="option1"
                name="option1"
                value={question.option1}
                onChange={onChange}
                required
                className="w-full max-w-lg border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter the correct answer"
              />
            </div>
            <br></br>
            <div className="space-y-2">
              <label htmlFor="option2" className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                Incorrect Option 1
              </label>
              <input
                id="option2"
                name="option2"
                value={question.option2}
                onChange={onChange}
                required
                className="w-full max-w-lg border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter first incorrect option"
              />
            </div>
            <br></br>
            <div className="space-y-2">
              <label htmlFor="option3" className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                Incorrect Option 2
              </label>
              <input
                id="option3"
                name="option3"
                value={question.option3}
                onChange={onChange}
                required
                className="w-full max-w-lg border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter second incorrect option"
              />
            </div>
            <br></br>
            <div className="space-y-2">
              <label htmlFor="option4" className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                Incorrect Option 3
              </label>
              <input
                id="option4"
                name="option4"
                value={question.option4}
                onChange={onChange}
                required
                className="w-full max-w-lg border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter third incorrect option"
              />
            </div>
            <br></br>
            <div className="space-y-2">
              <label htmlFor="difficulty" className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                Difficulty
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={question.difficulty}
                onChange={onChange}
                required
                className="w-full max-w-xs border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Difficulty</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
            <br></br>
            <div className="space-y-2">
              <label htmlFor="solution" className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
                Explanation
              </label>
              <textarea
                id="solution"
                name="solution"
                value={question.solution}
                onChange={onChange}
                rows="3"
                className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                placeholder="Optional: Provide an explanation for the answer"
              />
            </div>
            <br></br>
            <div className="flex gap-6 pt-8">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={
                  question.category.length < 1 ||
                  question.question.length <= 0 ||
                  question.option1.length < 1 ||
                  question.option2.length < 1 ||
                  question.option3.length < 1 ||
                  question.option4.length < 1 ||
                  question.difficulty.length < 1
                }
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed font-medium"
              >
                Submit Question
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Instructions({ startQuiz, numQuestions }) {
  const navigate = useNavigate();
  
  const goHome = () => {
        navigate('/');
    };
  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-4xl font-bold mb-6">Instructions</h2>
      <p className="mb-4">You will be asked {numQuestions} questions.</p>
      <p className="mb-4">Each question has a 45 second timer and 4 answer choices.</p>
      <p className="mb-4">You get +1 point for a correct answer and -0.5 for an incorrect one.</p>
      <p className="mb-4">Don't Refresh once the quiz starts, you don't need network access after quiz starts</p>
      <p className="mb-4">Clicking Next will take you to next question.</p>
      <p className="mb-4">Clear will clear the selected option</p>
      <p className="mb-4">You cannot come back to any question once you move ahead</p>
      <button onClick={startQuiz} className="mt-6 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">Start</button>
      <button onClick={goHome} className="mt-6 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">Home</button>
    </div>
  );
}
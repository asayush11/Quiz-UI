import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Result({ score, answers }) {
  const navigate = useNavigate();
  
  const goHome = () => {
        navigate('/');
    };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-3xl font-bold mb-6">You scored {score} out of {answers.length}</h2>
      <ul className="text-left">
        {answers.map((ans, idx) => (
          <li key={idx} className="mb-2">
            Q{idx + 1}: {ans.question} = {ans.correct}<br />
            Your answer: <span className={ans.isCorrect ? 'text-green-600' : 'text-red-600'}>{ans.selected}</span><br />
            Explanation: {ans.solution ? ans.solution : 'Trivia: No solution available.'}
          </li>
        ))}
      </ul>
      <button onClick={goHome} className="mt-6 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">Home</button>
    </div>
  );
}
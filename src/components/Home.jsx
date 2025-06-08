import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {

  const navigate = useNavigate();

  const handleQuestion = () => {
    navigate('/login');
  };

  const handleQuiz = () => {
    navigate('/QuizHome');
  };

  return (
    <div className="min-h-screen bg-gray-100 text-center p-6">
    <div className="max-w-xl mx-auto bg-white p-8 rounded shadow">
      <h1 className="text-4xl font-bold mb-6">Quiz</h1>
      <p className="mb-4">Hi, Welcome to our Quiz application.</p>
      <button onClick={handleQuiz}>Take Quiz</button>
      <br></br>
      <br></br>
      <button onClick={handleQuestion} className="space-y-4">Contribute a Question</button>
    </div>
    </div>
  );
}
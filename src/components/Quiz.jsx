import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Quiz({ questions, finishQuiz }) {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answerList, setAnswerList] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);

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
    navigate('/');
  };

  const q = questions[current];

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded shadow">
      <div className="flex justify-between mb-4">
        <span>Question {current + 1}/{questions.length}</span>
        <span>Time left: {timeLeft}s</span>
        <span><button onClick={goHome} className="mt-4 text-blue-700 underline">Home</button></span>
      </div>
      <h2 className="text-2xl mb-4">{q.question} ?</h2>
      <div className="flex flex-col space-y-4 mt-6">
        {q.options.map((option, index) => (
          <label key={index} className="flex items-center space-x-2">
            <input
              type="radio"
              name="option"
              value={option}
              checked={selected === option}
              onChange={() => setSelected(option)}
              className="form-radio text-blue-600"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
      <div className="flex justify-center space-x-4 mt-8">
        <button onClick={handleClear} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Clear</button>
        <button onClick={handleNext} className="bg-green-600 space-x-4 text-white px-4 py-2 rounded hover:bg-green-700">Next</button>
      </div>
    </div>
  );
}
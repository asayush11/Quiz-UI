import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export default function MathsQuiz() {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  const operations = ['+', '-', '*', '/'];

  const generateQuestions = () => {
    const generated = [];
    for (let i = 0; i < 20; i++) {
      const num1 = Math.floor(Math.random() * 100) + 1;
      const num2 = Math.floor(Math.random() * 99) + 1;
      const op1 = operations[Math.floor(Math.random() * operations.length)];

      let correct = 0;
      switch (op1) {
        case '+': correct = num1 + num2; break;
        case '-': correct = num1 - num2; break;
        case '*': correct = num1 * num2; break;
        case '/': correct = parseFloat((num1 / num2).toFixed(2)); break;
      }

      const options = [correct];
      while (options.length < 4) {
        const wrong = correct + (Math.random() * 20 - 10);
        const rounded = parseFloat(wrong.toFixed(2));
        if (!options.includes(rounded)) options.push(rounded);
      }

      const question = `${num1} ${op1} ${num2}`;
      generated.push({
        question,
        difficulty: 'EASY',
        solution: 'Use Mathematical operation',
        correct,
        options: shuffle(options)
      });
    }
    return generated;
  };

  const shuffle = (array) => array.sort(() => 0.5 - Math.random());

  const startQuiz = () => {
    setAnswers([]);
    setScore(0);
    navigate('quiz');
  };

  const finishQuiz = (finalScore, answerList) => {
    setScore(finalScore);
    setAnswers(answerList);
    navigate('result');
  };

  useEffect(() => {
    if (questions.length === 0) {
      const data = generateQuestions();
      setQuestions(data);
      navigate('instructions');
    }
  }, [questions, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Outlet context={{ questions, answers, score, startQuiz, finishQuiz }} />
    </div>
  );
}
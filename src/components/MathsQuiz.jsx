import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { getQuestions, setQuestions, initAnswers, setTotalTime, setCategory, setCurrent, getAnswers, setCorrectAnswers, initMarked } from '../utils/sessionHelpers';

export default function MathsQuiz() {
  const navigate = useNavigate();
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
    navigate('quiz');
  };

  const finishQuiz = () => {
    navigate('result');
  };

  useEffect(() => {
    const storedAnswers = getAnswers();
    const questions = getQuestions();
    if ((storedAnswers === null || storedAnswers.length === 0) && questions.length === 0) {
      setCategory('Mental Maths');
      const generated = generateQuestions();
      setQuestions(generated);
      // initialize answers array with nulls
      initAnswers(generated.length);
  // initialize marked-for-review array
  initMarked(generated.length);
      // persist totalTime if available elsewhere (keep previous behavior)
      setTotalTime(1200);
      setCurrent(0);
      setCorrectAnswers();
      navigate('instructions');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Outlet context={{ startQuiz, finishQuiz }} />
    </div>
  );
}
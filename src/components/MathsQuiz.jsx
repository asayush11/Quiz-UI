import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Instructions from './Instructions';
import Quiz from './Quiz';
import Result from './Result';
import toast from 'react-hot-toast';


export default function QuizHome() {

    const navigate = useNavigate();
    const [screen, setScreen] = useState('home');
    const [score, setScore] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);

    const generateQuestions = () => {
        const operations = ['+', '-', '*', '/'];
        const generated = [];
        for (let i = 0; i < 20; i++) {
            const num1 = Math.floor(Math.random() * 100) + 1;
            const num2 = Math.floor(Math.random() * 99) + 1;
            const op1 = operations[Math.floor(Math.random() * operations.length)];

            const nums = [num1, num2];

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
            generated.push({ question: question, difficulty: 'EASY', solution: 'Use Mathematical operation', correct, options: shuffle(options) });
        }
        return generated;
    };

    const shuffle = (array) => array.sort(() => 0.5 - Math.random());

    const startQuiz = () => {
        setAnswers([]);
        setScore(0);
        setScreen('quiz');
    }

    const setupQuiz = (data) => {
        setQuestions(generateQuestions());
        setScreen('instructions');
    }
    

    const finishQuiz = (finalScore, answerList) => {
        setScore(finalScore);
        setAnswers(answerList);
        setScreen('result');
    };

    const handleHome = () => {
        navigate('/');
    }


  if(screen === 'home') {
    setupQuiz();
  }

  return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
              {screen === 'instructions' && <Instructions startQuiz={startQuiz} numQuestions={questions.length} />}
              {screen === 'quiz' && <Quiz questions={questions} finishQuiz={finishQuiz} />}
              {screen === 'result' && <Result score={score} answers={answers} />}
          </div>
      );

}
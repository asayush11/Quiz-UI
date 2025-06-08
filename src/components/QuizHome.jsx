import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Instructions from './Instructions';
import Quiz from './Quiz';
import Result from './Result';

const BASE_URL = 'https://question-service-82ea.onrender.com/questions';

export default function QuizHome() {

    const navigate = useNavigate();
    const [screen, setScreen] = useState('instructions');
    const [score, setScore] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [question, setQuestion] = useState({ category: "", numberOfEasy: 0, numberOfMedium: 0, numberOfHard: 0 });

    const onChange = (e) => {
        setQuestion({ ...question, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {

        const easy = parseInt(question.numberOfEasy);
        const medium = parseInt(question.numberOfMedium);
        const hard = parseInt(question.numberOfHard);
        if (isNaN(easy) || isNaN(medium) || isNaN(hard)) {
            alert('Please enter valid numbers for the number of questions');
            return
        }

        if (easy < 0 || medium < 0 || hard < 0) {
            alert('Number of questions cannot be negative');
            return;
        }
        if (question.category.trim() === '') {
            alert('Please select a topic');
            return;
        }
        if (easy + medium + hard !== 30) {
            alert('Please make sure total number of questions is 30');
            return;
        }
        e.preventDefault();
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort();
            alert('Oops, server is booting up...Please try after 60 seconds.');
            return;
        }, 3000);
        try {
            const response = await fetch(`${BASE_URL}/retrieve?category=${question.category}` + `&numberOfEasy=${easy}` + `&numberOfMedium=${medium}` + `&numberOfDifficult=${hard}`, {
                method: 'GET',
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            });
            clearTimeout(timeoutId);
            const data = await response.json();
            if (response.status === 500) {
                alert(data.error);
                return;
            }
            if (response.status === 200) {
                if (data.data.length === 0) {
                    alert('No questions available for the selected topic and difficulty levels at the moment. Please try again later.');
                }
                else if (data.data.length < 30) {
                    confirm('Not enough questions available for the selected topic and difficulty levels at the momemt. Would you like to continue with the available questions?') ? setupQuiz(data.data) : navigate('/QuizHome');
                }
                else {
                    setupQuiz(data.data);
                }
                return;
            }
        } catch (err) {
            console.log(err.message);
            return;
        }
    }

    const startQuiz = () => {
        setAnswers([]);
        setScore(0);
        setScreen('quiz');
    }

    const setupQuiz = (data) => {
        const generated = [];
        for (let i = 0; i < data.length; i++) {
            let correct = data[i].option1;
            const options = [correct];
            options.push(data[i].option2);
            options.push(data[i].option3);
            options.push(data[i].option4);
            generated.push({ question: data[i].question, difficulty: data[i].difficulty, solution: data[i].solution, correct, options: shuffle(options) });
        }
        setQuestions(generated);
    }

    const shuffle = (array) => array.sort(() => 0.5 - Math.random());

    const finishQuiz = (finalScore, answerList) => {
        setScore(finalScore);
        setAnswers(answerList);
        setScreen('result');
    };

    const handleHome = () => {
        navigate('/');
    }

    if (questions.length === 0) {
        return (
            <div className="min-h-screen bg-gray-100 text-center p-6">
                <div className="max-w-xl mx-auto bg-white p-8 rounded shadow">
                    <h2 className="text-4xl font-bold mb-6">Please specify the topic and number of questions per difficulty level</h2>
                    <h2 className="text-4xl font-bold mb-6">Please make sure total number of questions is 30</h2>
                    <form className="my-6 max-w-lg">
                        <div className="mb-6">
                            <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-700">
                                Topic
                            </label>
                            <select
                                type="text"
                                className="form-control w-80"
                                id="category"
                                name="category"
                                value={question.category}
                                onChange={onChange}
                                required
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
                        <div className="mb-6">
                            <label htmlFor="numberOfEasy" className="block mb-2 text-sm font-medium text-gray-700">
                                Number of Easy Questions
                            </label>
                            <input
                                type="number"
                                className="form-control w-48"
                                id="numberOfEasy"
                                name="numberOfEasy"
                                value={question.numberOfEasy}
                                onChange={onChange}
                                minLength={1}
                                required
                            />
                        </div>
                        <br></br>
                        <div className="mb-6">
                            <label htmlFor="numberOfMedium" className="block mb-2 text-sm font-medium text-gray-700">
                                Number of Medium Questions
                            </label>
                            <input
                                type="number"
                                className="form-control w-48"
                                id="numberOfMedium"
                                name="numberOfMedium"
                                value={question.numberOfMedium}
                                onChange={onChange}
                                minLength={1}
                                required
                            />
                        </div>
                        <br></br>
                        <div className="mb-6">
                            <label htmlFor="numberOfHard" className="block mb-2 text-sm font-medium text-gray-700">
                                Number of Hard Questions
                            </label>
                            <input
                                type="number"
                                className="form-control w-48"
                                id="numberOfHard"
                                name="numberOfHard"
                                value={question.numberOfHard}
                                onChange={onChange}
                                minLength={1}
                                required
                            />
                        </div>
                    </form>
                    <h5 className="text-red-500 mb-4"></h5> 
                    <button
                            onClick={handleSubmit}
                            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                        >
                            Submit
                    </button>
                    <br></br>
                    <br></br>
                        <button
                            onClick={handleHome}
                            className="px-6 py-3 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 font-medium"
                        >
                            Home
                        </button>
                   
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 text-center p-6">
            {screen === 'instructions' && <Instructions startQuiz={startQuiz} numQuestions={questions.length} />}
            {screen === 'quiz' && <Quiz questions={questions} finishQuiz={finishQuiz} />}
            {screen === 'result' && <Result score={score} answers={answers} />}
        </div>
    );
}
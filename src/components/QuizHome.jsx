import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Instructions from './Instructions';
import Quiz from './Quiz';
import Result from './Result';
import toast from 'react-hot-toast';

const BASE_URL = `https://question-service-82ea.onrender.com` + '/questions';

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
            toast.error('Please enter valid numbers for the number of questions');
            return
        }

        if (easy < 0 || medium < 0 || hard < 0) {
            toast.error('Number of questions cannot be negative');
            return;
        }
        if (question.category.trim() === '') {
            toast.error('Please select a topic');
            return;
        }
        if (easy + medium + hard !== 30) {
            toast.error('Please make sure total number of questions is 30');
            return;
        }
        // e.preventDefault();
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort();
            toast.error('Network error. Please try again.');
            return;
        }, 3000);
        try {
            const response = await fetch(`${BASE_URL}/retrieve?category=${question.category}` + `&numberOfEasy=${easy}` + `&numberOfMedium=${medium}` + `&numberOfDifficult=${hard}`, {
                method: 'GET',
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                }
            }).then(async res => {
                const newToken = res.headers.get("X-New-Access-Token");
                if (newToken) {
                    sessionStorage.setItem('token', newToken);
                }
            });
            clearTimeout(timeoutId);
            const data = await response.json();
            if (response.status === 500) {
                toast.error("Server error. Please try again.");
                return;
            }
            if (response.status === 401) {
                toast.error(data.message);
                navigate('/logout');
                return;
            }
            if (response.status === 200) {
                if (data.data.length === 0) {
                    toast.error('We are adding questions....Please stay tuned!');
                }
                else if (data.data.length < 30) {
                    handleInsufficientQuestion(data);
                }
                else {
                    setupQuiz(data.data);
                }
                return;
            }
        } catch (err) {
            console.log('Network error. Please try again later.');
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

    const handleInsufficientQuestion = (data) => {
        toast.custom(
            <div className="bg-white p-6 rounded-lg shadow-xl border max-w-md">
                <div className="flex items-start space-x-3 mb-4">
                    <span className="text-2xl">⚠️</span>
                    <div>
                        <h3 className="font-semibold text-gray-900">Limited Questions Available</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Not enough questions available at the moment.
                            Would you like to continue with the available questions?
                        </p>
                    </div>
                </div>
                <div className="flex space-x-3 justify-end">
                    <button
                        onClick={() => {
                            toast.dismiss();
                            navigate('/QuizHome');
                        }}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    >
                        Go Back
                    </button>
                    <button
                        onClick={() => {
                            toast.dismiss();
                            setupQuiz(data.data);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        Continue Quiz
                    </button>
                </div>
            </div>,
            {
                duration: Infinity,
                position: 'top-center'
            }
        );
    };

    if (!sessionStorage.getItem('token')) {
        return (
            toast.error('Please login to access this page.'),
            navigate('/login')
        );
    }

    if (questions.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
                {/* Header */}
                <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                            </div>
                            <h1 className="text-xl font-bold text-gray-800">Quiz Setup</h1>
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
                        {/* Header */}
                        <div className="bg-gradient-to-r from-purple-500 to-blue-600 p-8 text-white">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-bold mb-2">Customize Your Quiz</h2>
                                <p className="text-purple-100">Configure your quiz settings and question distribution</p>
                            </div>
                        </div>

                        {/* Form Content */}
                        <div className="p-8">
                            {/* Total Questions Alert */}
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <p className="text-blue-800 font-medium">Total Questions Required: 30</p>
                                        <p className="text-blue-600 text-sm">Please ensure the sum of all difficulty levels equals exactly 30 questions</p>
                                    </div>
                                </div>
                            </div>

                            <form className="space-y-8">
                                {/* Topic Selection */}
                                <div className="space-y-3">
                                    <label htmlFor="category" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                        <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                        Select Topic *
                                    </label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={question.category}
                                        onChange={onChange}
                                        required
                                        className="w-full max-w-md border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50/50 text-gray-800"
                                    >
                                        <option value="">Choose a topic</option>
                                        <option value="Maths">📊 Mathematics</option>
                                        <option value="History">📚 History</option>
                                        <option value="English">📝 English</option>
                                        <option value="General Awareness">🌍 General Awareness</option>
                                        <option value="Computer Science">💻 Computer Science</option>
                                    </select>
                                </div>

                                {/* Question Distribution */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        Question Distribution
                                    </h3>

                                    <div className="grid md:grid-cols-3 gap-6">
                                        {/* Easy Questions */}
                                        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                                            <div className="flex items-center mb-3">
                                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                                    <span className="text-white text-sm font-bold">E</span>
                                                </div>
                                                <label htmlFor="numberOfEasy" className="text-sm font-semibold text-green-700">
                                                    Easy Questions
                                                </label>
                                            </div>
                                            <input
                                                type="number"
                                                id="numberOfEasy"
                                                name="numberOfEasy"
                                                value={question.numberOfEasy}
                                                onChange={onChange}
                                                min="0"
                                                required
                                                className="w-full border border-green-200 px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 bg-white text-gray-800 text-center text-lg font-semibold"
                                                placeholder="0"
                                            />
                                        </div>

                                        {/* Medium Questions */}
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                                            <div className="flex items-center mb-3">
                                                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                                                    <span className="text-white text-sm font-bold">M</span>
                                                </div>
                                                <label htmlFor="numberOfMedium" className="text-sm font-semibold text-yellow-700">
                                                    Medium Questions
                                                </label>
                                            </div>
                                            <input
                                                type="number"
                                                id="numberOfMedium"
                                                name="numberOfMedium"
                                                value={question.numberOfMedium}
                                                onChange={onChange}
                                                min="0"
                                                required
                                                className="w-full border border-yellow-200 px-4 py-3 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all duration-200 bg-white text-gray-800 text-center text-lg font-semibold"
                                                placeholder="0"
                                            />
                                        </div>

                                        {/* Hard Questions */}
                                        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                                            <div className="flex items-center mb-3">
                                                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                                                    <span className="text-white text-sm font-bold">H</span>
                                                </div>
                                                <label htmlFor="numberOfHard" className="text-sm font-semibold text-red-700">
                                                    Hard Questions
                                                </label>
                                            </div>
                                            <input
                                                type="number"
                                                id="numberOfHard"
                                                name="numberOfHard"
                                                value={question.numberOfHard}
                                                onChange={onChange}
                                                min="0"
                                                required
                                                className="w-full border border-red-200 px-4 py-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200 bg-white text-gray-800 text-center text-lg font-semibold"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>

                                    {/* Total Counter */}
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-700 font-medium">Total Questions:</span>
                                            <div className={`text-2xl font-bold px-4 py-2 rounded-lg ${(parseInt(question.numberOfEasy) || 0) + (parseInt(question.numberOfMedium) || 0) + (parseInt(question.numberOfHard) || 0) === 30
                                                ? 'text-green-600 bg-green-100'
                                                : 'text-red-600 bg-red-100'
                                                }`}>
                                                {(parseInt(question.numberOfEasy) || 0) + (parseInt(question.numberOfMedium) || 0) + (parseInt(question.numberOfHard) || 0)} / 30
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-6 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white py-4 px-8 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                                    >
                                        <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        Generate Quiz
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {screen === 'instructions' && <Instructions startQuiz={startQuiz} numQuestions={questions.length} />}
            {screen === 'quiz' && <Quiz questions={questions} finishQuiz={finishQuiz} />}
            {screen === 'result' && <Result score={score} answers={answers} />}
        </div>
    );
}
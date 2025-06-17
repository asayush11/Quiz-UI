import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Outlet } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL + '/questions';

export default function QuizHome() {

    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [question, setQuestion] = useState({ category: "", numberOfEasy: 0, numberOfMedium: 0, numberOfHard: 0, timePerQuestion: 0 });

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
        if (easy + medium + hard === 0) {
            toast.error('Please ensure total number of questions is greater than 0');
            return;
        }        
        if (question.timePerQuestion <= 0) {
            toast.error('Please ensure time per question is greater than 0 in seconds');
            return;
        }
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort();
            toast.error('Network error.Please try again.');
            return;
        }, 5000);
        try {
            const response = await fetch(`${BASE_URL}/retrieve?category=${question.category}` + `&numberOfEasy=${easy}` + `&numberOfMedium=${medium}` + `&numberOfDifficult=${hard}`, {
                method: 'GET',
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                }
            });
            clearTimeout(timeoutId);
            const newToken = response.headers.get("X-New-Access-Token");
            if (newToken) {
                sessionStorage.setItem('token', newToken);
            }

            const data = await response.json();
            if (response.status === 500 || response.status === 503) {
                toast.error("Server error. Please try again.");
                return;
            }
            if (response.status === 401) {
                toast.error(data.message);
                navigate('/logout');
                return;
            }
            if (response.status === 400) {
                toast.error(data.message);
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
            console.log(err);
            return;
        }
    }

    const startQuiz = () => {
        sessionStorage.setItem('score', 0);
        sessionStorage.setItem('answers', JSON.stringify([]));
        navigate('quiz');
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
        sessionStorage.setItem('timePerQuestion', question.timePerQuestion);
        navigate('instructions');
    }

    const shuffle = (array) => array.sort(() => 0.5 - Math.random());

    const finishQuiz = () => {
        navigate('result');
    };

    const handleHome = () => {
        navigate('/user');
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

    if (sessionStorage.getItem('token')) {
        return (
            toast.error('Please login to access this page.'),
            window.location.href = '/login'
        );
    }

    if (questions.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
                {/* Main Content - Full Screen */}
                <div className="w-full px-8 pt-8">
                    {/* Hero Section with Home Button */}
                    <div className="text-center mb-16 relative">
                        <button
                            onClick={handleHome}
                            className="absolute top-0 right-0 bg-white/80 hover:bg-white text-gray-700 px-8 py-3 rounded-2xl font-medium border border-purple-200/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                        >
                            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Home
                        </button>
                        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h2 className="text-5xl font-bold text-gray-800 mb-4">Customize Your Quiz</h2>                        
                    </div>

                    {/* Alert Section */}
                    <div className="max-w-4xl mx-auto mb-12">
                        <div className="bg-amber-50/80 backdrop-blur-sm border border-amber-200/50 rounded-2xl p-6">
                            <div className="flex items-start">
                                <svg className="w-6 h-6 text-amber-600 mr-4 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="space-y-2">
                                    <p className="text-amber-800 font-medium text-lg">📝 Please ensure total number of questions is more than 0</p>
                                    <p className="text-amber-800 font-medium text-lg">⏱️ Please ensure time per question is greater than 0 in seconds</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="max-w-6xl mx-auto">
                        <form className="space-y-16">
                            {/* Topic Selection and Time Per Question */}
                            <div className="grid lg:grid-cols-2 gap-8">
                                {/* Topic Selection */}
                                <div className="text-center">
                                    <label htmlFor="category" className="flex items-center justify-center text-2xl font-bold text-gray-700 mb-8">
                                        <svg className="w-6 h-6 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                        className="w-full border-2 border-purple-200 px-6 py-4 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm text-gray-800 text-lg font-medium"
                                    >
                                        <option value="">Choose a topic</option>
                                        <option value="Maths">📊 Mathematics</option>
                                        <option value="History">📚 History</option>
                                        <option value="English">📝 English</option>
                                        <option value="General Awareness">🌍 General Awareness</option>
                                        <option value="Computer Science">💻 Computer Science</option>
                                    </select>
                                </div>

                                {/* Time Per Question */}
                                <div className="text-center">
                                    <label htmlFor="timePerQuestion" className="flex items-center justify-center text-2xl font-bold text-gray-700 mb-8">
                                        <svg className="w-6 h-6 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Time Per Question (Seconds) *
                                    </label>
                                    <input
                                        type="number"
                                        id="timePerQuestion"
                                        name="timePerQuestion"
                                        value={question.timePerQuestion}
                                        onChange={onChange}
                                        min="0"
                                        required
                                        className="w-full border-2 border-purple-200 px-6 py-4 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm text-gray-800 text-center text-lg font-medium"
                                        placeholder="30"
                                    />
                                </div>
                            </div>

                            {/* Question Distribution */}
                            <div className="space-y-12">
                                <h3 className="text-3xl font-bold text-gray-800 text-center flex items-center justify-center">
                                    <svg className="w-7 h-7 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    Question Distribution
                                </h3>

                                <div className="grid lg:grid-cols-3 gap-8">
                                    {/* Easy Questions */}
                                    <div className="bg-green-50/80 backdrop-blur-sm border-2 border-green-200 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                                        <div className="text-center mb-6">
                                            <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                                <span className="text-white text-2xl font-bold">E</span>
                                            </div>
                                            <label htmlFor="numberOfEasy" className="text-xl font-bold text-green-700">
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
                                            className="w-full border-2 border-green-200 px-6 py-4 rounded-2xl focus:ring-4 focus:ring-green-200 focus:border-green-400 outline-none transition-all duration-300 bg-white text-gray-800 text-center text-2xl font-bold"
                                            placeholder="0"
                                        />
                                    </div>

                                    {/* Medium Questions */}
                                    <div className="bg-yellow-50/80 backdrop-blur-sm border-2 border-yellow-200 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                                        <div className="text-center mb-6">
                                            <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                                <span className="text-white text-2xl font-bold">M</span>
                                            </div>
                                            <label htmlFor="numberOfMedium" className="text-xl font-bold text-yellow-700">
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
                                            className="w-full border-2 border-yellow-200 px-6 py-4 rounded-2xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-400 outline-none transition-all duration-300 bg-white text-gray-800 text-center text-2xl font-bold"
                                            placeholder="0"
                                        />
                                    </div>

                                    {/* Hard Questions */}
                                    <div className="bg-red-50/80 backdrop-blur-sm border-2 border-red-200 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                                        <div className="text-center mb-6">
                                            <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                                <span className="text-white text-2xl font-bold">H</span>
                                            </div>
                                            <label htmlFor="numberOfHard" className="text-xl font-bold text-red-700">
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
                                            className="w-full border-2 border-red-200 px-6 py-4 rounded-2xl focus:ring-4 focus:ring-red-200 focus:border-red-400 outline-none transition-all duration-300 bg-white text-gray-800 text-center text-2xl font-bold"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Total Counter and Generate Button */}
                            <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
                                {/* Total Counter */}
                                <div className="bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-3xl p-8 shadow-xl">
                                    <div className="flex items-center gap-6">
                                        <span className="text-gray-700 font-bold text-xl">Total Questions:</span>
                                        <div className={`text-4xl font-bold px-6 py-3 rounded-2xl shadow-lg ${(parseInt(question.numberOfEasy) || 0) + (parseInt(question.numberOfMedium) || 0) + (parseInt(question.numberOfHard) || 0) > 0
                                            ? 'text-green-600 bg-green-100'
                                            : 'text-red-600 bg-red-100'
                                            }`}>
                                            {(parseInt(question.numberOfEasy) || 0) + (parseInt(question.numberOfMedium) || 0) + (parseInt(question.numberOfHard) || 0)}
                                        </div>
                                    </div>
                                </div>

                                {/* Generate Quiz Button */}
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white py-6 px-12 rounded-3xl font-bold text-xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-offset-2"
                                >
                                    <svg className="w-6 h-6 inline mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Generate Quiz
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <Outlet context={{ questions, startQuiz, finishQuiz }} />
        </div>
    );
}
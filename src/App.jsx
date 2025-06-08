import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import QuizHome from './components/QuizHome';
import toast, { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <div>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/quizHome" element={<QuizHome />} />
    </Routes>
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        className: 'bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl',
        style: {
          fontSize: '1rem',
          color: '#333',
        },
      }}
    />
    </div>
  );
}
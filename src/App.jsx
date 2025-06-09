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
        duration: 2000,
        style: {
          background: '#363636',
          color: '#fff',
        },
      }} />
    </div>
  );
}
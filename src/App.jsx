import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import QuizHome from './components/QuizHome';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/quizHome" element={<QuizHome />} />
    </Routes>
  );
}
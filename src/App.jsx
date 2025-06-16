import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Logout from './components/Logout';
import SignUP from './components/SignUP';
import MathsQuiz from './components/MathsQuiz';
import UserHome from './components/UserHome';
import toast, { Toaster } from 'react-hot-toast';
import Quiz from './components/Quiz';
import QuizHome from './components/QuizHome';
import Instructions from './components/Instructions';
import Result from './components/Result';
import Question from './components/Question';
import UserDashboard from './components/UserDashboard';

const RequireAuth = ({ children }) => {
    const isLoggedIn = useAuth();
    if (!isLoggedIn) return <Navigate to="/login" replace />;
    return children;
  };

  const useAuth = () => {
    return sessionStorage.getItem('token') !== null;
  };
  
export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/SignUp" element={<SignUP />} />
        <Route path="/Sample" element={<MathsQuiz />}>
          <Route path="instructions" element={<Instructions />} />
          <Route path="quiz" element={<Quiz />} />
          <Route path="result" element={<Result />} />
        </Route>

        <Route path="/user" element={<RequireAuth><UserHome /></RequireAuth>}>
          <Route index element={<UserDashboard />} />
          <Route path="quizHome" element={<QuizHome />}>
            <Route path="instructions" element={<Instructions />} />
            <Route path="quiz" element={<Quiz />} />
            <Route path="result" element={<Result />} />
          </Route>
          <Route path="question" element={<Question />}/>
        </Route>
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
import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'https://question-service-82ea.onrender.com';

export default function Login() {

  const navigate = useNavigate();
    const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    if(password.trim() === '') {
      alert('Please enter a password');
      return;
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
    controller.abort();
      alert('Oops, server is booting up...Please try after 60 seconds.');          
          return;
    }, 3000);
    try {
      const response = await fetch(`${BASE_URL}/users/login/`+`${password}`, {
        method: 'POST',
        signal: controller.signal, 
      });
      let data = await response.json();
      clearTimeout(timeoutId);
      if (response.status !== 200) {
        alert(data.message);
        console.log(data.error);
        return;         
      }
      navigate('/question');
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleHome = () => {
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-gray-100 text-center p-6">
     <div className="max-w-xl mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-4xl font-bold mb-6">Verifying Contributor</h2>
      <input
        type="text"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <br></br>
      <button onClick={handleSubmit}>Submit</button>
      <h5></h5>
      <button onClick={handleHome}>Home</button>      
    </div>
    </div>
  );
}
import toast from 'react-hot-toast';
import { useState } from 'react';
const BASE_URL = import.meta.env.VITE_BASE_URL + '/users';

export default function Logout() {
  const [loggedOut, setLoggedOut] = useState(false);

  const handleLogout = async () => { 
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
            controller.abort();
            return;
    }, 3000); 
    try {
      const token = sessionStorage.getItem('token');  
      const response = await fetch(`${BASE_URL}/logout` + `?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      clearTimeout(timeoutId);
      logOutFromUI();
    } catch (err) {
        console.error('Logout failed:', err);
        logOutFromUI();        
    }    
    }

    const logOutFromUI = () => {
      setLoggedOut(true);
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      toast.success('You have been logged out successfully.');
      window.location.href = '/';
    }

    if(true) {
      handleLogout();
    }

    // Inline styles
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(16px)',
    borderRadius: '24px',
    padding: '2rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.8)',
    maxWidth: '500px',
    width: '100%',
    textAlign: 'center'
  };

    if (!loggedOut) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #e2e8f0',
              borderTop: '4px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <span style={{ fontSize: '18px', color: '#64748b' }}>Logging out...</span>
          </div>
        </div>
      </div>
    );
  }
}
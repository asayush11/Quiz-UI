import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_BASE_URL + '/users';

export default function Logout() {
  
  const handleLogout = async () => {  
    try {
      const token = sessionStorage.getItem('token');  
      const response = await fetch(`${BASE_URL}/logout` + `?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      sessionStorage.removeItem('token');
      toast.success('You have been logged out successfully.');
      window.location.href = '/';
    } catch (err) {
      console.log('Slow netowrk but you are logged out safely.');
    }    
    }

    if(true) {
      handleLogout();
      return null; // or redirect to home page
    }
}
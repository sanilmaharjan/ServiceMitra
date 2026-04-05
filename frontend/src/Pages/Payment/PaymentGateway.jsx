import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EsewaSuccess() {
  const navigate = useNavigate();
  
  useEffect(() => {
    setTimeout(() => {
      navigate('/user/dashboard');
    }, 3000);
  }, [navigate]);
  
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1 style={{ color: 'green' }}>Payment Successful!</h1>
      <p>Your payment has been completed.</p>
      <p>Redirecting to dashboard...</p>
    </div>
  );
}
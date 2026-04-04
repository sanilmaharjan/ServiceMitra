import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function KhaltiSuccess() {
  const navigate = useNavigate();
  
  useEffect(() => {
    setTimeout(() => {
      navigate('/admin/payments');
    }, 3000);
  }, []);
  
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1 style={{ color: 'green' }}>✅ Khalti Payment Successful!</h1>
      <p>Your payment has been completed.</p>
      <p>Redirecting...</p>
    </div>
  );
}
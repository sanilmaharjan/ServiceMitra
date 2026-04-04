import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function EsewaFailed() {
  const navigate = useNavigate();
  
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1 style={{ color: 'red' }}>❌ Payment Failed</h1>
      <p>Please try again.</p>
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
}
import React from 'react';
import { Link } from 'react-router-dom';

function ThankYou() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1 style={{ color: '#7B68EE' }}>Hooray! Message Sent.</h1>
      <p>Humein aapka message mil gaya hai. Hum jald hi aapse baat karenge.</p>
      <Link to="/" style={{ color: 'blue', textDecoration: 'underline' }}>Back to Home</Link>

      
    </div>
  );
}

export default ThankYou;
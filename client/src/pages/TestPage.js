import React from 'react';

const TestPage = () => {
  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center',
      fontSize: '24px',
      color: '#333'
    }}>
      <h1>React App is Working!</h1>
      <p>If you can see this, the React app is loading properly.</p>
      <p>Time: {new Date().toLocaleString()}</p>
    </div>
  );
};

export default TestPage;

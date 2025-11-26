import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';

function App() {
  const [hasEntered, setHasEntered] = useState(false);

  return (
    <>
      {hasEntered ? (
        <Dashboard />
      ) : (
        <LandingPage onEnter={() => setHasEntered(true)} />
      )}
    </>
  );
}

export default App;
import React, { useState } from 'react';
import LandingScreen from './components/LandingScreen';
import TransactionScreen from './components/TransactionScreen';

function App() {
  const [currentNode, setCurrentNode] = useState(null);
  const [currentMode, setCurrentMode] = useState(null); // 'VOUCHER' | 'REQUESTED'

  const handleStart = (mode, node) => {
    setCurrentNode(node);
    setCurrentMode(mode);
  };

  const handleBack = () => {
    setCurrentNode(null);
    setCurrentMode(null);
  };

  if (!currentNode) {
    return <LandingScreen onStart={handleStart} />;
  }

  return (
    <TransactionScreen
      node={currentNode}
      mode={currentMode}
      onBack={handleBack}
    />
  );
}

export default App;

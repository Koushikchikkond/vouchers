import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from './components/LoginScreen';
import LandingScreen from './components/LandingScreen';
import TransactionScreen from './components/TransactionScreen';
import NodeDetailsView from './components/NodeDetailsView';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentNode, setCurrentNode] = useState(null);
  const [currentMode, setCurrentMode] = useState(null); // 'VOUCHER' | 'REQUESTED'
  const [viewMode, setViewMode] = useState(null); // 'transaction' | 'details'
  const [showNodeSelection, setShowNodeSelection] = useState(false);

  const handleStart = (mode, node) => {
    setCurrentNode(node);
    setCurrentMode(mode);
    setViewMode('transaction');
  };

  const handleNodeDetails = (node) => {
    setCurrentNode(node);
    setViewMode('details');
  };

  const handleBackFromNodeSelection = () => {
    // Go back to mode selection (main page)
    setShowNodeSelection(false);
    setCurrentMode(null);
  };

  const handleBackFromTransaction = () => {
    // Go back to node selection page
    setCurrentNode(null);
    setViewMode(null);
    // Keep currentMode and showNodeSelection true
  };

  const handleModeSelect = (mode) => {
    setCurrentMode(mode);
    setShowNodeSelection(true);
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!user) {
    return <LoginScreen />;
  }

  // Show node details view
  if (viewMode === 'details' && currentNode) {
    return <NodeDetailsView node={currentNode} onBack={handleBackFromTransaction} />;
  }

  // Show transaction screen
  if (viewMode === 'transaction' && currentNode) {
    return (
      <TransactionScreen
        node={currentNode}
        mode={currentMode}
        onBack={handleBackFromTransaction}
      />
    );
  }

  // Show landing screen (default)
  return (
    <LandingScreen
      onStart={handleStart}
      onNodeDetails={handleNodeDetails}
      onModeSelect={handleModeSelect}
      onBackFromNodeSelection={handleBackFromNodeSelection}
      showNodeSelection={showNodeSelection}
      currentMode={currentMode}
    />
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

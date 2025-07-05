import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import KnowledgePage from './pages/KnowledgePage';
import BottomNav from './components/BottomNav';
import Onboarding from './components/Onboarding';

function App() {
  const [showOnboarding, setShowOnboarding] = useState(() => {
    const todayString = new Date().toLocaleDateString('sv');
    const lastShownDate = localStorage.getItem('natureDose_welcomeLastShown');
    return lastShownDate !== todayString;
  });

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    const todayString = new Date().toLocaleDateString('sv');
    localStorage.setItem('natureDose_welcomeLastShown', todayString);
  };

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="pb-20"> {/* 稍微增加底部 padding，避免內容被導航列遮擋 */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/knowledge" element={<KnowledgePage />} />
      </Routes>
      <BottomNav />
    </div>
  );
}

export default App;
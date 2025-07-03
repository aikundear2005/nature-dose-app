import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import KnowledgePage from './pages/KnowledgePage';
import BottomNav from './components/BottomNav';
import Onboarding from './components/Onboarding';

function App() {
  // --- 這是我們修改的核心邏輯 ---
  const [showOnboarding, setShowOnboarding] = useState(() => {
    // 取得今天的日期字串，例如 "2025-07-03"
    const todayString = new Date().toLocaleDateString('sv'); // 'sv' locale gives YYYY-MM-DD format
    // 從 localStorage 讀取上次顯示的日期
    const lastShownDate = localStorage.getItem('natureDose_welcomeLastShown');
    // 如果上次顯示的日期不是今天，那就回傳 true (代表要顯示)
    return lastShownDate !== todayString;
  });

  // --- 這是我們修改的第二個地方 ---
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    // 取得今天的日期字串
    const todayString = new Date().toLocaleDateString('sv');
    // 將今天的日期寫入 localStorage
    localStorage.setItem('natureDose_welcomeLastShown', todayString);
  };

  // --- 判斷邏輯 ---
  // 如果需要顯示導覽，就只回傳 Onboarding 元件
  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // 如果不需要顯示導覽，就回傳 App 的主要架構
  return (
    <div className="pb-16"> 
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/knowledge" element={<KnowledgePage />} />
      </Routes>
      <BottomNav />
    </div>
  );
}

export default App;
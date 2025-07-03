import React, { useState, useEffect } from 'react';
import { Play, Pause, MapPin, Target, Leaf, Sun, Award, HelpCircle, X } from 'lucide-react';

const HomePage = () => {
  // --- 狀態管理 (State Management) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [currentSession, setCurrentSession] = useState(0);

  const [todayTotal, setTodayTotal] = useState(() => {
    const saved = localStorage.getItem('natureDose_todayTotal');
    return saved ? JSON.parse(saved) : 0;
  });

  const [weeklyTotal, setWeeklyTotal] = useState(() => {
    const saved = localStorage.getItem('natureDose_weeklyTotal');
    return saved ? JSON.parse(saved) : 0;
  });

  const [dailyRecords, setDailyRecords] = useState(() => {
    const saved = localStorage.getItem('natureDose_dailyRecords');
    return saved ? JSON.parse(saved) : [];
  });

  const [lastVisitedDate, setLastVisitedDate] = useState(() => {
    const saved = localStorage.getItem('natureDose_lastVisitedDate');
    return saved ? saved : null;
  });
  
  const [achievements, setAchievements] = useState(() => {
    const saved = localStorage.getItem('natureDose_achievements');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'explorer', name: '自然探索者', description: '連續7天達成每日目標', unlocked: false },
      { id: 'forest_bath', name: '森林浴專家', description: '單次活動累積超過300積分', unlocked: false },
      { id: 'green_master', name: '綠色生活家', description: '本週超越目標20%', unlocked: false }
    ];
  });

  const [chartData, setChartData] = useState([]);
  const [weeklyGoal, setWeeklyGoal] = useState(420);
  const [location, setLocation] = useState('點擊 GPS 按鈕開始定位');
  const [natureScore, setNatureScore] = useState(2);
  const [currentEnvironment, setCurrentEnvironment] = useState('未知環境');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState(new Date());
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');

  // --- 副作用 (Side Effects) ---

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    let wakeLock = null;
    if ('wakeLock' in navigator && isTracking) {
      navigator.wakeLock.request('screen').catch(err => console.error('Wake lock failed:', err));
    }
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (wakeLock) wakeLock.release();
    };
  }, [isTracking]);

  useEffect(() => {
    if (!isTracking) return;
    const interval = setInterval(() => {
      setCurrentSession(prev => prev + 1);
      setTodayTotal(prev => prev + natureScore);
      setWeeklyTotal(prev => prev + natureScore);
      setLastSync(new Date());
      if ('vibrate' in navigator && (currentSession + 1) % 15 === 0) navigator.vibrate(100);
    }, 60000);
    return () => clearInterval(interval);
  }, [isTracking, currentSession, natureScore]);

  useEffect(() => { localStorage.setItem('natureDose_todayTotal', JSON.stringify(todayTotal)); }, [todayTotal]);
  useEffect(() => { localStorage.setItem('natureDose_weeklyTotal', JSON.stringify(weeklyTotal)); }, [weeklyTotal]);
  useEffect(() => { localStorage.setItem('natureDose_dailyRecords', JSON.stringify(dailyRecords)); }, [dailyRecords]);
  useEffect(() => { if (lastVisitedDate) localStorage.setItem('natureDose_lastVisitedDate', lastVisitedDate); }, [lastVisitedDate]);
  useEffect(() => { localStorage.setItem('natureDose_achievements', JSON.stringify(achievements)); }, [achievements]);

  useEffect(() => {
    const getTodayString = () => new Date().toLocaleDateString('sv');
    const todayString = getTodayString();
    if (lastVisitedDate && lastVisitedDate !== todayString) {
      const yesterdaysTotal = todayTotal;
      const newRecord = { date: lastVisitedDate, points: yesterdaysTotal };
      setDailyRecords(prevRecords => [...prevRecords, newRecord].slice(-30));
      setTodayTotal(0);
    }
    setLastVisitedDate(todayString);
  }, []);

  useEffect(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return {
        date: d.toLocaleDateString('sv'),
        dayLabel: ['日', '一', '二', '三', '四', '五', '六'][d.getDay()],
        points: 0,
      };
    }).reverse();
    const recordsMap = new Map(dailyRecords.map(r => [r.date, r.points]));
    last7Days.forEach(day => {
      if (recordsMap.has(day.date)) day.points = recordsMap.get(day.date);
    });
    if (last7Days.length > 0) {
      last7Days[last7Days.length - 1].points = todayTotal;
    }
    setChartData(last7Days);
  }, [dailyRecords, todayTotal]);

  useEffect(() => {
    const unlockAchievement = (achievementId) => {
      setAchievements(prevAchievements =>
        prevAchievements.map(ach => {
          if (ach.id === achievementId && !ach.unlocked) {
            console.log(`成就解鎖： ${ach.name}`);
            if ('vibrate' in navigator) navigator.vibrate([100, 50, 200]);
            return { ...ach, unlocked: true };
          }
          return ach;
        })
      );
    };
    if (currentSession >= 3) unlockAchievement('forest_bath');
    if (weeklyTotal >= weeklyGoal * 1.2 && weeklyGoal > 0) unlockAchievement('green_master');
  }, [currentSession, weeklyTotal, weeklyGoal, achievements]);

  // --- 核心功能函式 ---
  const toggleTracking = () => {
    setIsTracking(!isTracking);
    if (isTracking) setCurrentSession(0);
    if ('vibrate' in navigator) navigator.vibrate(isTracking ? [100, 50, 100] : 100);
  };

  const getNatureDataFromLocation = async (lat, lon) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=zh-TW`);
      if (!response.ok) throw new Error(`API request failed`);
      const data = await response.json();
      if (!data || data.error) throw new Error(data.error || 'Cannot parse location info');
      let score = 1; let env = '都市環境';
      const address = data.address || {};
      const category = data.category;
      if (address.natural || category === 'natural' || ['forest', 'wood', 'park', 'garden'].includes(address.leisure || '')) {
        score = 5; env = '自然山林';
      } else if (address.leisure === 'nature_reserve' || address.waterway || address.natural === 'water') {
        score = 4; env = '河岸水域';
      } else if (address.landuse === 'grass' || address.leisure === 'pitch') {
        score = 3; env = '校園綠地';
      } else if (address.road || address.building) {
        score = 2; env = '街道社區';
      }
      const displayName = data.display_name.split(',').slice(0, 3).join(',');
      setLocation(displayName); setNatureScore(score); setCurrentEnvironment(env);
    } catch (apiError) {
      console.error('Location API Error:', apiError);
      setLocation('無法解析詳細地點'); setNatureScore(2); setCurrentEnvironment('未知環境');
      setLocationError('無法從伺服器獲取地點資訊。');
    }
  };

  const getCurrentLocation = async () => {
    if (!('geolocation' in navigator)) { setLocationError('此裝置不支援定位'); return; }
    setIsLoadingLocation(true); setLocationError('');
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true, timeout: 20000, maximumAge: 60000,
        });
      });
      const { latitude, longitude } = position.coords;
      await getNatureDataFromLocation(latitude, longitude);
      if ('vibrate' in navigator) navigator.vibrate([50, 50, 50]);
    } catch (error) {
      let errorMessage = '無法取得位置';
      if(error && typeof error === 'object' && 'code' in error){
        switch (error.code) {
          case 1: errorMessage = '位置權限被拒絕'; break;
          case 2: errorMessage = '位置資訊無法取得'; break;
          case 3: errorMessage = '定位逾時'; break;
          default: errorMessage = `未知定位錯誤`;
        }
      }
      setLocationError(errorMessage); setLocation('無法自動定位');
    } finally {
      setIsLoadingLocation(false);
    }
  };
  
  const manualLocationSelect = () => {
    const locations = [ { name: '澄清湖', score: 4, env: '風景區' }, { name: '高雄美術館', score: 3, env: '都會公園' }, ];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    setLocation(randomLocation.name); setNatureScore(randomLocation.score);
    setCurrentEnvironment(randomLocation.env); setLocationError(''); setLastSync(new Date());
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}小時${mins}分鐘` : `${mins}分鐘`;
  };

  const getProgressPercentage = () => Math.min((weeklyTotal / weeklyGoal) * 100, 100);

  const getNatureScoreColor = (score) => {
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const renderLeaves = (score) => Array.from({ length: 5 }, (_, i) => (
    <Leaf key={i} className={`w-4 h-4 transition-colors ${i < score ? 'text-green-500 fill-current' : 'text-gray-300'}`} />
  ));

  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-green-50 to-blue-50 min-h-screen font-sans">
        <div className="bg-gray-800 bg-opacity-80 text-white text-xs px-4 py-1 flex justify-between items-center fixed top-0 left-0 right-0 max-w-md mx-auto z-20 backdrop-blur-sm">
            <span>{isOnline ? '● 已連線' : '○ 離線模式'}</span>
            <span>最後同步: {lastSync.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div className="pt-8">
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 pt-12 rounded-b-3xl shadow-lg sticky top-0 z-10">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">自然時光 (Beta01)</h1>
                    <div className="flex items-center space-x-1 bg-black bg-opacity-20 px-3 py-1 rounded-full text-sm">{renderLeaves(natureScore)}</div>
                </div>
                <div className="flex items-center text-green-100 mb-2">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-sm flex-1 truncate" title={location}>{location}</span>
                    <div className="flex space-x-2 ml-2">
                    <button onClick={getCurrentLocation} disabled={isLoadingLocation} className="text-xs px-3 py-2 rounded-full transition-all bg-white bg-opacity-20 hover:bg-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed">{isLoadingLocation ? '定位中…' : 'GPS'}</button>
                    <button onClick={manualLocationSelect} className="text-xs px-3 py-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all">手動</button>
                    </div>
                </div>
                {locationError && <div className="text-red-200 text-xs mb-2 bg-red-900 bg-opacity-50 p-2 rounded whitespace-pre-line">⚠️ {locationError}</div>}
                <div className="text-center mt-4">
                    <div className="text-5xl font-bold mb-1 tabular-nums tracking-wider">{formatTime(currentSession)}</div>
                    <div className="text-green-200 text-sm opacity-80">目前活動時間</div>
                </div>
            </div>
            <div className="p-4 md:p-6 space-y-6">
                <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6">
                    <div className="text-center mb-4">
                    <div className="text-lg font-semibold text-gray-800 mb-2">環境品質</div>
                    <div className="flex justify-center items-center space-x-2 mb-4">
                        {renderLeaves(natureScore)}
                        <span className={`ml-2 font-medium ${getNatureScoreColor(natureScore)}`}>{currentEnvironment} ({natureScore}/5)</span>
                    </div>
                    </div>
                    <button onClick={toggleTracking} className={`w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center space-x-2 transition-all text-lg shadow-lg active:scale-95 ${isTracking ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>
                    {isTracking ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    <span>{isTracking ? '暫停追蹤' : '開始追蹤'}</span>
                    </button>
                </div>
                <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center"><Sun className="w-5 h-5 mr-2 text-yellow-500" />今日統計</h3>
                    <button onClick={() => setIsModalOpen(true)} className="text-gray-400 hover:text-blue-500 transition-colors"><HelpCircle className="w-5 h-5" /></button>
                    </div>
                    <div className="p-4 bg-green-50 rounded-xl text-center">
                    <div className="text-3xl font-bold text-green-600 tabular-nums">{todayTotal}</div>
                    <div className="text-sm text-gray-600 mt-1">戶外積分</div>
                    </div>
                </div>
                <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center"><Target className="w-5 h-5 mr-2 text-blue-500" />本週進度</h3>
                    <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>{weeklyTotal} / {weeklyGoal} 積分</span>
                        <span>{getProgressPercentage().toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500" style={{ width: `${getProgressPercentage()}%` }}></div>
                    </div>
                    </div>
                    <div className="grid grid-cols-7 gap-2 mt-4">
                    {chartData.map((day, index) => (
                        <div key={index} className="text-center">
                        <div className="text-xs text-gray-600 mb-1">{day.dayLabel}</div>
                        <div className="bg-gray-200 rounded-md h-24 flex items-end mx-auto w-full">
                            <div className="bg-green-400 rounded-md w-full" style={{ height: `${Math.min(day.points / (weeklyGoal / 7) * 100, 100)}%` }}></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{day.points}p</div>
                        </div>
                    ))}
                    </div>
                </div>
                <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-20">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center"><Award className="w-5 h-5 mr-2 text-yellow-500" />成就系統</h3>
                    <div className="space-y-3">
                    {achievements.map((ach) => (
                        <div key={ach.id} className={`p-4 rounded-lg border-2 transition-all ${ach.unlocked ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-gray-50 opacity-60'}`}>
                        <div className="flex items-center">
                            <Award className={`w-6 h-6 mr-3 flex-shrink-0 ${ach.unlocked ? 'text-yellow-500' : 'text-gray-400'}`} />
                            <div>
                            <div className={`font-medium ${ach.unlocked ? 'text-yellow-800' : 'text-gray-600'}`}>{ach.name}</div>
                            <div className="text-sm text-gray-600">{ach.description}</div>
                            </div>
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
        </div>
        {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-gray-800 mb-4">積分如何計算？</h2>
                <div className="text-gray-600 space-y-3">
                <p>您的積分計算方式為：</p>
                <p className="text-center font-semibold text-lg my-2 p-3 bg-gray-100 rounded-lg">累積積分 = 自然分數 × 分鐘數</p>
                <div className="space-y-2 text-sm border-t pt-3 mt-3">
                    <div><span className="font-semibold text-green-600">★★★★★ (5分) - 自然山林</span>：每分鐘獲得 5 積分</div>
                    <div><span className="font-semibold text-green-500">★★★★☆ (4分) - 河岸水域/公園</span>：每分鐘獲得 4 積分</div>
                    <div><span className="font-semibold text-yellow-500">★★★☆☆ (3分) - 校園綠地</span>：每分鐘獲得 3 積分</div>
                    <div><span className="font-semibold text-orange-500">★★☆☆☆ (2分) - 街道社區</span>：每分鐘獲得 2 積分</div>
                    <div><span className="font-semibold text-red-500">★☆☆☆☆ (1分) - 都市環境</span>：每分鐘獲得 1 積分</div>
                </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">我明白了</button>
            </div>
            </div>
        )}
    </div>
  );
};

export default HomePage;
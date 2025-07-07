import React, { useState, useEffect } from 'react';
import { Play, Pause, MapPin, Target, Leaf, Sun, Award, HelpCircle, Compass, X, LoaderCircle, Gift, BadgeCheck } from 'lucide-react';
import PlaceCard, { Place } from '../components/PlaceCard';
import { changelogData } from '../data/changelogData';

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
};

const HomePage = () => {
  // (State 和 useEffect 保持不變)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [currentSession, setCurrentSession] = useState(0);
  const [expandedPlaceId, setExpandedPlaceId] = useState<number | null>(null);
  const [realPlaces, setRealPlaces] = useState<Place[]>([]);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  const [placesError, setPlacesError] = useState('');
  const [todayTotal, setTodayTotal] = useState(() => {
    const saved = localStorage.getItem('natureDose_todayTotal');
    return saved ? JSON.parse(saved) : 0;
  });
  const [weeklyTotal, setWeeklyTotal] = useState(() => {
    const saved = localStorage.getItem('natureDose_weeklyTotal');
    return saved ? JSON.parse(saved) : 0;
  });
  const [dailyRecords, setDailyRecords] = useState<any[]>(() => {
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
      { id: 'forest_bath', name: '森林浴專家', description: '單次活動累積超過60積分', unlocked: false },
      { id: 'green_master', name: '綠色生活家', description: '本週超越目標20%', unlocked: false }
    ];
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [weeklyGoal, setWeeklyGoal] = useState(420);
  const [location, setLocation] = useState('點擊 GPS 按鈕開始定位');
  const [natureScore, setNatureScore] = useState(2);
  const [currentEnvironment, setCurrentEnvironment] = useState('未知環境');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState(new Date());
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    let wakeLock: any = null;
    if ('wakeLock' in navigator && isTracking) {
      (navigator as any).wakeLock.request('screen').then((lock: any) => { wakeLock = lock; }).catch((err: any) => console.error('Wake lock failed:', err));
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
      const points = recordsMap.get(day.date);
      if (points !== undefined) { day.points = points; }
    });
    if (last7Days.length > 0) {
      last7Days[last7Days.length - 1].points = todayTotal;
    }
    setChartData(last7Days);
  }, [dailyRecords, todayTotal]);
  useEffect(() => {
    const unlockAchievement = (achievementId: string) => {
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
    if (currentSession * natureScore >= 60) unlockAchievement('forest_bath');
    if (weeklyTotal >= weeklyGoal * 1.2 && weeklyGoal > 0) unlockAchievement('green_master');
  }, [currentSession, weeklyTotal, weeklyGoal, achievements, natureScore]);

  const foursquareApiKey = 'fsq33zqMPLkyEGsEeJqLOezzwN6Hze5gnZ4qP0Gi8O0AREM=';
  const mapTilerApiKey = '8fb5GMz9Y10bWBZvZL3I';

  const fetchFromFoursquare = async (lat: number, lon: number): Promise<Place[]> => {
    console.log('Trying Foursquare API...');
    if (foursquareApiKey === 'YOUR_FOURSQUARE_API_KEY' || !foursquareApiKey) throw new Error('Foursquare API Key is missing.');
    
    const params = new URLSearchParams({
      ll: `${lat},${lon}`,
      radius: '2000',
      categories: '16032',
      limit: '10',
      sort: 'DISTANCE'
    });
    const apiUrl = `/api/foursquare/places/search?${params.toString()}`;

    const response = await fetch(apiUrl, { headers: { 'Authorization': foursquareApiKey, 'Accept': 'application/json' } });
    if (!response.ok) throw new Error(`Foursquare API failed with status ${response.status}`);
    
    const data = await response.json();
    if (!data.results || data.results.length === 0) return [];

    return data.results.map((item: any) => ({
      id: item.fsq_id,
      name: item.name,
      distance: item.distance,
      walkTime: Math.round(item.distance / 80),
      features: [],
      description: item.categories[0]?.name || '戶外景點',
      openHours: '請查詢官方資訊',
      terrain: '未知',
    }));
  };

  // ✨ 使用 MapTiler 正確的 Geocoding API 來查詢 POI
  const fetchFromMapTiler = async (lat: number, lon: number): Promise<Place[]> => {
    console.log('Trying MapTiler API with multiple queries...');
    if (mapTilerApiKey === 'YOUR_MAPTILER_API_KEY' || !mapTilerApiKey) throw new Error('MapTiler API Key is missing.');
    
    // ✨ 修正 #1: 我們要搜尋的多個關鍵字
    const queries = ['park', 'garden', 'forest', 'nature'];
    
    // ✨ 修正 #2: 為每一個關鍵字建立一個 API 請求
    const requests = queries.map(async (query) => {
      try {
        const viewbox_radius = 0.05; // 擴大到約 5km
        const viewbox = [
          lon - viewbox_radius,
          lat + viewbox_radius,
          lon + viewbox_radius,
          lat - viewbox_radius
        ].join(',');
        
        const apiUrl = `/api/maptiler/geocoding/${query}.json?key=${mapTilerApiKey}&bbox=${bbox}&limit=5`;

        const response = await fetch(apiUrl);
        if (!response.ok) {
          console.error(`MapTiler API call for query '${query}' failed with status ${response.status}`);
          return [];
        }
        return await response.json();
      } catch (error) {
        console.error(`Error fetching MapTiler for query '${query}':`, error);
        return [];
      }
    });

    // 等待所有請求完成
    const results = await Promise.all(requests);
    
    // 將所有回傳的 features 合併為一個陣列
    const allFeatures = results.map(result => result.features || []).flat();

    if (allFeatures.length === 0) return [];

    // 去除重複的地點
    const uniqueFeatures = Array.from(new Map(allFeatures.map(item => [item.id, item])).values());
    
    // 轉換成我們需要的 Place[] 格式
    return uniqueFeatures
      .map((item: any) => ({
        id: item.id,
        name: item.text,
        distance: calculateDistance(lat, lon, item.center[1], item.center[0]),
        walkTime: Math.round(calculateDistance(lat, lon, item.center[1], item.center[0]) / 80),
        features: [],
        description: item.properties?.category || '戶外景點',
        openHours: '請查詢官方資訊',
        terrain: '未知',
      })).sort((a,b) => a.distance - b.distance);
  };
  
  // ✨ 同樣使用 MapTiler 正確的 Geocoding API 來反向查詢地址
  const getNatureDataFromLocation = async (lat: number, lon: number) => {
    if (mapTilerApiKey === 'YOUR_MAPTILER_API_KEY' || !mapTilerApiKey) throw new Error('MapTiler key is missing');

    // ✨ 修正: 移除了無效的 &language=zh-Hant 參數
    const apiUrl = `/api/maptiler/geocoding/${lon},${lat}.json?key=${mapTilerApiKey}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      
      const findContext = (idPrefix: string) => data.features[0]?.context.find((c: any) => c.id.startsWith(idPrefix))?.text;
      const locationName = findContext('district') || findContext('place') || '未知區域';
      setLocation(locationName);

      let score = 2; let env = '街道社區';
      const placeType = data.features[0]?.place_type[0];
      if (['park', 'garden', 'forest', 'nature_reserve'].includes(placeType)) {
          score = 4; env = '公園綠地';
      } else if (placeType === 'poi' && (data.features[0]?.text.includes('森林') || data.features[0]?.text.includes('山'))) {
          score = 5; env = '自然山林';
      }
      setNatureScore(score);
      setCurrentEnvironment(env);
    } catch (apiError) {
      console.error('Location API Error:', apiError);
      setLocation('無法解析詳細地點');
      setNatureScore(2);
      setCurrentEnvironment('未知環境');
      setLocationError('無法從伺服器獲取地點資訊。');
    }
  };

  const getCurrentLocation = async () => {
    if ((foursquareApiKey === 'YOUR_FOURSQUARE_API_KEY') || (mapTilerApiKey === 'YOUR_MAPTILER_API_KEY')) {
        setLocationError('請先在程式碼中填入所有 API 金鑰。');
        return;
    }
    if (!('geolocation' in navigator)) { setLocationError('此裝置不支援定位'); return; }
    setIsLoadingLocation(true); setLocationError('');
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true, timeout: 20000, maximumAge: 60000,
        });
      });
      const { latitude, longitude } = position.coords;
      await Promise.all([
        getNatureDataFromLocation(latitude, longitude),
        fetchNearbyPlaces(latitude, longitude)
      ]);
      if ('vibrate' in navigator) navigator.vibrate([50, 50, 50]);
    } catch (error: any) {
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
  
  // (其他所有 helper functions 和 JSX return 陳述式都保持不變)
  const handleTogglePlaceCard = (id: number) => {
    setExpandedPlaceId(prevId => (prevId === id ? null : id));
  };
  const toggleTracking = () => {
    setIsTracking(!isTracking);
    if (isTracking) setCurrentSession(0);
    if ('vibrate' in navigator) navigator.vibrate(isTracking ? [100, 50, 100] : 100);
  };
  const manualLocationSelect = () => {
    const locations = [ { name: '澄清湖', score: 4, env: '風景區' }, { name: '高雄美術館', score: 3, env: '都會公園' }, ];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    setLocation(randomLocation.name); setNatureScore(randomLocation.score);
    setCurrentEnvironment(randomLocation.env); setLocationError(''); setLastSync(new Date());
  };
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}小時${mins}分鐘` : `${mins}分鐘`;
  };
  const getProgressPercentage = () => Math.min((weeklyTotal / weeklyGoal) * 100, 100);
  const getNatureScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-400';
    if (score >= 3) return 'text-yellow-400';
    return 'text-orange-400';
  };
  const renderLeaves = (score: number) => Array.from({ length: 5 }, (_, i) => (
    <Leaf key={i} className={`w-4 h-4 transition-colors ${i < score ? 'text-green-400 fill-current' : 'text-gray-500'}`} />
  ));


  return (
    <div className="max-w-md mx-auto bg-gray-900 text-white min-h-screen font-sans">
      <div className="bg-gray-800 bg-opacity-80 text-white text-xs px-4 py-1 flex justify-between items-center fixed top-0 left-0 right-0 max-w-md mx-auto z-20 backdrop-blur-sm">
        <span>{isOnline ? '● 已連線' : '○ 離線模式'}</span>
        <span>最後同步: {lastSync.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div className="pt-8">
        <div className="bg-gradient-to-r from-green-700 to-green-800 text-white p-6 pt-12 rounded-b-3xl shadow-lg sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">自然時光</h1>
              <button onClick={() => setIsChangelogOpen(true)} className="bg-cyan-500 text-xs font-bold text-white px-2.5 py-1 rounded-full hover:bg-cyan-400 transition-colors">
                Beta 0.2
              </button>
            </div>
            <div className="flex items-center space-x-1 bg-black bg-opacity-20 px-3 py-1 rounded-full text-sm">{renderLeaves(natureScore)}</div>
          </div>
          <div className="flex items-center text-green-100 mb-2">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0 text-green-200" />
            <span className="text-sm flex-1 truncate" title={location}>{location}</span>
            <div className="flex space-x-2 ml-2">
            <button onClick={getCurrentLocation} disabled={isLoadingLocation} className="text-xs px-3 py-2 rounded-full transition-all bg-white bg-opacity-20 hover:bg-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed">{isLoadingLocation ? '定位中…' : 'GPS'}</button>
            <button onClick={manualLocationSelect} className="text-xs px-3 py-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all">手動</button>
            </div>
          </div>
          {locationError && <div className="text-red-300 text-xs mb-2 bg-red-900 bg-opacity-50 p-2 rounded whitespace-pre-line">⚠️ {locationError}</div>}
          <div className="text-center mt-4">
            <div className="text-5xl font-bold mb-1 tabular-nums tracking-wider">{formatTime(currentSession)}</div>
            <div className="text-green-200 text-sm opacity-80">目前活動時間</div>
          </div>
        </div>
        <div className="p-4 md:p-6 space-y-6">
            <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
                <div className="text-center mb-4">
                <div className="text-lg font-semibold text-gray-100 mb-2">環境品質</div>
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
            <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-100 flex items-center"><Sun className="w-5 h-5 mr-2 text-yellow-400" />今日統計</h3>
                <button onClick={() => setIsModalOpen(true)} className="text-gray-400 hover:text-blue-400 transition-colors"><HelpCircle className="w-5 h-5" /></button>
                </div>
                <div className="p-4 bg-gray-700 rounded-xl text-center">
                <div className="text-3xl font-bold text-green-400 tabular-nums">{todayTotal}</div>
                <div className="text-sm text-gray-300 mt-1">戶外積分</div>
                </div>
            </div>
            <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center"><Target className="w-5 h-5 mr-2 text-blue-400" />本週進度</h3>
                <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-300 mb-1">
                    <span>{weeklyTotal} / {weeklyGoal} 積分</span>
                    <span>{getProgressPercentage().toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500" style={{ width: `${getProgressPercentage()}%` }}></div>
                </div>
                </div>
                <div className="grid grid-cols-7 gap-2 mt-4">
                {chartData.map((day, index) => (
                    <div key={index} className="text-center">
                    <div className="text-xs text-gray-400 mb-1">{day.dayLabel}</div>
                    <div className="bg-gray-700 rounded-md h-24 flex items-end mx-auto w-full">
                        <div className="bg-green-500 rounded-md w-full" style={{ height: `${Math.min(day.points / (weeklyGoal / 7) * 100, 100)}%` }}></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{day.points > 0 ? `${day.points}p` : ''}</div>
                    </div>
                ))}
                </div>
            </div>
            <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center">
                    <Compass className="w-5 h-5 mr-2 text-indigo-400" />
                    附近的好去處
                </h3>
                {isLoadingPlaces && (
                    <div className="flex items-center justify-center text-gray-400">
                    <LoaderCircle className="w-5 h-5 animate-spin mr-2" />
                    <span>正在搜尋附近地點...</span>
                    </div>
                )}
                {placesError && (
                    <div className="text-center text-red-400 bg-red-900 bg-opacity-30 p-3 rounded-lg">
                    {placesError}
                    </div>
                )}
                {!isLoadingPlaces && !placesError && realPlaces.length === 0 && (
                    <div className="text-center text-gray-400 bg-gray-700 p-3 rounded-lg">
                    點擊上方的「GPS」按鈕來搜尋附近地點。
                    </div>
                )}
                <div className="space-y-4">
                    {realPlaces.map((place) => (
                    <PlaceCard 
                        key={place.id}
                        place={place}
                        isExpanded={expandedPlaceId === place.id}
                        onToggle={() => handleTogglePlaceCard(place.id)}
                    />
                    ))}
                </div>
            </div>
            <div className="bg-gray-800 rounded-2xl shadow-lg p-6 mb-20">
                <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center"><Award className="w-5 h-5 mr-2 text-yellow-400" />成就系統</h3>
                <div className="space-y-3">
                {achievements.map((ach) => (
                    <div key={ach.id} className={`p-4 rounded-lg border-2 transition-all ${ach.unlocked ? 'border-yellow-500 bg-yellow-900 bg-opacity-20' : 'border-gray-700 bg-gray-700 bg-opacity-50'}`}>
                    <div className="flex items-center">
                        <Award className={`w-6 h-6 mr-3 flex-shrink-0 ${ach.unlocked ? 'text-yellow-400' : 'text-gray-500'}`} />
                        <div>
                        <div className={`font-medium ${ach.unlocked ? 'text-yellow-200' : 'text-gray-300'}`}>{ach.name}</div>
                        <div className="text-sm text-gray-400">{ach.description}</div>
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
            <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl p-6 w-full max-w-sm text-white" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-100">積分如何計算？</h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="text-gray-300 space-y-3">
                <p>您的積分計算方式為：</p>
                <p className="text-center font-semibold text-lg my-2 p-3 bg-gray-700 rounded-lg">累積積分 = 自然分數 × 分鐘數</p>
                <div className="space-y-2 text-sm border-t border-gray-700 pt-3 mt-3">
                    <div><span className="font-semibold text-green-400">★★★★★ (5分) - 自然山林</span>：每分鐘獲得 5 積分</div>
                    <div><span className="font-semibold text-green-500">★★★★☆ (4分) - 河岸水域/公園</span>：每分鐘獲得 4 積分</div>
                    <div><span className="font-semibold text-yellow-400">★★★☆☆ (3分) - 校園綠地</span>：每分鐘獲得 3 積分</div>
                    <div><span className="font-semibold text-orange-400">★★☆☆☆ (2分) - 街道社區</span>：每分鐘獲得 2 積分</div>
                    <div><span className="font-semibold text-red-400">★☆☆☆☆ (1分) - 都市環境</span>：每分鐘獲得 1 積分</div>
                </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">我明白了</button>
            </div>
            </div>
        )}

      {isChangelogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={() => setIsChangelogOpen(false)}>
          <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl p-6 w-full max-w-md text-white" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2">
                <Gift className="text-cyan-400" />
                版本 Beta 0.2 更新說明
              </h2>
              <button onClick={() => setIsChangelogOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {changelogData[0].changes.map((change, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-700 rounded-lg">
                  <BadgeCheck className="w-6 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <p className="text-gray-300">{change.text}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setIsChangelogOpen(false)} className="mt-6 w-full bg-cyan-600 text-white py-2 px-4 rounded-lg hover:bg-cyan-700 transition-colors">
              關閉
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
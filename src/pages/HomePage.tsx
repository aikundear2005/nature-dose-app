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
  // (所有 state 和大部分 useEffect 保持不變)
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

  const locationIQApiKey = 'pk.e6c401ca5767b1463370f1ce5e2a916f';

  // ✨ 修正 #1: 整個函式重寫，改用 Reverse Geocoding API 來找附近的 POI
  const fetchNearbyPlaces = async (lat: number, lon: number) => {
    setIsLoadingPlaces(true);
    setPlacesError('');
    setRealPlaces([]);

    if (locationIQApiKey === 'YOUR_API_KEY' || !locationIQApiKey) {
      setPlacesError('請先在程式碼中填入您的 LocationIQ API 金鑰。');
      setIsLoadingPlaces(false);
      return;
    }

    try {
      // ✨ 我們要搜尋的關鍵字列表
      const queries = ['park', 'garden', 'forest', 'nature_reserve'];
      
      // ✨ 為每一個關鍵字建立一個 API 請求，並用 try/catch 包裝，確保單一失敗不影響全局
      const requests = queries.map(async (query) => {
        try {
          const viewbox_radius = 0.02; // 約 2km
          const viewbox = [
            lon - viewbox_radius,
            lat + viewbox_radius,
            lon + viewbox_radius,
            lat - viewbox_radius
          ].join(',');
          const apiUrl = `/api/search.php?key=${locationIQApiKey}&q=${query}&viewbox=${viewbox}&bounded=1&format=json&accept-language=zh-TW&limit=10`;

          const response = await fetch(apiUrl);
          if (!response.ok) {
            // 如果請求失敗，印出錯誤到 console，但回傳空陣列，不中斷其他請求
            console.error(`API call for query '${query}' failed with status ${response.status}`);
            return []; 
          }
          return await response.json();
        } catch (error) {
          console.error(`Error fetching for query '${query}':`, error);
          return []; // 發生其他錯誤也回傳空陣列
        }
      });

      // ✨ 等待所有（可能成功或失敗的）請求都完成
      const results = await Promise.all(requests);
      
      // 將所有成功請求回來的結果（陣列的陣列）合併為一個單一陣列
      const allPlaces = results.flat();

      if (!allPlaces || allPlaces.length === 0) {
        setPlacesError('在您附近找不到任何符合的公園或綠地。');
        return;
      }
      
      // 去除重複的地點
      const uniquePlaces = Array.from(new Map(allPlaces.map(item => [item.place_id, item])).values());

      // 過濾掉不想要的結果（例如「里」）
      const blacklistedNameKeywords = ['里', '鄰'];
      const filteredData = uniquePlaces.filter((item: any) => {
        const name = item.name || item.display_name.split(',')[0];
        return !blacklistedNameKeywords.some(keyword => name.includes(keyword));
      });
      
      if (filteredData.length === 0) {
        setPlacesError('過濾後，在您附近找不到符合的公園或綠地。');
        return;
      }

      const transformedPlaces: Place[] = filteredData.map((item: any) => {
        const distance = calculateDistance(lat, lon, parseFloat(item.lat), parseFloat(item.lon));
        return {
          id: item.place_id,
          name: item.name || item.display_name.split(',')[0],
          distance: distance,
          walkTime: Math.round(distance / 80),
          features: [],
          description: item.type,
          openHours: '請查詢官方資訊',
          terrain: '未知',
        };
      }).sort((a: Place, b: Place) => a.distance - b.distance);

      setRealPlaces(transformedPlaces.slice(0, 10));

    } catch (error: any) {
      console.error("Main fetch process error:", error);
      setPlacesError(error.message || '抓取附近地點時發生未知錯誤。');
    } finally {
      setIsLoadingPlaces(false);
    }
  };

      // --- ✨ 新增：資料過濾邏輯 ---
      const blacklistedNameKeywords = ['里', '鄰', '閒置土地'];
      const whitelistedTypes = ['park', 'garden', 'forest', 'nature_reserve', 'dog_park', 'recreation_ground'];

      const filteredData = data.filter((item: any) => {
        const name = item.name || item.display_name.split(',')[0];
        const type = item.type;

        // 規則一：如果名稱包含黑名單關鍵字，就排除
        if (blacklistedNameKeywords.some(keyword => name.includes(keyword))) {
          return false;
        }

        // 規則二：地點的類別必須在我們的白名單中
        return whitelistedTypes.includes(type);
      });

      if (filteredData.length === 0) {
        setPlacesError('過濾後，在您附近找不到符合的公園或綠地。');
        return;
      }
      // --- 過濾邏輯結束 ---
      
      // ✨ 修改：使用過濾後的 `filteredData` 來建立卡片
      const transformedPlaces: Place[] = filteredData.map((item: any) => {
        const distance = calculateDistance(lat, lon, parseFloat(item.lat), parseFloat(item.lon));
        return {
          id: item.place_id,
          name: item.name || item.display_name.split(',')[0],
          distance: distance,
          walkTime: Math.round(distance / 80),
          features: [],
          description: item.type,
          openHours: '請查詢官方資訊',
          terrain: '未知',
        };
      }).sort((a: Place, b: Place) => a.distance - b.distance);

      setRealPlaces(transformedPlaces);

    } catch (error: any) {
      console.error("Fetch nearby places error:", error);
      setPlacesError(error.message || '抓取附近地點時發生未知錯誤。');
    } finally {
      setIsLoadingPlaces(false);
    }
  };

  // ✨ 修正 #2: 這個函式也使用 Reverse API，邏輯與上面 fetchNearbyPlaces 幾乎一致
  const getNatureDataFromLocation = async (lat: number, lon: number) => {
    const apiUrl = `/api/reverse.php?key=${locationIQApiKey}&lat=${lat}&lon=${lon}&format=json&accept-language=zh-TW`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`API request failed`);
      const data = await response.json();
      if (!data || data.error) throw new Error(data.error || 'Cannot parse location info');

      const address = data.address || {};
      const district = address.city_district || address.suburb || address.county;
      const village = address.village || address.neighbourhood;

      const locationParts = [];
      if (district) locationParts.push(district);
      if (village) locationParts.push(village);

      let displayName;
      if (locationParts.length > 0) {
        displayName = locationParts.join('，');
      } else {
        displayName = address.city || address.county || '未知區域';
      }
      setLocation(displayName);

      let score = 1; let env = '都市環境';
      const type = data.type || '';
      const category = data.class || ''; // LocationIQ 用 class 來分類

      if (['natural', 'wood', 'forest', 'park', 'garden', 'nature_reserve', 'grass', 'heath'].includes(category) || ['park', 'forest'].includes(type)) {
        score = 5; env = '自然山林';
      } else if (['waterway', 'water'].includes(category) || ['river', 'riverbank'].includes(type)) {
        score = 4; env = '河岸水域';
      } else if (['pitch', 'stadium'].includes(type)) {
        score = 3; env = '校園綠地';
      } else if (['road', 'building', 'residential'].includes(category)) {
        score = 2; env = '街道社區';
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
    if (locationIQApiKey === 'YOUR_API_KEY' || !locationIQApiKey) {
        setLocationError('請先在程式碼中填入您的 LocationIQ API 金鑰。');
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
      // 我們讓兩個請求同時發出
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
  
  // (其他功能函式保持不變)
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
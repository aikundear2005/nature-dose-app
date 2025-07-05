import React from 'react';
import { Map, Navigation, ChevronRight, MapPin, Footprints, Droplets, Lightbulb } from 'lucide-react';

// 定義卡片需要的資料格式
export type Place = {
  id: number;
  name: string;
  distance: number;
  walkTime: number;
  features: ('running' | 'toilets' | 'lit' | 'fitness')[];
  description: string;
  openHours: string;
  terrain: string;
};

// 定義 props 的格式
type PlaceCardProps = {
  place: Place;
  isExpanded: boolean;
  onToggle: () => void;
};

const PlaceCard = ({ place, isExpanded, onToggle }: PlaceCardProps) => {
  // 根據距離決定顏色的輔助函式
  const getDistanceStyles = (distance: number) => {
    if (distance <= 500) return { text: 'text-green-700', bg: 'bg-green-100', border: 'border-green-300', arrow: 'text-green-500' };
    if (distance <= 2000) return { text: 'text-blue-700', bg: 'bg-blue-100', border: 'border-blue-300', arrow: 'text-blue-500' };
    return { text: 'text-orange-700', bg: 'bg-orange-100', border: 'border-orange-300', arrow: 'text-orange-500' };
  };

  // 根據設施名稱回傳對應圖示和文字
  const featureMap = {
    running: { icon: <Footprints className="w-4 h-4" />, text: '運動設施' },
    toilets: { icon: <Droplets className="w-4 h-4" />, text: '廁所' },
    lit: { icon: <Lightbulb className="w-4 h-4" />, text: '夜間照明' },
    fitness: { icon: <Footprints className="w-4 h-4" />, text: '健身器材' },
  };

  const styles = getDistanceStyles(place.distance);
  // ✨ **修正重點**: 修正地圖搜尋連結為正確的 Google Maps URL
  const mapSearchUrl = `http://googleusercontent.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}`;
  const navigationUrl = `google.navigation:q=${encodeURIComponent(place.name)}`;

  return (
    <div className={`rounded-2xl shadow-lg overflow-hidden transition-all duration-300 border-2 ${isExpanded ? styles.border : 'border-transparent'} ${styles.bg}`}>
      <div className="p-4 cursor-pointer" onClick={onToggle}>
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-gray-800 text-xl pr-2">{place.name}</h3>
          <ChevronRight className={`w-8 h-8 flex-shrink-0 transition-transform duration-300 ${styles.arrow} ${isExpanded ? 'rotate-90' : ''}`} />
        </div>
        <div className={`flex items-center gap-2 text-sm font-bold ${styles.text}`}>
          <MapPin className="w-4 h-4" />
          <span>{place.distance}m • 步行約 {place.walkTime} 分鐘</span>
        </div>
      </div>
      
      {isExpanded && (
        // ✨ **優化重點**: 加入 v2 的 'animate-fade-in' 動畫效果
        <div className="px-4 pb-4 border-t-2 border-dashed mt-2 pt-3 animate-fade-in">
          <div className="flex flex-wrap gap-x-4 gap-y-2 mb-3">
            {place.features.map(featureKey => {
              const feature = featureMap[featureKey as keyof typeof featureMap];
              return feature ? (
                <div key={featureKey} className={`flex items-center text-xs ${styles.text} font-medium`}>
                  {feature.icon}
                  <span className="ml-1.5">{feature.text}</span>
                </div>
              ) : null;
            })}
          </div>
          <div className="text-sm text-gray-700 space-y-2 mb-4">
             <p><span className="font-semibold">特色：</span>{place.description}</p>
             <p><span className="font-semibold">開放時間：</span>{place.openHours}</p>
             <p><span className="font-semibold">地形：</span>{place.terrain}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <a href={mapSearchUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center space-x-2 bg-black bg-opacity-5 py-2 rounded-lg font-semibold text-gray-700 hover:bg-opacity-10 transition-colors">
              <Map className="w-4 h-4" />
              <span>查看地圖</span>
            </a>
            <a href={navigationUrl} className="flex items-center justify-center space-x-2 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
              <Navigation className="w-4 h-4" />
              <span>開始導航</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaceCard;
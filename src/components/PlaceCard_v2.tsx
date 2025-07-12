import React from 'react';
import {
  Map,
  Navigation,
  ChevronRight,
  MapPin,
  Footprints,
  Droplets,
  Lightbulb,
} from 'lucide-react';

// 修正：Place 的 id 應該允許 string 類型，以匹配 API 回傳
export type Place = {
  id: number | string;
  name: string;
  distance: number;
  walkTime: number;
  features: string[];
  description: string;
  openHours: string;
  terrain: string;
};

type PlaceCardProps = {
  place: Place;
  isExpanded: boolean;
  onToggle: () => void;
};

const PlaceCard_v2 = ({ place, isExpanded, onToggle }: PlaceCardProps) => {
  const getDistanceStyles = (distance: number) => {
    if (distance <= 500)
      return {
        text: 'text-green-700',
        bg: 'bg-green-100',
        border: 'border-green-300',
        arrow: 'text-green-500',
      };
    if (distance <= 2000)
      return {
        text: 'text-blue-700',
        bg: 'bg-blue-100',
        border: 'border-blue-300',
        arrow: 'text-blue-500',
      };
    return {
      text: 'text-orange-700',
      bg: 'bg-orange-100',
      border: 'border-orange-300',
      arrow: 'text-orange-500',
    };
  };

  // 修正：為 featureMap 的 key 提供更精確的類型
  const featureMap: { [key: string]: { icon: JSX.Element; text: string } } = {
    運動設施: { icon: <Footprints className="w-4 h-4" />, text: '運動設施' },
    廁所: { icon: <Droplets className="w-4 h-4" />, text: '廁所' },
    夜間照明: { icon: <Lightbulb className="w-4 h-4" />, text: '夜間照明' },
  };

  const styles = getDistanceStyles(place.distance);

  return (
    <div
      className={`rounded-2xl shadow-lg overflow-hidden transition-all duration-300 border-2 ${
        isExpanded ? styles.border : 'border-transparent'
      } ${styles.bg}`}
    >
      {/* --- 主要修改處 Start (div -> button) --- */}
      <button
        type="button"
        className="p-4 w-full text-left transition-colors hover:bg-black/5"
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-gray-800 text-xl pr-2">{place.name}</h3>
          <ChevronRight
            className={`w-8 h-8 flex-shrink-0 transition-transform duration-300 ${
              styles.arrow
            } ${isExpanded ? 'rotate-90' : ''}`}
          />
        </div>
        <div
          className={`flex items-center gap-2 text-sm font-semibold ${styles.text}`}
        >
          <MapPin className="w-4 h-4" />
          <span>
            {place.distance}m • 步行約 {place.walkTime} 分鐘
          </span>
        </div>
      </button>
      {/* --- 主要修改處 End --- */}

      {isExpanded && (
        <div className="px-4 pb-4 border-t-2 border-dashed mt-2 pt-3 animate-fade-in">
          <div className="flex flex-wrap gap-x-4 gap-y-2 mb-3">
            {place.features.map((featureKey) => {
              const feature = featureMap[featureKey];
              return feature ? (
                <div
                  key={featureKey}
                  className={`flex items-center text-xs ${styles.text} font-medium`}
                >
                  {feature.icon}
                  <span className="ml-1.5">{feature.text}</span>
                </div>
              ) : null;
            })}
          </div>
          <div className="text-sm text-gray-700 space-y-2 mb-4">
            <p>
              <span className="font-semibold">特色：</span>
              {place.description}
            </p>
            <p>
              <span className="font-semibold">開放時間：</span>
              {place.openHours}
            </p>
            <p>
              <span className="font-semibold">地形：</span>
              {place.terrain}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {/* --- 主要修改處 Start (rel attribute) --- */}
            <a
              href={`http://googleusercontent.com/maps.google.com/4...{encodeURIComponent(
                place.name
              )}`}
              target="_blank"
              rel="noopener noreferrer" // 加上 rel 屬性修復安全性問題
              className="flex items-center justify-center space-x-2 bg-gray-200 py-2 rounded-lg font-semibold text-gray-700 hover:bg-gray-300 transition-colors"
            >
              <Map className="w-4 h-4" />
              <span>查看地圖</span>
            </a>
            {/* --- 主要修改處 End --- */}
            <a
              href={`google.navigation:q=${encodeURIComponent(place.name)}`}
              className="flex items-center justify-center space-x-2 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              <Navigation className="w-4 h-4" />
              <span>開始導航</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaceCard_v2;
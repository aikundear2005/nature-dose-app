import React from 'react';
import { Map, Navigation, ChevronRight, MapPin } from 'lucide-react';

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

const PlaceCard = ({ place, isExpanded, onToggle }: PlaceCardProps) => {
  const getDistanceStyles = (distance: number) => {
    if (distance <= 500) return { text: 'text-green-300', bg: 'bg-green-900/50', border: 'border-green-500', arrow: 'text-green-400' };
    if (distance <= 2000) return { text: 'text-blue-300', bg: 'bg-blue-900/50', border: 'border-blue-500', arrow: 'text-blue-400' };
    return { text: 'text-orange-300', bg: 'bg-orange-900/50', border: 'border-orange-500', arrow: 'text-orange-400' };
  };

  const styles = getDistanceStyles(place.distance);
  const mapSearchUrl = `http://googleusercontent.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}`;
  const navigationUrl = `google.navigation:q=${encodeURIComponent(place.name)}`;

  return (
    <div className={`rounded-2xl shadow-lg overflow-hidden transition-all duration-300 border-2 ${isExpanded ? styles.border : 'border-transparent'} ${styles.bg}`}>
      <div className="p-4 cursor-pointer" onClick={onToggle}>
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-gray-100 text-xl pr-2">{place.name}</h3>
          <ChevronRight className={`w-8 h-8 flex-shrink-0 transition-transform duration-300 ${styles.arrow} ${isExpanded ? 'rotate-90' : ''}`} />
        </div>
        <div className={`flex items-center gap-2 text-sm font-semibold ${styles.text}`}>
          <MapPin className="w-4 h-4" />
          <span>{place.distance}m • 步行約 {place.walkTime} 分鐘</span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="px-4 pb-4 border-t-2 border-dashed border-gray-700 mt-2 pt-3 animate-fade-in">
          <div className="text-sm text-gray-300 space-y-2 mb-4">
             <p><span className="font-semibold text-gray-100">特色：</span>{place.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <a href={mapSearchUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center space-x-2 bg-black bg-opacity-20 py-2 rounded-lg font-semibold text-gray-200 hover:bg-opacity-30 transition-colors">
              <Map className="w-4 h-4" />
              <span>查看地圖</span>
            </a>
            <a href={navigationUrl} className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
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
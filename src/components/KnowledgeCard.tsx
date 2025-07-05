import React from 'react';
import { Volume2, PlayCircle } from 'lucide-react'; // 引入新的圖示
import { KnowledgeItem } from '../pages/KnowledgePage';

// 更新 props，加入 isPlaying 和 onPlaySound
type KnowledgeCardProps = {
  item: KnowledgeItem;
  isPlaying: boolean;
  onPlaySound: () => void;
};

const KnowledgeCard = ({ item, isPlaying, onPlaySound }: KnowledgeCardProps) => {
  const imageUrl = `/${item.imageName}`;

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-cyan-500/20 hover:scale-[1.02]">
      {/* 圖片容器，設定為 relative 以便定位播放按鈕 */}
      <div className="relative">
        <img src={imageUrl} alt={item.title} className="w-full h-40 object-cover" />
        
        {/* ✨ 新增：播放按鈕 */}
        <button 
          onClick={onPlaySound}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200
                      ${isPlaying 
                        ? 'bg-cyan-500/80 text-white scale-110' 
                        : 'bg-black/50 text-gray-200 hover:bg-cyan-500/70 hover:scale-110'
                      }`}
          aria-label={`播放 ${item.title} 的聲音`}
        >
          {isPlaying ? (
            <Volume2 size={20} className="animate-pulse" />
          ) : (
            <PlayCircle size={20} />
          )}
        </button>
      </div>

      <div className="p-5">
        <p className="text-sm text-cyan-400 font-semibold mb-2">{item.category}</p>
        <h3 className="text-xl font-bold text-gray-100 mb-3">{item.title}</h3>
        <p className="text-gray-300 leading-relaxed">
          {item.content}
        </p>
      </div>
    </div>
  );
};

export default KnowledgeCard;
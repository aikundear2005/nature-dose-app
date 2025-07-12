import React from 'react';
import { Volume2, PlayCircle } from 'lucide-react';
import { type KnowledgeItem } from '../types'; // 修正 #1：從正確的中央類型檔案匯入

type KnowledgeCardProps = {
  item: KnowledgeItem;
  isPlaying: boolean;
  onPlaySound: () => void;
};

const KnowledgeCard = ({ item, isPlaying, onPlaySound }: KnowledgeCardProps) => {
  // 修正 #2：使用我們在 types.ts 中定義的 `imageUrl` 屬性
  const imageUrl = item.imageUrl;

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-cyan-500/20 hover:scale-[1.02]">
      <div className="relative">
        <img src={imageUrl} alt={item.title} className="w-full h-40 object-cover" />
        <button
          onClick={onPlaySound}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200
                      ${
                        isPlaying
                          ? 'bg-cyan-500/80 text-white scale-110'
                          : 'bg-black/50 text-gray-200 hover:bg-cyan-500/70 hover:scale-110'
                      }`}
          aria-label={`播放 ${item.title} 的聲音`}
        >
          {isPlaying ? <Volume2 size={20} className="animate-pulse" /> : <PlayCircle size={20} />}
        </button>
      </div>

      <div className="p-5">
        {/* 修正 #3：`category` 和 `content` 不在我們的 KnowledgeItem 類型中，改用 `description` */}
        <h3 className="text-xl font-bold text-gray-100 mb-3">{item.title}</h3>
        <p className="text-gray-300 leading-relaxed">{item.description}</p>
      </div>
    </div>
  );
};

export default KnowledgeCard;
import React, { useState, useEffect } from 'react';
import KnowledgeCard from '../components/KnowledgeCard';

// 步驟 1: 更新資料結構，加入 audioName 欄位
export type KnowledgeItem = {
  id: number;
  title: string;
  content: string;
  imageName: string; 
  audioName: string; // 新增：對應 public 資料夾中的音訊檔名
  category: string;
};

// 步驟 2: 更新靜態資料，填上圖片和音訊的檔名
// ✨ 注意：我已經將 imageName 的副檔名從 .jpg 改為 .webp
const knowledgeData: KnowledgeItem[] = [
  {
    id: 1,
    title: '陽光與維生素D',
    content: '每天接觸適量的陽光，能幫助身體合成維生素D，這對骨骼健康和免疫系統至關重要。建議在上午或傍晚陽光較溫和時進行戶外活動。',
    imageName: 'knowledge_sunlight.webp',
    audioName: 'sound_sunlight.mp3', // 新增
    category: '身心健康',
  },
  {
    id: 2,
    title: '什麼是「森林浴」？',
    content: '「森林浴」(Shinrin-yoku) 源自日本，指的是沉浸在森林環境中，透過感官體驗大自然。研究顯示，森林浴能有效降低壓力、改善情緒並提升專注力。',
    imageName: 'knowledge_forest.webp',
    audioName: 'sound_forest.mp3', // 新增
    category: '自然療法',
  },
  {
    id: 3,
    title: '鳥鳴的療癒效果',
    content: '聆聽自然的聲音，特別是鳥鳴，被證實能夠減輕焦慮和精神疲勞。下次在公園時，不妨放下耳機，專心感受周遭的聲音。',
    imageName: 'knowledge_birds.webp',
    audioName: 'sound_birds.mp3', // 新增
    category: '身心健康',
  },
];

const KnowledgePage = () => {
  // --- 新增：聲音播放的狀態管理 ---
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  // 播放/暫停聲音的處理函式
  const handlePlaySound = (item: KnowledgeItem) => {
    // 如果點擊的是正在播放的音樂，就暫停它
    if (audio && playingId === item.id) {
      audio.pause();
      setPlayingId(null);
      setAudio(null);
      return;
    }

    // 如果有其他音樂正在播放，先暫停它
    if (audio) {
      audio.pause();
    }
    
    // 建立新的 Audio 物件並播放
    const newAudio = new Audio(`/${item.audioName}`);
    newAudio.play();
    setAudio(newAudio);
    setPlayingId(item.id);

    // 監聽聲音是否播放完畢，如果結束就重設狀態
    newAudio.onended = () => {
      setPlayingId(null);
      setAudio(null);
    };
  };

  // 當元件卸載時，確保停止任何正在播放的音樂，避免背景繼續播放
  useEffect(() => {
    return () => {
      audio?.pause();
    };
  }, [audio]);
  // --- 新增結束 ---

  return (
    <div className="p-6 pt-12 text-gray-100 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">自然小知識</h1>
      
      <div className="space-y-6">
        {knowledgeData.map((item) => (
          // ✨ 修改重點: 將播放函式和播放狀態傳遞給卡片元件
          <KnowledgeCard 
            key={item.id} 
            item={item}
            isPlaying={playingId === item.id}
            onPlaySound={() => handlePlaySound(item)}
          />
        ))}
      </div>
    </div>
  );
};

export default KnowledgePage;
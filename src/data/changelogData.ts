// 這個檔案專門用來存放我們的更新日誌

// 定義每條更新說明的格式
type ChangeLog = {
  icon: string; // 用於未來可能想在每條說明前加上圖示
  text: string;
};

// 定義每個版本的更新日誌格式
type VersionLog = {
  version: string;
  changes: ChangeLog[];
};

// 我們將所有版本的更新日誌都放在這個陣列中
// 未來有 Beta 0.3、Beta 0.4 都可以繼續往上加
export const changelogData: VersionLog[] = [
  {
    version: 'Beta 0.2',
    changes: [
      {
        icon: ' Compass',
        text: '探索真實世界：主頁下方的「附近的好去處」現在會顯示您周遭真實的公園或綠地了！',
      },
      {
        icon: 'BookOpen',
        text: '全新的「小知識」頁面：新增了專屬頁面，提供關於自然與健康的有趣新知。',
      },
      {
        icon: 'Volume2',
        text: '身歷其境的聲音體驗：在「小知識」頁面，點擊卡片右上角的圖示，就能聽見對應的自然音效。',
      },
      {
        icon: 'Shield',
        text: '更注重您的隱私：現在 App 只會顯示您所在的大致區域，不再透露精確位置。',
      },
      {
        icon: 'Sun',
        text: '全新的深色模式：為了讓您在夜晚使用時眼睛更舒適，我們設計了全新的介面風格。',
      },
      {
        icon: 'Sparkles',
        text: '更友善的歡迎畫面：我們重新設計了初次使用的歡迎畫面，讓 App 的核心理念一目了然。',
      },
    ],
  },
  // 未來可以新增 Beta 0.1 的紀錄
];
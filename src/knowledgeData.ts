// 為了讓程式碼更嚴謹，我們先定義好資料的「格式」
export type KnowledgeCard = {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  icon: string; // 我們將使用 lucide-react 的圖示名稱
};

export type KnowledgeCategory = {
  id: string;
  title: string;
  icon: string;
  cards: KnowledgeCard[];
};

// 這是我們 App 的核心知識庫
const knowledgeData: KnowledgeCategory[] = [
  {
    id: 'time',
    title: '時間建議',
    icon: 'Clock',
    cards: [
      {
        id: 'time-1',
        title: '新手起步',
        subtitle: '2分鐘散步',
        content: '即使是極短時間的活動，也能對學習能力與記憶力產生正面影響。',
        icon: 'Baby',
      },
      {
        id: 'time-2',
        title: '活化大腦',
        subtitle: '10分鐘慢走',
        content: '能有效促進大腦中各類記憶通路之間的互動與連結。',
        icon: 'BrainCircuit',
      },
      {
        id: 'time-3',
        title: '日常保養',
        subtitle: '20分鐘戶外活動',
        content: '到街區附近走走、抬頭看看天空、與人互動，是最好的自我關懷。',
        icon: 'Coffee',
      },
      {
        id: 'time-4',
        title: '深度療癒',
        subtitle: '60分鐘每日散步',
        content: '特別是在綠色空間中，有助於穩定情緒，是緩解憂鬱的有效方法。',
        icon: 'HeartHandshake',
      },
      {
        id: 'time-5',
        title: '科學實證',
        subtitle: '90分鐘自然步行',
        content: '能顯著降低大腦中與負面思考、憂鬱相關的關鍵區域活動。',
        icon: 'TestTube',
      },
    ],
  },
  {
    id: 'health',
    title: '健康效益',
    icon: 'HeartPulse',
    cards: [
      {
        id: 'health-1',
        title: '改善情緒',
        subtitle: '心理健康',
        content: '戶外活動是天然的抗憂鬱劑，能有效緩解焦慮，帶來平靜感受。',
        icon: 'Smile',
      },
      {
        id: 'health-2',
        title: '提升專注力',
        subtitle: '心理健康',
        content: '自然環境能幫助我們疲勞的大腦「軟重啟」，恢復寶貴的專注力。',
        icon: 'Target',
      },
      {
        id: 'health-3',
        title: '心血管健康',
        subtitle: '身體健康',
        content: '規律的戶外散步是強化心肺功能、促進血液循環最簡單有效的方式。',
        icon: 'Heart',
      },
      {
        id: 'health-4',
        title: '促進新陳代謝',
        subtitle: '身體健康',
        content: '早餐前散步或在涼爽天氣下活動，有助於提升脂肪燃燒效率。',
        icon: 'Flame',
      },
      {
        id: 'health-5',
        title: '改善睡眠品質',
        subtitle: '整體效益',
        content: '日間接受充足的戶外光線，有助於調節生理時鐘，讓您晚上睡得更香甜。',
        icon: 'BedDouble',
      },
    ],
  },
  {
    id: 'tips',
    title: '實用技巧',
    icon: 'WandSparkles',
    cards: [
      {
        id: 'tips-1',
        title: '晨間散步',
        subtitle: '時間安排',
        content: '研究發現，早餐前進行戶外活動，燃燒脂肪的效果可能是其他時段的兩倍。',
        icon: 'Sunrise',
      },
      {
        id: 'tips-2',
        title: '優先綠色空間',
        subtitle: '地點選擇',
        content: '公園、森林、河岸步道或任何有植物的地方，帶來的效益遠大於都市街道。',
        icon: 'Trees',
      },
      {
        id: 'tips-3',
        title: '數位排毒',
        subtitle: '心境調整',
        content: '嘗試暫時關閉手機或網路，讓自己完全沉浸在當下的環境中。',
        icon: 'SmartphoneNfc',
      },
      {
        id: 'tips-4',
        title: '五感體驗',
        subtitle: '心境調整',
        content: '專心去聆聽鳥叫、感受微風、聞聞花草香，讓所有感官都參與進來。',
        icon: 'Ear',
      },
      {
        id: 'tips-5',
        title: '天氣應對',
        subtitle: '事前準備',
        content: '晴天注意防曬，雨天可以選擇有遮蔽的走廊或穿上雨具，別讓天氣阻止你。',
        icon: 'Umbrella',
      },
    ],
  },
  {
    id: 'research',
    title: '科學研究',
    icon: 'FlaskConical',
    cards: [
      {
        id: 'research-1',
        title: '大腦科學',
        subtitle: '史丹佛大學研究',
        content: '在自然環境中步行90分鐘，能有效降低與憂鬱風險相關的腦區「前額葉皮質」的活躍程度。',
        icon: 'Brain',
      },
      {
        id: 'research-2',
        title: '代謝研究',
        subtitle: '英國巴斯大學',
        content: '早餐前運動的組別，其脂肪燃燒效率是早餐後運動組的兩倍，且胰島素敏感度更高。',
        icon: 'Flame',
      },
      {
        id: 'research-3',
        title: '認知心理學',
        subtitle: '密西根大學研究',
        content: '接觸自然能有效恢復因長時間專心而疲勞的「直接注意力」，讓思緒更清晰。',
        icon: 'BookOpen',
      },
    ],
  },
];

export default knowledgeData;

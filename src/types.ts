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

// 新增這段程式碼
export type KnowledgeItem = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  audioUrl: string;
};
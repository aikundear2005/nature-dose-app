// --- 這是偵錯專用的版本 ---
import { type VercelRequest, type VercelResponse } from '@vercel/node';

export default async (req: VercelRequest, res: VercelResponse) => {
  
  const apiKey = process.env.MAPTILER_API_KEY;

  // 檢查 API 金鑰是否存在
  if (apiKey && apiKey.length > 5) {
    // 如果金鑰存在，回傳一個成功的 JSON 訊息
    return res.status(200).json({ 
      message: '偵錯成功：API 金鑰已成功讀取！',
      keyPreview: `...${apiKey.slice(-4)}` // 顯示金鑰的末四碼以供確認
    });
  } else {
    // 如果金鑰不存在或為空，回傳一個明確的錯誤 JSON
    return res.status(500).json({ 
      error: '偵錯失敗：伺服器未能讀取到 MAPTILER_API_KEY 環境變數。' 
    });
  }
};
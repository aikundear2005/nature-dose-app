import { type VercelRequest, type VercelResponse } from '@vercel/node';

export default async (req: VercelRequest, res: VercelResponse) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.MAPTILER_API_KEY;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }
  
  if (!apiKey) {
    return res.status(500).json({ error: 'API key is not configured on the server' });
  }

  const query = 'park';
  const apiUrl = `https://api.maptiler.com/search/v1/${query}.json?key=${apiKey}&proximity=${lon},${lat}&limit=10`;

  try {
    const apiResponse = await fetch(apiUrl);
    const data = await apiResponse.json();
    
    if (!apiResponse.ok) {
      // 如果 MapTiler 回傳錯誤，也將其傳遞給前端
      return res.status(apiResponse.status).json(data);
    }
    
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
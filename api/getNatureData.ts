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

  const apiUrl = `https://api.maptiler.com/geocoding/v2/${lon},${lat}.json?key=${apiKey}`;

  try {
    const apiResponse = await fetch(apiUrl);
    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      return res.status(apiResponse.status).json(data);
    }
    
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
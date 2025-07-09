import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const { lat, lon } = request.query;
  const apiKey = process.env.MAPTILER_API_KEY;

  if (!lat || !lon) {
    return response.status(400).json({ error: 'Latitude and longitude are required' });
  }

  if (!apiKey) {
    return response.status(500).json({ error: 'API key is not configured' });
  }

  const apiUrl = `https://api.maptiler.com/geocoding/v2/${lon},${lat}.json?key=${apiKey}`;

  try {
    const apiResponse = await fetch(apiUrl);
    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      return response.status(apiResponse.status).json({ error: 'Failed to fetch from MapTiler Geocoding API', details: errorText });
    }
    const data = await apiResponse.json();
    return response.status(200).json(data);
  } catch (error) {
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}
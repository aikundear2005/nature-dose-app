const fetch = require('node-fetch');

module.exports = async (req, res) => {
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
    
    // 設置CORS頭，允許所有來源訪問，這在API路由中是個好習慣
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(apiResponse.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
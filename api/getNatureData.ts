// --- 這是「Hello World」終極偵錯版本 ---

export default (req, res) => {
  try {
    res.status(200).json({ 
      message: "API 路由運作正常！Hello World!",
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    res.status(500).json({ error: "執行 res.status(200).json 時發生錯誤", details: e.message });
  }
};
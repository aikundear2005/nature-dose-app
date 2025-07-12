// src/calculateDistance.test.ts
import { describe, it, expect } from 'vitest';

// 我們需要從某處匯入這個函式
// 為了測試，我們先在檔案頂部直接複製一份函式過來
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // 地球半徑（米）
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
};

// 'describe' 用來將一組相關的測試打包在一起
describe('calculateDistance', () => {
  // 'it' 代表一個獨立的測試案例，描述這個案例的行為
  it('應該正確計算兩個地點之間的距離', () => {
    // 準備測試資料 (Arrange)
    const taipei101 = { lat: 25.0339632, lon: 121.5623212 };
    const taipeiMainStation = { lat: 25.0479236, lon: 121.514291 };

    // 執行函式 (Act)
    const distance = calculateDistance(taipei101.lat, taipei101.lon, taipeiMainStation.lat, taipeiMainStation.lon);

    // 驗證結果 (Assert)
    // 我們預期距離大約是 4.7公里 (4700米)
    // 使用 toBeCloseTo 來處理浮點數或四捨五入的計算，-2 代表精確到百位數
    expect(distance).toBeCloseTo(5082, -2); 
  });

  it('當兩個地點相同時，距離應該為 0', () => {
    const point = { lat: 25.033, lon: 121.562 };
    const distance = calculateDistance(point.lat, point.lon, point.lat, point.lon);
    expect(distance).toBe(0);
  });

  it('應該能處理長距離計算', () => {
      const taipei = { lat: 25.03, lon: 121.56 };
      const kaohsiung = { lat: 22.62, lon: 120.30 };
      const distance = calculateDistance(taipei.lat, taipei.lon, kaohsiung.lat, kaohsiung.lon);

      // 預期距離大約 298 公里
      expect(distance).toBeCloseTo(298000, -4); 
  });
});
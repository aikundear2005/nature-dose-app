import React from 'react';
// 引入 Swiper 的 React 元件
import { Swiper, SwiperSlide } from 'swiper/react';
// 引入 Swiper 需要的模組，例如分頁(Pagination)
import { Pagination } from 'swiper/modules';
// 引入 Swiper 的核心樣式
import 'swiper/css';
// 引入分頁樣式
import 'swiper/css/pagination';

// 引入我們需要的圖示
import { Leaf, MapPin, TrendingUp } from 'lucide-react';

// 定義一個 props type，讓這個元件可以接收一個名為 onComplete 的函式
type OnboardingProps = {
  onComplete: () => void;
};

const Onboarding = ({ onComplete }: OnboardingProps) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-50 to-blue-50 z-50 flex flex-col">
      <Swiper
        // 安裝 pagination 模組
        modules={[Pagination]}
        // 只有一個 slide
        slidesPerView={1}
        // 顯示分頁 (底下的小圓點)
        pagination={{ clickable: true }}
        className="w-full h-full"
      >
        {/* 第一頁 */}
        <SwiperSlide className="flex flex-col items-center justify-center text-center p-8">
          <Leaf className="w-24 h-24 text-green-500 mb-8" strokeWidth={1.5} />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">歡迎來到「自然時光」</h2>
          <p className="text-lg text-gray-600">為您的身心，開一帖「自然處方」。</p>
        </SwiperSlide>

        {/* 第二頁 */}
        <SwiperSlide className="flex flex-col items-center justify-center text-center p-8">
          <MapPin className="w-24 h-24 text-blue-500 mb-8" strokeWidth={1.5} />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">不只記錄時間，更在乎品質</h2>
          <p className="text-lg text-gray-600">App 會根據您所處環境的綠意程度，給予 1-5 分的「自然分數」。</p>
        </SwiperSlide>

        {/* 第三頁 */}
        <SwiperSlide className="flex flex-col items-center justify-center text-center p-8">
          <TrendingUp className="w-24 h-24 text-yellow-500 mb-8" strokeWidth={1.5} />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">高品質的戶外時光 = 更高的積分</h2>
          <p className="text-lg text-gray-600 mb-10">您的積分 = 分鐘數 × 自然分數。在公園裡待 10 分鐘，勝過在街上待 10 分鐘！</p>
          <button 
            onClick={onComplete} // 點擊按鈕時，呼叫從 App.tsx 傳進來的 onComplete 函式
            className="bg-blue-500 text-white py-3 px-8 rounded-full text-xl font-semibold hover:bg-blue-600 transition-colors active:scale-95 shadow-lg"
          >
            我知道了，開始使用！
          </button>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Onboarding;
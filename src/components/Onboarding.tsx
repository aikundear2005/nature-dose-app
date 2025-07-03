import React from 'react';
import { Leaf, Footprints } from 'lucide-react';

type OnboardingProps = {
  onComplete: () => void;
};

const Onboarding = ({ onComplete }: OnboardingProps) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-50 to-blue-50 z-50 flex flex-col justify-center items-center text-center p-8 font-sans">
      <div className="max-w-md w-full">
        {/* 第一行：大標題 */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 flex items-center justify-center">
          <Leaf className="w-10 h-10 md:w-12 md:h-12 text-green-600 mr-3" />
          歡迎使用自然時光
        </h1>

        {/* 第二行：副標題 */}
        <p className="text-xl md:text-2xl text-gray-600 mt-4">
          給自己一點自然時光
        </p>

        {/* 第三到第五行：核心說明 */}
        <div className="mt-8 text-lg text-gray-700 space-y-2">
          <p>每天只需要...</p>
          <p className="flex items-center justify-center font-semibold text-2xl text-green-700 my-3">
            <Footprints className="w-7 h-7 mr-2" />
            20分鐘戶外散步
          </p>
          <p>就能為身心帶來意想不到的改變。</p>
        </div>

        {/* 第六到第九行：行動建議 */}
        <div className="mt-8 text-base text-gray-500">
          <p>簡單開始：</p>
          <p className="mt-2">到附近走走</p>
          <p>抬頭看看天空</p>
          <p>呼吸新鮮空氣</p>
        </div>

        {/* 第十行與按鈕 */}
        <div className="mt-10">
          <p className="text-lg text-gray-800 mb-4">準備好了嗎？</p>
          <button
            onClick={onComplete}
            className="bg-blue-500 text-white py-3 px-10 rounded-full text-xl font-semibold hover:bg-blue-600 transition-colors active:scale-95 shadow-lg"
          >
            開始使用
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
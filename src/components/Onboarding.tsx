import React from 'react';
import { Leaf, Footprints, CheckCircle } from 'lucide-react';

type OnboardingProps = {
  onComplete: () => void;
};

const Onboarding = ({ onComplete }: OnboardingProps) => {
  return (
    // ✨ 修改重點: 我們還原 flex 佈局來做置中，並移除 overflow-y-auto
    <div className="fixed inset-0 bg-gray-900 text-white z-50 flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-md">

        {/* 我們為每個區塊加上了特定的 data-test-id，方便在 CSS 中單獨調整間距 */}
        <div data-test-id="onboarding-icon" className="mb-6">
          <Leaf className="w-16 h-16 text-green-400 mx-auto" strokeWidth={1.5} />
        </div>
        
        <div data-test-id="onboarding-title" className="mb-3">
            <h1 className="text-4xl font-bold text-gray-100">給自己一點自然時光</h1>
        </div>
       
        
        <div data-test-id="onboarding-feature-box" className="my-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <p className="text-gray-400 mb-4">每天只需要...</p>
            <div className="flex items-center justify-center space-x-4">
              <Footprints className="w-10 h-10 text-green-400" strokeWidth={2} />
              <p className="text-3xl font-bold text-white">20分鐘戶外散步</p>
            </div>
          </div>
        </div>

        <div data-test-id="onboarding-description" className="mb-8">
            <p className="text-gray-300 text-lg">就能為身心帶來意想不到的改變</p>
        </div>
        
        <div data-test-id="onboarding-checklist" className="my-8">
          <div className="space-y-4 text-left inline-block">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
              <span className="text-lg text-gray-200">簡單開始，到附近走走</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
              <span className="text-lg text-gray-200">抬頭看看天空</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
              <span className="text-lg text-gray-200">呼吸新鮮空氣</span>
            </div>
          </div>
        </div>
        
        <div data-test-id="onboarding-ready-text" className="mb-10">
            <p className="text-xl text-gray-100 font-semibold">準備好了嗎？</p>
        </div>

        <button
          onClick={onComplete}
          className="w-full max-w-xs mx-auto bg-green-600 text-white py-4 px-8 rounded-full text-xl font-semibold hover:bg-green-700 transition-colors active:scale-95 shadow-lg shadow-green-500/20"
        >
          開始使用
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
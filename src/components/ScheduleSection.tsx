
import React from 'react';

const ScheduleSection = () => {
  return (
    <section className="calligraphy-section">
      <h2 className="calligraphy-section-title">심사계획서</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">행사명</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#C53030]" 
              placeholder="제32회 동양서예대전"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">심사일자</label>
            <input 
              type="date" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#C53030]" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">심사장소</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#C53030]" 
              placeholder="서울시립미술관 서예관"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">심사위원</label>
          <div className="flex flex-wrap gap-2">
            {['한석봉', '김정희', '추사', '우휘지', '왕희지'].map((name, index) => (
              <div key={index} className="flex items-center bg-white px-3 py-1 rounded-md border border-gray-200">
                <span>{name}</span>
                <button className="ml-2 text-gray-400 hover:text-red-500">×</button>
              </div>
            ))}
            <button className="text-[#C53030] border border-[#C53030] px-3 py-1 rounded-md hover:bg-[#C53030] hover:text-white transition-colors">
              + 추가
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">심사부문</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#C53030]" 
                placeholder="한글 부문"
              />
            </div>
            <div>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#C53030]" 
                placeholder="한문 부문"
              />
            </div>
          </div>
          <button className="mt-2 text-[#C53030] text-sm hover:underline">
            + 부문 추가
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">심사 계획 메모</label>
          <textarea 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#C53030] h-24" 
            placeholder="심사 진행 계획에 대한 메모를 입력하세요."
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button className="bg-[#C53030] text-white px-4 py-2 rounded-md hover:bg-[#B52020] transition-colors">
            계획서 저장
          </button>
        </div>
      </div>
    </section>
  );
};

export default ScheduleSection;
